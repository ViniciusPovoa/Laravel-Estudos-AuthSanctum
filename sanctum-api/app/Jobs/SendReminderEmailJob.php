<?php

namespace App\Jobs;

use App\Mail\TaskReminder;
use App\Models\Todo;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendReminderEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $tomorrow = now()->addDay()->toDateString();
        $todos = Todo::whereDate('deadline', $tomorrow)
        ->where('completed', false)
        ->with('user')
        ->get();


        foreach($todos as $todo){
            Mail::to($todo->user->email)->send(new TaskReminder($todo));
            $user = Auth::user();
            Log::info("Enviado com sucesso para {id}", $user->id);
        }
    }
}
