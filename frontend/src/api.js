const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("fixit:token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Nao foi possivel concluir a operacao.");
  }

  return data;
}

export const api = {
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  me: () => request("/auth/me"),
  listTickets: () => request("/tickets"),
  createTicket: (payload) =>
    request("/tickets", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  deleteTicket: (id) =>
    request(`/tickets/${id}`, {
      method: "DELETE"
    }),
  assignTicket: (id) =>
    request(`/tickets/${id}/assign`, {
      method: "PATCH"
    }),
  updateTicketStatus: (id, status) =>
    request(`/tickets/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    }),
  listUsers: () => request("/users")
};
