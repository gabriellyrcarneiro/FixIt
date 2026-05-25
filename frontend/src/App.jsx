import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  LogOut,
  Plus,
  ShieldCheck,
  TicketCheck,
  Trash2,
  UserCog,
  Wrench
} from "lucide-react";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { api } from "./api";

const roleLabels = {
  USER: "Usuario",
  TECHNICIAN: "Tecnico",
  ADMIN: "Admin"
};

const statusLabels = {
  OPEN: "Aberto",
  IN_PROGRESS: "Em atendimento",
  RESOLVED: "Resolvido",
  CLOSED: "Encerrado"
};

const statusStyles = {
  OPEN: "bg-amber/15 text-amber border-amber/25",
  IN_PROGRESS: "bg-ocean/15 text-ocean border-ocean/25",
  RESOLVED: "bg-mint/15 text-mint border-mint/25",
  CLOSED: "bg-slate-200 text-slate-700 border-slate-300"
};

const demoUsers = [
  { label: "Usuario", email: "usuario@fixit.com", password: "usuario123" },
  { label: "Tecnico", email: "tecnico@fixit.com", password: "tecnico123" },
  { label: "Admin", email: "admin@fixit.com", password: "admin123" }
];

function App() {
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("fixit:user");
    return stored ? JSON.parse(stored) : null;
  });
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "usuario@fixit.com",
    password: "usuario123"
  });
  const [ticketForm, setTicketForm] = useState({
    title: "",
    category: "Hardware",
    description: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isSupport = user?.role === "TECHNICIAN" || user?.role === "ADMIN";

  const stats = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter((ticket) => ticket.status === "OPEN").length,
      progress: tickets.filter((ticket) => ticket.status === "IN_PROGRESS").length,
      resolved: tickets.filter((ticket) => ticket.status === "RESOLVED").length
    };
  }, [tickets]);

  useEffect(() => {
    if (user) {
      loadTickets();
      if (user.role === "ADMIN") {
        loadUsers();
      }
    }
  }, [user]);

  async function loadTickets() {
    try {
      setTickets(await api.listTickets());
    } catch (error) {
      showMessage(error.message);
    }
  }

  async function loadUsers() {
    try {
      setUsers(await api.listUsers());
    } catch (error) {
      showMessage(error.message);
    }
  }

  function showMessage(text) {
    setMessage(text);
    window.clearTimeout(showMessage.timeout);
    showMessage.timeout = window.setTimeout(() => setMessage(""), 4500);
  }

  async function handleAuth(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const payload =
        authMode === "login"
          ? { email: authForm.email, password: authForm.password }
          : authForm;
      const response = authMode === "login" ? await api.login(payload) : await api.register(payload);
      localStorage.setItem("fixit:token", response.token);
      localStorage.setItem("fixit:user", JSON.stringify(response.user));
      setUser(response.user);
      showMessage("Sessao iniciada com sucesso.");
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTicket(event) {
    event.preventDefault();
    setLoading(true);

    try {
      await api.createTicket(ticketForm);
      setTicketForm({ title: "", category: "Hardware", description: "" });
      await loadTickets();
      showMessage("Chamado criado.");
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTicket(ticketId) {
    setLoading(true);
    try {
      await api.deleteTicket(ticketId);
      await loadTickets();
      showMessage("Chamado excluido.");
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAssign(ticketId) {
    setLoading(true);
    try {
      await api.assignTicket(ticketId);
      await loadTickets();
      showMessage("Chamado atribuido.");
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatus(ticketId, status) {
    setLoading(true);
    try {
      await api.updateTicketStatus(ticketId, status);
      await loadTickets();
      showMessage("Status atualizado.");
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("fixit:token");
    localStorage.removeItem("fixit:user");
    setUser(null);
    setTickets([]);
    setUsers([]);
    setAuthMode("login");
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f6f8fb] px-4 py-8 text-ink sm:px-6 lg:px-8">
        <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-md bg-white px-4 py-3 shadow-panel">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-ocean text-white">
                <Wrench size={24} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-ocean">FixIt</p>
                <p className="text-sm text-slate-500">Sistema de suporte tecnico</p>
              </div>
            </div>

            <div className="max-w-2xl space-y-4">
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                Chamados, atendimento e permissoes em uma experiencia completa.
              </h1>
              <p className="text-lg leading-8 text-slate-600">
                Projeto fullstack com autenticacao, perfis de acesso, dashboard operacional e API REST integrada.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {demoUsers.map((demo) => (
                <button
                  key={demo.email}
                  className="rounded-md border border-slate-200 bg-white p-4 text-left shadow-panel transition hover:-translate-y-0.5 hover:border-ocean"
                  onClick={() => setAuthForm((current) => ({ ...current, email: demo.email, password: demo.password }))}
                  type="button"
                >
                  <span className="text-sm font-semibold text-ink">{demo.label}</span>
                  <span className="mt-1 block text-xs text-slate-500">{demo.email}</span>
                </button>
              ))}
            </div>
          </div>

          <form className="rounded-lg bg-white p-6 shadow-panel" onSubmit={handleAuth}>
            <div className="mb-6 flex rounded-md bg-slate-100 p-1">
              <button
                className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold ${authMode === "login" ? "bg-white text-ocean shadow-sm" : "text-slate-500"}`}
                onClick={() => setAuthMode("login")}
                type="button"
              >
                Entrar
              </button>
              <button
                className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold ${authMode === "register" ? "bg-white text-ocean shadow-sm" : "text-slate-500"}`}
                onClick={() => setAuthMode("register")}
                type="button"
              >
                Cadastrar
              </button>
            </div>

            <div className="space-y-4">
              {authMode === "register" && (
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Nome</span>
                  <input
                    className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/20"
                    onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })}
                    required
                    value={authForm.name}
                  />
                </label>
              )}
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <input
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/20"
                  onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
                  required
                  type="email"
                  value={authForm.email}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Senha</span>
                <input
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/20"
                  minLength={6}
                  onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
                  required
                  type="password"
                  value={authForm.password}
                />
              </label>
            </div>

            <button
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ocean px-4 py-3 font-semibold text-white transition hover:bg-[#12566d]"
              disabled={loading}
              type="submit"
            >
              <ShieldCheck size={18} aria-hidden="true" />
              {authMode === "login" ? "Acessar" : "Criar conta"}
            </button>

            {message && <p className="mt-4 rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">{message}</p>}
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-ink">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-ocean text-white">
              <Wrench size={24} aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-xl font-bold">FixIt</h1>
              <p className="text-sm text-slate-500">Painel de suporte tecnico</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <UserCog size={16} aria-hidden="true" />
              {user.name} - {roleLabels[user.role]}
            </span>
            <button
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold transition hover:border-coral hover:text-coral"
              onClick={logout}
              type="button"
            >
              <LogOut size={16} aria-hidden="true" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[360px_1fr] lg:px-8">
        <aside className="space-y-6">
          <section className="rounded-lg bg-white p-5 shadow-panel">
            <h2 className="mb-4 text-lg font-bold">Novo chamado</h2>
            <form className="space-y-4" onSubmit={handleCreateTicket}>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Titulo</span>
                <input
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/20"
                  maxLength={120}
                  onChange={(event) => setTicketForm({ ...ticketForm, title: event.target.value })}
                  required
                  value={ticketForm.title}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Categoria</span>
                <select
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/20"
                  onChange={(event) => setTicketForm({ ...ticketForm, category: event.target.value })}
                  value={ticketForm.category}
                >
                  <option>Hardware</option>
                  <option>Software</option>
                  <option>Rede</option>
                  <option>Acesso</option>
                  <option>Outro</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Descricao</span>
                <textarea
                  className="mt-1 min-h-32 w-full resize-y rounded-md border border-slate-200 px-3 py-2 outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/20"
                  maxLength={1200}
                  onChange={(event) => setTicketForm({ ...ticketForm, description: event.target.value })}
                  required
                  value={ticketForm.description}
                />
              </label>
              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-ocean px-4 py-3 font-semibold text-white transition hover:bg-[#12566d]"
                disabled={loading}
                type="submit"
              >
                <Plus size={18} aria-hidden="true" />
                Abrir chamado
              </button>
            </form>
          </section>

          <section className="rounded-lg bg-white p-5 shadow-panel">
            <h2 className="mb-4 text-lg font-bold">Resumo</h2>
            <div className="grid grid-cols-2 gap-3">
              <Metric icon={ClipboardList} label="Total" value={stats.total} />
              <Metric icon={Clock3} label="Abertos" value={stats.open} />
              <Metric icon={Wrench} label="Andamento" value={stats.progress} />
              <Metric icon={CheckCircle2} label="Resolvidos" value={stats.resolved} />
            </div>
          </section>

          {user.role === "ADMIN" && (
            <section className="rounded-lg bg-white p-5 shadow-panel">
              <h2 className="mb-4 text-lg font-bold">Usuarios</h2>
              <div className="space-y-3">
                {users.map((registeredUser) => (
                  <div key={registeredUser.id} className="rounded-md border border-slate-200 p-3">
                    <p className="font-semibold">{registeredUser.name}</p>
                    <p className="break-all text-sm text-slate-500">{registeredUser.email}</p>
                    <p className="mt-1 text-xs font-semibold uppercase text-ocean">{roleLabels[registeredUser.role]}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>

        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Chamados</h2>
              <p className="text-sm text-slate-500">
                {isSupport ? "Fila completa para atendimento tecnico." : "Acompanhe seus chamados abertos."}
              </p>
            </div>
            {message && <p className="rounded-md bg-white px-3 py-2 text-sm text-slate-700 shadow-panel">{message}</p>}
          </div>

          <div className="grid gap-4">
            {tickets.map((ticket) => {
              const canDelete = ticket.requester.id === user.id || user.role === "ADMIN";
              const canAssign = isSupport && (!ticket.technician || ticket.technician.id === user.id || user.role === "ADMIN");
              const canChangeStatus = isSupport && (user.role === "ADMIN" || ticket.technician?.id === user.id);

              return (
                <article key={ticket.id} className="rounded-lg bg-white p-5 shadow-panel">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-md border px-2 py-1 text-xs font-bold ${statusStyles[ticket.status]}`}>
                          {statusLabels[ticket.status]}
                        </span>
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                          {ticket.category}
                        </span>
                      </div>
                      <div>
                        <h3 className="break-words text-lg font-bold">{ticket.title}</h3>
                        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                          {ticket.description}
                        </p>
                      </div>
                      <div className="grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
                        <p>
                          Solicitante: <span className="font-medium text-slate-700">{ticket.requester.name}</span>
                        </p>
                        <p>
                          Tecnico:{" "}
                          <span className="font-medium text-slate-700">
                            {ticket.technician ? ticket.technician.name : "Sem atribuicao"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row xl:flex-col">
                      {canAssign && (
                        <button
                          className="inline-flex items-center justify-center gap-2 rounded-md border border-ocean px-3 py-2 text-sm font-semibold text-ocean transition hover:bg-ocean hover:text-white"
                          disabled={loading}
                          onClick={() => handleAssign(ticket.id)}
                          type="button"
                        >
                          <TicketCheck size={16} aria-hidden="true" />
                          Autoatribuir
                        </button>
                      )}
                      {canChangeStatus && (
                        <select
                          className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/20"
                          disabled={loading}
                          onChange={(event) => handleStatus(ticket.id, event.target.value)}
                          value={ticket.status}
                        >
                          {Object.entries(statusLabels).map(([status, label]) => (
                            <option key={status} value={status}>
                              {label}
                            </option>
                          ))}
                        </select>
                      )}
                      {canDelete && (
                        <button
                          className="inline-flex items-center justify-center gap-2 rounded-md border border-coral px-3 py-2 text-sm font-semibold text-coral transition hover:bg-coral hover:text-white"
                          disabled={loading}
                          onClick={() => handleDeleteTicket(ticket.id)}
                          type="button"
                        >
                          <Trash2 size={16} aria-hidden="true" />
                          Excluir
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}

            {tickets.length === 0 && (
              <div className="rounded-lg bg-white p-10 text-center shadow-panel">
                <ClipboardList className="mx-auto text-slate-400" size={42} aria-hidden="true" />
                <h3 className="mt-4 text-lg font-bold">Nenhum chamado encontrado</h3>
                <p className="mt-1 text-sm text-slate-500">Abra um chamado para iniciar o atendimento.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-md border border-slate-200 p-3">
      <div className="mb-2 flex items-center justify-between text-slate-500">
        <span className="text-xs font-semibold uppercase">{label}</span>
        <Icon size={16} aria-hidden="true" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default App;
