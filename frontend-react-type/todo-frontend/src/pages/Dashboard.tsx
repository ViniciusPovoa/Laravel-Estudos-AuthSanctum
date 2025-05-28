import { useEffect, useState } from "react";
import api from '../api';

interface Todo {
    id: number;
    title: string;
    completed: boolean;
    description: string;
    deadline: string;
    priority: string;
}

export default function Dashboard() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [form, setForm] = useState({
        title: "",
        description: "",
        deadline: "",
        priority: "",
    });

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        const token = localStorage.getItem('apitoken');
        if (!token) return;

        try {
            const res = await api.get('/api/todos', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTodos(res.data);
        } catch (error) {
            console.error("Erro ao buscar todos:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('apitoken');
        if (!token) return;

        try {
            await api.post("/api/todos", form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setForm({ title: "", description: "", deadline: "", priority: "" });
            fetchTodos();
        } catch (err) {
            console.error("Erro ao criar todo:", err);
        }
    };

    return (
        <div>
            <h2>Minhas Tarefas</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Título"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Descrição"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                />
                <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                    <option value="">Prioridade</option>
                    <option value="high">Alta</option>
                    <option value="medium">Média</option>
                    <option value="low">Baixa</option>
                </select>
                <button type="submit">Criar tarefa</button>
            </form>

            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        <strong>{todo.title}</strong> - {todo.priority}
                        <br />
                        {todo.description} | {todo.deadline}
                    </li>
                ))}
            </ul>
        </div>
    );
}
