<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoriesController extends Controller
{


    public function index() {
        $categories = Auth::user()->categories;

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    public function store(Request $request){

        $data = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $categories = Auth::user()->categories()->create($data);

        return response()->json([
            'sucess' => true,
            'data' => $categories
        ]);

    }

    public function show($id){

        $categories = Auth::user()->categories()->find($id);

        if(!$categories){
            return response()->json(['message' => 'categoria nao encontrada ou nao é sua'], 403);
        }

        return response()->json(['sucess' => true,
        'data'=> $categories]);
        }


    public function update(Request $request, $id){

        $categories = Auth::user()->categories()->findOrFail($id);

        $data = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $categories->update($data);

        return response()->json([
            'sucess' => true,
            'data' => $categories
        ]);

    }

    public function destroy($id){
        $categories = Auth::user()->categories()->findOrFail($id);
        $categories->delete();

        return response()->json(['message' => 'categoria deletada com sucesso']);
    }


}
