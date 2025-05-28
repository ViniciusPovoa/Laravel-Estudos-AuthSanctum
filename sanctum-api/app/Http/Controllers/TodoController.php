<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class TodoController extends Controller
{

    public function index()
    {
        return Auth::user()->todos()->orderBy('deadline')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'deadline' => 'required|date',
            'priority' => 'required|string|max:255',
        ]);

        return Auth::user()->todos()->create($data);
    }

 public function show($id)
{
    $todo = Auth::user()->todos()->find($id);

    if (!$todo) {
        return response()->json(['message' => 'Tarefa não encontrada ou não é sua'], 403);
    }

    return $todo;
}


    public function update(Request $request, $id)
    {
        $todo = Auth::user()->todos()->findOrFail($id);

        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'completed' => 'sometimes|boolean',
            'description' => 'sometimes|string|max:255',
            'deadline' => 'sometimes|date',
            'priority' => 'sometimes|string|max:255'
        ]);

        $todo->update($data);
        return $todo;
    }

    public function destroy($id)
    {
        $todo = Auth::user()->todos()->findOrFail($id);
        $todo->delete();
        return response()->json(['message' => 'Tarefa deletada com sucesso']);
    }
}
