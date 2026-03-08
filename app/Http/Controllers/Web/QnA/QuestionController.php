<?php

namespace App\Http\Controllers\Web\QnA;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionController extends Controller
{
    //
    public function index()
    {
        return Inertia::render('Web/Products/Explore/QnA/Index');
    }
}
