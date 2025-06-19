import { useState } from "react";
import api from '../api';
import { Navigate, useNavigate } from "react-router-dom";

export default function Register(){
    const[name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async(e: React.FormEvent) => {
        e.preventDefault();

        try{
            const response = await api.post('/api/register', {name, email, password, password_confirmation: confirmPassword});
            localStorage.setItem('token', response.data.token);
            navigate('/login');
        } catch(err: any){
            console.error(err);
            setError("Não foi possível registrar");
        }
    }

    return (
        <div>
            <h2>Registrar</h2>
            {error && <p style={{color: "red"}}> {error}</p>}

            <form onSubmit={handleRegister}>
                <div>
                    <label htmlFor="">Nome:</label>
                    <input type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)} 
                    required
                    />
                </div>

                <div>
                    <label htmlFor="">E-mail:</label>
                    <input type="email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </div>

                <div>
                    <label htmlFor="">Senha:</label>
                    <input type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </div>

                <div>
                    <label htmlFor="">Confirme a senha:</label>
                    <input type="password"
                    value={confirmPassword} 
                    onChange={(e)=> setConfirmPassword(e.target.value)}
                    required
                    />
                </div>

                <button type="submit">Registrar</button>

            </form>
        </div>
    )

}