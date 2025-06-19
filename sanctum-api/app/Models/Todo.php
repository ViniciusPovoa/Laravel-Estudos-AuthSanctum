<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    protected $fillable = [
        'title', 
        'completed', 
        'description', 
        'deadline', 
        'priority', 
        'document_path', 
        'categories_id', // Corrigi a vírgula mal colocada aqui
        'user_id' // Adicione se necessário
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Adicione este novo relacionamento
    public function category()
    {
        return $this->belongsTo(Categories::class, 'categories_id');
    }
}