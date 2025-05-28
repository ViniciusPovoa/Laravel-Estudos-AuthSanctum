import { useState } from "react";
import api from '../api';
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await api.post('/api/login', { email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error: any) {
            if (error.response || error.response.status === 403) {
                setError("Você precisa verificar seu e-mail antes de acessar a dashboard.");
            } else {
                setError("Erro ao fazer login.");
            }
        }
    }

    return (
        <div className='login-container'>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}> {error}</p>}

            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                </div>

                <div>
                    <label>Senha:</label>
                    <input type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Entrar</button>

            </form>
        </div>
    );

}