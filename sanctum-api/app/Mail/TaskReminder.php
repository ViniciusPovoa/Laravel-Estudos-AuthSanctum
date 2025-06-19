<?php


namespace App\Mail;

use App\Models\Todo;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TaskReminder extends Mailable
{
    use Queueable, SerializesModels;

    public $todo;

    public function __construct(Todo $todo){
        $this -> todo = $todo;
    }
    public function build(): static
    {
        return $this->subject("Lembrete: sua tarefa está vencendo")
        -> markdown('emails.task.reminder');
    }

}