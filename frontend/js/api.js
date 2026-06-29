// Lumina API client — wraps the FastAPI backend (see backend/README.md).
const API_BASE = window.LUMINA_API_BASE || 'http://127.0.0.1:8000';
const TOKEN_KEY = 'lumina_token';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function apiFetch(path, options = {}) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
  const token = getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;

  let res;
  try {
    res = await fetch(API_BASE + path, Object.assign({}, options, { headers }));
  } catch (err) {
    throw new Error('Cannot reach the server. Is the backend running?');
  }

  if (res.status === 204) return null;

  let data = null;
  try {
    data = await res.json();
  } catch (err) {
    data = null;
  }

  if (!res.ok) {
    const detail = (data && (data.detail || data.message)) || `Request failed (${res.status})`;
    const message = Array.isArray(detail)
      ? detail.map((d) => d.msg || JSON.stringify(d)).join(', ')
      : detail;
    throw new Error(message);
  }

  return data;
}

const api = {
  register: (payload) => apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  demoLogin: () => apiFetch('/api/auth/demo', { method: 'POST' }),

  getMe: () => apiFetch('/api/users/me'),
  updateMe: (payload) => apiFetch('/api/users/me', { method: 'PATCH', body: JSON.stringify(payload) }),

  listConversations: () => apiFetch('/api/conversations'),
  getMessages: (conversationId) => apiFetch(`/api/conversations/${conversationId}/messages`),
  sendMessage: (conversationId, text) =>
    apiFetch(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),
  reactMessage: (conversationId, messageId, emoji) =>
    apiFetch(`/api/conversations/${conversationId}/messages/${messageId}/react`, {
      method: 'POST',
      body: JSON.stringify({ emoji }),
    }),

  listRooms: () => apiFetch('/api/rooms'),
  joinRoom: (roomId) => apiFetch(`/api/rooms/${roomId}/join`, { method: 'POST' }),

  listNotifications: () => apiFetch('/api/notifications'),
  markAllRead: () => apiFetch('/api/notifications/read-all', { method: 'POST' }),
  markOneRead: (notificationId) => apiFetch(`/api/notifications/${notificationId}/read`, { method: 'POST' }),
};
