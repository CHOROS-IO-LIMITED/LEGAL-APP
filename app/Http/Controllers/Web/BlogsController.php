<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Inertia\Inertia;
use Carbon\Carbon;

class BlogsController extends Controller
{
    public function index()
    {
        $blogs = Blog::orderBy('date', 'desc')->get()->map(function ($blog) {
            return [
                'id' => $blog->id,
                'slug' => $blog->slug,
                'title' => $blog->title,
                'author' => $blog->author,
                'date' => Carbon::parse($blog->date)->format('F j, Y'),
                'views' => $blog->views,
                'description' => $blog->description,
                'image' => $blog->image,
            ];
        });

        return Inertia::render('Web/Blogs/Index', [
            'blogs' => $blogs,
        ]);
    }

    public function show($slug)
    {
        $blog = Blog::where('slug', $slug)->firstOrFail();

        // Increment views in the database
        $blog->increment('views');
        $blog->refresh(); // reload the updated views

        // Related articles (exclude current)
        $related = Blog::where('id', '!=', $blog->id)
            ->orderBy('date', 'desc')
            ->take(3)
            ->get()
            ->map(function ($b) {
                return [
                    'id' => $b->id,
                    'slug' => $b->slug,
                    'title' => $b->title,
                    'author' => $b->author,
                    'date' => Carbon::parse($b->date)->format('F j, Y'),
                    'views' => $b->views,
                    'description' => $b->description,
                    'image' => $b->image ?? '/images/blog/default.webp',
                ];
            });

        $component = $this->slugToComponent($slug);

        return Inertia::render(
            "Web/Blogs/BlogPages/" . $component,
            [
                'blog' => [
                    'id' => $blog->id,
                    'slug' => $blog->slug,
                    'title' => $blog->title,
                    'author' => $blog->author,
                    'date' => Carbon::parse($blog->date)->format('F j, Y'),
                    'views' => $blog->views, // now reflects the incremented count
                    'description' => $blog->description,
                    'image' => $blog->image ?? '/images/blog/default.webp',
                ],
                'relatedArticles' => $related,
            ]
        );
    }

    private function slugToComponent(string $slug): string
    {
        return collect(explode('-', $slug))
            ->map(fn($word) => ucfirst($word))
            ->implode('');
    }
}
