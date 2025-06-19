<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categories extends Model
{
    protected $fillable =  ['name', 'user_id'];

    public function user(){
        return $this->belongsTo(User::class); 
    }

      public function todos()
    {
        return $this->hasMany(Todo::class, 'categories_id');
    }
}
