<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Blog;
use Carbon\Carbon;

class BlogsSeeder extends Seeder
{
    public function run(): void
    {
        $blogs = [
            [
                'slug' => 'the-future-of-legal-services',
                'title' => 'The Future of Legal Services: Fast, Accessible, and AI Powered',
                'author' => 'Phiroze Daver',
                'date' => Carbon::parse('2026-03-20'),
                'views' => 0,
                'description' => 'Discover how Daver & Daver combines AI efficiency with licensed lawyer oversight to make legal services fast, simple,
                            and accessible. Learn how what once took days can now be done in minutes, empowering businesses and individuals alike.',
                'image' => '/images/blog/articles/The-Future-of-Legal-Services.webp',
            ],
            [
                'slug' => 'how-ai-is-transforming-legal-document-creation',
                'title' => 'How AI is Transforming Legal Document Creation',
                'author' => 'Phiroze Daver',
                'date' => Carbon::parse('2026-03-15'),
                'views' => 0,
                'description' => 'See how AI is revolutionizing the way legal documents are created. From partnership agreements to contracts, Daver &
                            Daver uses intelligent automation plus professional review to make drafting faster, smarter, and more reliable.',
                'image' => '/images/blog/articles/How-AI-is-Transforming-Legal-Document-Creation.webp',
            ],
            [
                'slug' => 'why-small-businesses-need-smarter-legal-tools',
                'title' => 'Why Small Businesses Need Smarter Legal Tools',
                'author' => 'Phiroze Daver',
                'date' => Carbon::parse('2026-03-16'),
                'views' => 0,
                'description' => ' Small businesses often struggle to access affordable legal support. Learn how Daver & Daver helps companies protect
                                their interests, reduce risk, and operate confidently with easy-to-create, professional legal documents.',
                'image' => '/images/blog/articles/Why-Small-Businesses-Need-Smarter-Legal-Tools.webp',
            ],
            [
                'slug' => 'from-idea-to-signed-document-in-minutes',
                'title' => 'From Idea to Signed Document in Minutes',
                'author' => 'Phiroze Daver',
                'date' => Carbon::parse('2026-03-18'),
                'views' => 0,
                'description' => 'Turn ideas into legally binding documents quickly and seamlessly. Daver & Daver streamlines the entire workflow, from
                                AI generation to lawyer review and instant signing, so your agreements move forward without delay.',
                'image' => '/images/blog/articles/From-Idea-to-Signed-Document-in-Minutes.webp',
            ],
        ];

        foreach ($blogs as $blog) {
            Blog::create($blog);
        }
    }
}
