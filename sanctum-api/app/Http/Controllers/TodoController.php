<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class TodoController extends Controller
{

    public function index()
    {
        return Auth::user()->todos()->orderBy('deadline')->get();
    }


    public function store(Request $request)
    {   
        Log::info('Token recebido:', [request()->bearerToken()]);



        $data = $request->validate([
    'title' => 'required|string|max:255',
    'description' => 'nullable|string|max:255',
    'deadline' => 'required|date',
    'priority' => 'required|in:high,medium,low',
    'document' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,jpg,png|max:20480',
    'categories_id' => 'nullable|integer|exists:categories,id',
]);

        $todo = Auth::user()->todos()->create($data);

        if ($request->hasFile('document')) {
    $path = $request->file('document')->store('documents', 'public');
    $todo->update(['document_path' => $path]);
  }

  return $todo;
    }

    public function show($id)
    {
    $todo = Auth::user()->todos()->find($id);

    if (!$todo) {
        return response()->json(['message' => 'Tarefa não encontrada ou não é sua'], 403);
    }

    return $todo;
    }

    public function markasCompleted(Request $request, $id)
    {
        $todo = Auth::user()->todos()->findOrFail($id);

        $todo->completed = !$todo->completed;
        $todo->save();
    }




    public function update(Request $request, $id)
    {
        $todo = Auth::user()->todos()->findOrFail($id);

       $data = $request->validate([
    'title' => 'sometimes|string|max:255',
    'completed' => 'sometimes|boolean',
    'description' => 'sometimes|string|max:255',
    'deadline' => 'sometimes|date',
    'priority' => 'sometimes|in:high,medium,low',
    'document' => 'sometimes|file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,jpg,png|max:20480',
    'categories_id' => 'sometimes|integer|exists:categories,id'
]);

$todo->update($data);

if ($request->hasFile('document')) {
    $path = $request->file('document')->store('documents', 'public');
    $todo->update(['document_path' => $path]);
}

return $todo;
    }

    public function destroy($id)
    {
        $todo = Auth::user()->todos()->findOrFail($id);
        $todo->delete();
        return response()->json(['message' => 'Tarefa deletada com sucesso']);
    }


   public function uploadDocument(Request $request, $id)
{
    $todo = Auth::user()->todos()->findOrFail($id);

    $request->validate([
        'document' => 'required|file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,jpg,png|max:20480',
    ]);

    if ($request->hasFile('document')) {
        $path = $request->file('document')->store('documents', 'public');

        $todo->update([
            'document_path' => $path,
        ]);
    }

    return response()->json(['message' => 'Documento enviado!', 'todo' => $todo->refresh()]);
}
}
