<?php

use App\Jobs\SendReminderEmailJob;
use Illuminate\Support\Facades\Artisan;




    Artisan::command('todo:send-reminders', function () {
        $this->info('Enviando lembretes de tarefas...');
        SendReminderEmailJob::dispatch();
        $this->info('Lembretes enfileirados com sucesso!');
    })->purpose('Envia lembretes para tarefas que vencem amanhã.');
