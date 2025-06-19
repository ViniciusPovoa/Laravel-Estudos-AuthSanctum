<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Lembrete de Tarefa</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
            color: #333;
        }

        .email-container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        h2 {
            color: #6a1b9a;
        }

        .btn {
            display: inline-block;
            padding: 12px 20px;
            background-color: #6a1b9a;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }

        .footer {
            font-size: 12px;
            color: #888;
            margin-top: 40px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2>Olá {{ $todo->user->name }},</h2>

        <p>Você tem uma tarefa que vence amanhã:</p>

        <ul>
            <li><strong>Título:</strong> {{ $todo->title }}</li>
            <li><strong>Prazo:</strong> {{ \Carbon\Carbon::parse($todo->deadline)->format('d/m/Y') }}</li>
            <li><strong>Descrição:</strong> {{ $todo->description }}</li>
        </ul>

        <a href="{{ url('/tarefas') }}" class="btn">Ver Minhas Tarefas</a>

        <div class="footer">
            Este é um e-mail automático. Por favor, não responda.<br>
            {{ config('app.name') }}
        </div>
    </div>
</body>
</html>
