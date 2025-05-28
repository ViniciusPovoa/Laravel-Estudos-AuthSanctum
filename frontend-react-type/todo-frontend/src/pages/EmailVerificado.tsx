import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function EmailVerificado(){

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {

        const emailVerificado = searchParams.get('email_verified');
        const jaVerificado = searchParams.get('email_already_verified');
        const error = searchParams.get('error');

        if(emailVerificado) {
            alert('Email verificado com sucesso');
            navigate('/login');
        } else if (jaVerificado){
            alert('Seu email ja foi verificado');
            navigate('login');

        } else if(error === 'user_not_found') {
            alert("link invalido");
            navigate('/register');
        } else if( error === 'invalid_verification_link'){
            alert("link de verificação invalido ou experirado");
            navigate("/register")
        }

    },[]);

    return <div>Processando verificação de email...</div>
}