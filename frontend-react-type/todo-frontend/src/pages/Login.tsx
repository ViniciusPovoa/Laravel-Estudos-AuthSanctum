import { useState } from "react";
import api from '../api';
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert, Spinner, Card, FormGroup } from "react-bootstrap";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await api.post('/api/login', { email, password });
            localStorage.setItem('apitoken', response.data.token);

            const isEmailVerified = !!response.data.user.email_verified_at;

            localStorage.setItem('email_verified', isEmailVerified ? 'true' : 'false');

            if (!isEmailVerified) {
                return navigate('/login');
            } else {
                return navigate('/dashboard');
            }

        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setError("Você precisa verificar seu e-mail antes de acessar a dashboard.");
            } else {
                setError("Erro ao fazer login.");
            }
        }
    }

    return (
        <Container fluid className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={8} md={6} lg={5}>
                    <Card className="shadow p-4 rounded-4 border-0">
                        <div className="text-center mb-4">
                            <h1 className="fw-bold mb-3"> Realize o seu login</h1>
                            <p className="text-muted">Seja bem vindo de volta!</p>
                        </div>

                        {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

                        <Form onSubmit={handleLogin} noValidate>
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label className="fw-semibold">Email </Form.Label>
                                <Form.Control type="email" placeholder="exemplo@gmail.com" value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="py-2 rounded-3"
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="password">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <Form.Label className="fw-semibold">Senha</Form.Label>
                                    <a href="/forgot-password" className="text-decoration-none text-primary">
                                        Esqueceu a senha?
                                    </a>
                                </div>
                                <Form.Control
                                    type="password"
                                    placeholder="Sua senha"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="py-2 rounded-3"
                                />
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="rememberMe">
                                <Form.Check
                                    type="checkbox"
                                    label="lembrar de mim"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    disabled={loading}
                                />

                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100 fw-semibold py-2 rounded-3"
                                disabled={loading}
                                size="lg">

                                {loading ? (
                                    <>
                                        <Spinner animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                        Entrando...
                                    </>
                                ) : (
                                    "Login"
                                )}
                            </Button>
                        </Form>
                        <div className="text-center mt-4">
                            <p className="text-muted">
                                Não possui uma conta?
                                <a href="/register" className="text-decoration-none text-primary"> Faça o seu cadastro</a>
                            </p>
                        </div>
                    </Card>

                    <div className="text-center mt-5">
                        <h2 className="fw-bold mb-3">VPovoa</h2>
                        <p className="text-muted">
                            Faça o login para continuar aproveitando.
                        </p>
                    </div>


                </Col>


            </Row>
        </Container>
    );
}