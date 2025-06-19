import { useEffect, useState } from "react";
import api from "../api";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ListGroup,
  Badge,
  Spinner,
} from "react-bootstrap";
import {
  PlusCircle,
  Trash,
  CheckCircle,
  Circle,
  Pencil,
} from "react-bootstrap-icons";

// Interfaces


interface Category {
  id: number;
  name: string;

}


interface EditForm {
  id: number;
  title: string;
  description: string;
  deadline: string;
  priority: string;
  document_path: string | null;
}

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  description: string;
  deadline: string;
  priority: string;
  document_path: string | null;
}

interface FormState {
  title: string;
  description: string;
  deadline: string;
  priority: string;
  document: File | null;
  categories_id: number;
}

export default function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    deadline: "",
    priority: "",
    document: null,
    categories_id: 0
  });
  const [showModal, setShowModal] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    id: 0,
    title: "",
    description: "",
    deadline: "",
    priority: "",
    document_path: "",
  });

  useEffect(() => {
    fetchTodos();
    fetchCategories();
  }, []);


  const createCategory = async () => {
    const token = localStorage.getItem("apitoken");
    
    if(!token || !newCategory.trim()) return;

    try{
      await api.post("/api/categories", { name: newCategory}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error("erro ao criar categoria");
    }
  };

  const fetchCategories = async () => {
    const token = localStorage.getItem('apitoken');

    if(!token) return;

    try {
      const res = await api.get("/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
  setCategories(res.data.data); // Aqui pega o array de categorias
}
    } catch(err) {
      console.log("erro ao buscar categorias", err);
    }
  };

  const fetchTodos = async () => {
    const token = localStorage.getItem("apitoken");
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.get("/api/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos(res.data);
    } catch (error) {
      console.error("Erro ao buscar todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setForm({
        ...form,
        document: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem("apitoken");
    if (!token) return;

     if (form.categories_id <= 0) {
    alert("Por favor, selecione uma categoria válida");
    return;
  }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("deadline", form.deadline);
    formData.append("priority", form.priority);
    formData.append("categories_id", form.categories_id.toString());
    if (form.document) {
      formData.append("document", form.document);
    }

    console.log("Enviando categories_id:", form.categories_id, typeof form.categories_id);
    try {
      await api.post("/api/todos", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setForm({
        title: "",
        description: "",
        deadline: "",
        priority: "",
        document: null,
        categories_id: 0
      });
      fetchTodos();
    } catch (err) {
      console.error("Erro ao criar todo:", err);
    }
  };

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("apitoken");
    if (!token) return;

    const formData = new FormData();
    formData.append("document", file);

    try {
      await api.post(`/api/todos/${id}/upload-document`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Documento enviado!");
      fetchTodos();
    } catch (err) {
      console.error("Erro ao enviar documento:", err);
      alert("Erro ao enviar documento.");
    }
  };

  const toggleComplete = async (id: number) => {
    const token = localStorage.getItem("apitoken");
    if (!token) return;
    try {
      await api.patch(`/api/todos/${id}/toggle`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTodos();
    } catch (err) {
      console.error("Erro ao atualizar todo:", err);
    }
  };

  const deleteTodo = async (id: number) => {
    const token = localStorage.getItem("apitoken");
    if (!token) return;
    try {
      await api.delete(`/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTodos();
    } catch (err) {
      console.error("Erro ao deletar todo:", err);
    }
  };

  const openModalUpdate = (todo: Todo) => {
    setEditForm({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      deadline: todo.deadline,
      priority: todo.priority,
      document_path: todo.document_path,
    });
    setShowModal(true);
  };

  const updateTodo = async (id: number) => {
    const token = localStorage.getItem("apitoken");
    if (!token) return;

    const formData = new FormData();
    formData.append("title", editForm.title);
    formData.append("description", editForm.description);
    formData.append("deadline", editForm.deadline);
    formData.append("priority", editForm.priority);

    try {
      await api.put(`/api/todos/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setShowModal(false);
      fetchTodos();
    } catch (err) {
      console.error("Erro ao atualizar tarefa", err);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge bg="danger">Alta</Badge>;
      case "medium":
        return <Badge bg="warning" text="dark">Média</Badge>;
      case "low":
        return <Badge bg="success">Baixa</Badge>;
      default:
        return <Badge bg="secondary">Não definida</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Sem data";
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("pt-BR", options);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center mb-5">
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Body>


              <Form className="mb-4" onSubmit={(e) => { e.preventDefault(); createCategory(); }}>
  <Row className="align-items-end">
    <Col md={8}>
      <Form.Group>
        <Form.Label>Nova Categoria</Form.Label>
        <Form.Control
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Digite o nome da categoria"
        />
      </Form.Group>
    </Col>
    <Col md={4}>
      <Button
        variant="success"
        type="submit"
        className="w-100"
      >
        Criar Categoria
      </Button>
    </Col>
  </Row>
</Form>

              <h2 className="mb-4 fw-bold text-primary">Minhas Tarefas</h2>

              {/* Formulário de Adição */}
              <Form onSubmit={handleSubmit} className="mb-4">
                <Row>
                  <Col md={6}>

<Form.Group className="mb-3">
  <Form.Label>Categoria</Form.Label>
<Form.Select
  value={form.categories_id} // agora é número
  onChange={(e) => {
    const value = parseInt(e.target.value, 10); // converte pra número
    setForm({ ...form, categories_id: value });
  }}
  required
>
  <option value="">Selecione uma categoria</option>
  {categories.map((cat) => (
    <option key={cat.id} value={cat.id}>
      {cat.name}
    </option>
  ))}
</Form.Select>
</Form.Group>


                    <Form.Group className="mb-3">
                      <Form.Label>Título</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Digite o título da tarefa"
                        value={form.title}
                        onChange={(e) =>
                          setForm({ ...form, title: e.target.value })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Prioridade</Form.Label>
                      <Form.Select
                        value={form.priority}
                        onChange={(e) =>
                          setForm({ ...form, priority: e.target.value })
                        }
                      >
                        <option value="">Selecione</option>
                        <option value="high">Alta</option>
                        <option value="medium">Média</option>
                        <option value="low">Baixa</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Prazo</Form.Label>
                      <Form.Control
                        type="date"
                        value={form.deadline}
                        onChange={(e) =>
                          setForm({ ...form, deadline: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Adicione detalhes sobre a tarefa"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </Form.Group>

                    <Form.Group className="mb-3">
  <Form.Label>Documento (opcional)</Form.Label>
  <Form.Control
    type="file"
    onChange={handleFileChange}
  />
</Form.Group>

{form.document && (
  <small className="text-muted ms-2">
    Arquivo selecionado: {form.document.name}
  </small>
)}

                <div className="d-flex justify-content-end">
                  <Button
                    variant="primary"
                    type="submit"
                    className="d-flex align-items-center gap-2"
                  >
                    <PlusCircle size={18} /> Criar Tarefa
                  </Button>
                </div>

           
              </Form>

              {/* Lista de Tarefas */}
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-semibold">Suas Tarefas</h5>
                <small className="text-muted">{todos.length} itens</small>
              </div>

              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : todos.length === 0 ? (
                <Card className="bg-light">
                  <Card.Body className="text-center py-4 text-muted">
                    Nenhuma tarefa encontrada. Comece adicionando uma nova tarefa!
                  </Card.Body>
                </Card>
              ) : (
                <ListGroup variant="flush">
                  {todos.map((todo) => (
                    <ListGroup.Item
                      key={todo.id}
                      className={`py-3 ${
                        todo.completed ? "bg-light" : ""
                      }`}
                    >
                      {todo.document_path && (
                        <div className="mt-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            as="a"
                           href={`http://localhost:8000/storage/${todo.document_path}`}
                            target="_blank"
                          >
                            Baixar Documento
                          </Button>
                        </div>
                      )}

                      <div className="d-flex align-items-start gap-3">
                        <Button
                          variant="link"
                          className="p-0 mt-1"
                          onClick={() => toggleComplete(todo.id)}
                          title={
                            todo.completed
                              ? "Marcar como pendente"
                              : "Marcar como concluída"
                          }
                        >
                          {todo.completed ? (
                            <CheckCircle size={24} className="text-success" />
                          ) : (
                            <Circle size={24} className="text-secondary" />
                          )}
                        </Button>



                      

                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <h5
                              className={`mb-1 ${
                                todo.completed
                                  ? "text-decoration-line-through text-muted"
                                  : ""
                              }`}
                            >
                              {todo.title}
                            </h5>
                            <div className="d-flex gap-2">
                              {getPriorityBadge(todo.priority)}
                              <small className="text-muted">
                                {formatDate(todo.deadline)}
                              </small>
                            </div>
                          </div>

                          {todo.description && (
                            <p
                              className={`mb-2 ${
                                todo.completed
                                  ? "text-muted"
                                  : "text-dark"
                              }`}
                            >
                              {todo.description}
                            </p>
                          )}

                          <div className="d-flex gap-2 mt-2">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="d-flex align-items-center gap-1"
                              onClick={() => openModalUpdate(todo)}
                            >
                              <Pencil size={14} /> Editar
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="d-flex align-items-center gap-1"
                              onClick={() => deleteTodo(todo.id)}
                            >
                              <Trash size={14} /> Excluir
                            </Button>
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de Edição */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Tarefa</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Título</Form.Label>
                    <Form.Control
                      type="text"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          title: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Prioridade</Form.Label>
                    <Form.Select
                      value={editForm.priority}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          priority: e.target.value,
                        })
                      }
                    >
                      <option value="">Selecione</option>
                      <option value="high">Alta</option>
                      <option value="medium">Média</option>
                      <option value="low">Baixa</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Prazo</Form.Label>
                    <Form.Control
                      type="date"
                      value={editForm.deadline}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          deadline: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Form>
              </div>
              <div className="modal-footer">
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={() => updateTodo(editForm.id)}
                >
                  Salvar Alterações
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}