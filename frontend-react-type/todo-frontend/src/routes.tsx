import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from "./pages/Dashboard";
import EmailVerificado from "./pages/EmailVerificado";


export default function AppRoutes(){
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="/email-verify" element={<EmailVerificado/>} />
        </Routes>
        </BrowserRouter>
    );
}