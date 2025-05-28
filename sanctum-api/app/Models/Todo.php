<?php

// app/Models/Todo.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    protected $fillable = ['title', 'completed', 'description', 'deadline', 'priority'];

    

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
