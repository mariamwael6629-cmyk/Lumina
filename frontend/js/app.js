const AVATAR_COLORS = [
  'linear-gradient(135deg,#7c3aed,#06b6d4)',
  'linear-gradient(135deg,#f472b6,#7c3aed)',
  'linear-gradient(135deg,#10b981,#06b6d4)',
  'linear-gradient(135deg,#f59e0b,#ec4899)',
  'linear-gradient(135deg,#6366f1,#f472b6)',
];

let state = {
  user: null,
  regColor: AVATAR_COLORS[0],
  conversations: [],
  activeConversationId: null,
  tab: 'all',
  rooms: [],
  pollHandle: null,
  lastNavBtn: null,
};

function showPage(id) {
  document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
  const pg = document.getElementById(id);
  if (pg) pg.classList.add('active');
}

function setNav(btn, section) {
  document.querySelectorAll('.nb').forEach((b) => b.classList.remove('on'));
  btn.classList.add('on');
  state.lastNavBtn = btn;
  if (section === 'discover') {
    openOverlay('overlay-discover');
    return;
  }
  if (section === 'notifs') {
    openOverlay('overlay-notifs');
    return;
  }
  if (section === 'calls') {
    showToast('📞 Calls coming soon in v2.0!');
    return;
  }
  if (section === 'files') {
    showToast('📁 File manager launching soon!');
    return;
  }
}

function openOverlay(id) {
  document.querySelectorAll('[id^="overlay-"]').forEach((o) => (o.style.display = 'none'));
  const el = document.getElementById(id);
  if (el) el.style.display = 'block';
  if (id === 'overlay-discover') buildDiscover();
  if (id === 'overlay-notifs') buildNotifs();
}

function closeOverlay() {
  document.querySelectorAll('[id^="overlay-"]').forEach((o) => (o.style.display = 'none'));
  document.querySelectorAll('.nb').forEach((b) => b.classList.remove('on'));
  const fallback = document.querySelector('.nb[title="Chats"]');
  (state.lastNavBtn || fallback)?.classList.add('on');
}

function togglePw(id, eyeEl) {
  const inp = document.getElementById(id);
  if (inp.type === 'password') {
    inp.type = 'text';
    eyeEl.className = 'ti ti-eye-off eye';
  } else {
    inp.type = 'password';
    eyeEl.className = 'ti ti-eye eye';
  }
}

function setFieldError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message || '';
}

function withLoading(btn, label, fn) {
  const original = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = label;
  return fn().finally(() => {
    btn.disabled = false;
    btn.innerHTML = original;
  });
}

// ---------- Auth ----------

async function doLogin() {
  setFieldError('login-error', '');
  const email = document.getElementById('li-email').value.trim();
  const pw = document.getElementById('li-pw').value;
  if (!email || !pw) {
    setFieldError('login-error', 'Please fill in all fields');
    return;
  }
  const btn = document.getElementById('login-submit');
  try {
    const data = await withLoading(btn, '<i class="ti ti-loader-2"></i> Signing in...', () =>
      api.login({ email, password: pw })
    );
    setToken(data.access_token);
    state.user = data.user;
    await enterApp();
  } catch (err) {
    setFieldError('login-error', err.message);
  }
}

async function demoLogin() {
  setFieldError('login-error', '');
  const btn = document.getElementById('demo-submit');
  try {
    const data = await withLoading(btn, '<span class="demo-star">✦</span> Connecting...', () => api.demoLogin());
    setToken(data.access_token);
    state.user = data.user;
    await enterApp();
  } catch (err) {
    setFieldError('login-error', err.message);
  }
}

(function initRegColors() {
  const wrap = document.getElementById('colorPicks');
  if (!wrap) return;
  AVATAR_COLORS.forEach((c, i) => {
    const el = document.createElement('div');
    el.className = 'cp' + (i === 0 ? ' sel' : '');
    el.style.background = c;
    el.onclick = () => {
      document.querySelectorAll('#colorPicks .cp').forEach((x) => x.classList.remove('sel'));
      el.classList.add('sel');
      state.regColor = c;
      const prev = document.getElementById('reg-preview');
      if (prev) prev.style.background = c;
    };
    wrap.appendChild(el);
  });
})();

function updatePreview() {
  const n = (document.getElementById('reg-name')?.value || document.getElementById('reg-user')?.value || '??')
    .slice(0, 2)
    .toUpperCase();
  const prev = document.getElementById('reg-preview');
  if (prev) {
    prev.textContent = n;
    prev.style.background = state.regColor;
  }
}

function regNext() {
  setFieldError('register-error', '');
  const email = document.getElementById('reg-email')?.value.trim();
  const pw = document.getElementById('reg-pw')?.value;
  if (!email || !pw) {
    setFieldError('register-error', 'Please fill in all fields');
    return;
  }
  if (pw.length < 6) {
    setFieldError('register-error', 'Password must be at least 6 characters');
    return;
  }
  document.getElementById('reg-s1').classList.add('hidden');
  document.getElementById('reg-s2').classList.remove('hidden');
  document.getElementById('seg2').classList.add('done');
}

function regBack() {
  document.getElementById('reg-s2').classList.add('hidden');
  document.getElementById('reg-s1').classList.remove('hidden');
  document.getElementById('seg2').classList.remove('done');
}

async function doRegister() {
  setFieldError('register-error-s2', '');
  const uname = document.getElementById('reg-user')?.value.trim();
  const dname = document.getElementById('reg-name')?.value.trim();
  const email = document.getElementById('reg-email')?.value.trim();
  const pw = document.getElementById('reg-pw')?.value;
  if (!uname) {
    setFieldError('register-error-s2', 'Username is required');
    return;
  }
  if (!/^[a-zA-Z0-9_]+$/.test(uname)) {
    setFieldError('register-error-s2', 'Username: letters, numbers and _ only');
    return;
  }
  const btn = document.getElementById('register-submit');
  try {
    const data = await withLoading(btn, '<i class="ti ti-loader-2"></i> Launching...', () =>
      api.register({
        email,
        password: pw,
        username: uname,
        display_name: dname || uname,
        avatar_color: state.regColor,
      })
    );
    setToken(data.access_token);
    state.user = data.user;
    await enterApp();
    showToast('Welcome to Lumina! 🚀');
  } catch (err) {
    setFieldError('register-error-s2', err.message);
  }
}

function logout() {
  stopPolling();
  setToken(null);
  state = {
    user: null,
    regColor: AVATAR_COLORS[0],
    conversations: [],
    activeConversationId: null,
    tab: 'all',
    rooms: [],
    pollHandle: null,
    lastNavBtn: null,
  };
  showPage('pg-land');
}

// ---------- App entry ----------

async function enterApp() {
  showPage('pg-app');
  applyMyAvatar();
  try {
    await Promise.all([refreshConversations(), buildDiscover(), buildNotifs(), buildProfile(), buildProfColors()]);
    if (state.conversations.length) await selectConversation(state.conversations[0].id);
  } catch (err) {
    showToast(err.message, 'error');
  }
  startPolling();
}

function applyMyAvatar() {
  const initials = (state.user.display_name || 'U').slice(0, 2).toUpperCase();
  const ma = document.getElementById('myAvatar');
  ma.textContent = initials;
  ma.style.background = state.user.avatar_color || AVATAR_COLORS[0];
}

// ---------- Conversations / contacts ----------

async function refreshConversations() {
  state.conversations = await api.listConversations();
  renderContactList();
}

function visibleConversations() {
  if (state.tab === 'groups') return state.conversations.filter((c) => c.is_group);
  if (state.tab === 'direct') return state.conversations.filter((c) => !c.is_group);
  return state.conversations;
}

function filterContacts(q) {
  const list = visibleConversations().filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()));
  renderContactList(list);
}

function setTab(btn, tab) {
  document.querySelectorAll('.tab').forEach((t) => t.classList.remove('on'));
  btn.classList.add('on');
  state.tab = tab;
  renderContactList();
}

function renderContactList(list) {
  const data = list || visibleConversations();
  const cl = document.getElementById('contactList');
  if (!data.length) {
    cl.innerHTML = '<div class="empty-state">No conversations yet</div>';
    return;
  }
  cl.innerHTML = data
    .map(
      (c) => `<div class="ci ${c.id === state.activeConversationId ? 'on' : ''}" onclick="selectConversation(${c.id})">
      <div style="position:relative">
        <div class="av" style="background:${c.color};width:42px;height:42px;font-size:12px;font-weight:700;color:#fff">${c.initials}</div>
        <span class="sd ${c.status}"></span>
      </div>
      <div class="ci-info">
        <div class="ci-name">${c.name}${c.is_group ? '<span class="gpill">Group</span>' : ''}</div>
        <div class="ci-pre">${c.preview}</div>
      </div>
      <div class="ci-meta"><span class="ci-time">${c.time}</span>${c.unread > 0 ? `<span class="unread">${c.unread}</span>` : ''}</div>
    </div>`
    )
    .join('');
}

async function selectConversation(id) {
  state.activeConversationId = id;
  const c = state.conversations.find((x) => x.id === id);
  if (!c) return;

  document.body.classList.add('chat-open');
  document.getElementById('activeName').textContent = c.name;
  const el = document.getElementById('activeStatus');
  if (c.status === 'online') {
    el.innerHTML = '<div class="ch-dot"></div>Online';
    el.style.color = 'var(--g)';
  } else if (c.status === 'away') {
    el.innerHTML = 'Away';
    el.style.color = 'var(--amber)';
  } else {
    el.innerHTML = 'Offline';
    el.style.color = 'var(--t3)';
  }
  const av = document.getElementById('activeAvatar');
  av.style.background = c.color;
  av.innerHTML =
    c.initials +
    (c.status === 'online' ? '<span class="sd on"></span>' : c.status === 'away' ? '<span class="sd aw"></span>' : '<span class="sd off"></span>');

  renderContactList();
  buildRightPanel(c);
  await loadThread(id);
}

function backToContacts() {
  document.body.classList.remove('chat-open');
}

async function loadThread(id) {
  const container = document.getElementById('msgContainer');
  try {
    const msgs = await api.getMessages(id);
    if (id !== state.activeConversationId) return;
    renderMessages(msgs);
    const updated = state.conversations.find((c) => c.id === id);
    if (updated) updated.unread = 0;
  } catch (err) {
    container.innerHTML = `<div class="empty-state">${err.message}</div>`;
  }
}

function renderMessages(msgs) {
  const container = document.getElementById('msgContainer');
  if (!msgs.length) {
    container.innerHTML = '<div class="empty-state">No messages yet — say hi 👋</div>';
    return;
  }
  container.innerHTML = msgs.map(renderMsg).join('');
  container.scrollTop = container.scrollHeight;
}

function renderMsg(m) {
  const cls = m.is_mine ? 's' : 'r';
  let content = '';
  if (m.image_emoji) {
    content += `<div class="img-bub"><div class="img-ph" style="background:${m.image_bg || ''}">${m.image_emoji}</div></div>`;
  }
  if (m.text) {
    content += `<div class="bub">${escapeHtml(m.text)}</div>`;
  }
  const time = new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const meta = `<div class="bm">${time}${m.is_mine && m.is_seen ? ' <i class="ti ti-checks seen"></i>' : ''}</div>`;
  const reacts = m.reactions && m.reactions.length
    ? `<div class="reacts">${m.reactions.map((r) => `<div class="rc" onclick="reactMsg(${m.id},'${r.e}')">${r.e} <span>${r.n}</span></div>`).join('')}</div>`
    : '';
  const av = !m.is_mine ? `<div class="mav" style="background:${m.sender_color}">${m.sender_initials}</div>` : '';
  return `<div class="mrow ${cls}">${av}<div class="mg">${content}${meta}${reacts}</div></div>`;
}

function escapeHtml(str) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function sendMsg() {
  const inp = document.getElementById('msgInput');
  const text = inp.value.trim();
  if (!text || !state.activeConversationId) return;
  const conversationId = state.activeConversationId;
  inp.value = '';
  inp.style.height = 'auto';
  const sendBtn = document.querySelector('.send');
  sendBtn.disabled = true;
  try {
    await api.sendMessage(conversationId, text);
    await Promise.all([loadThread(conversationId), refreshConversations()]);
  } catch (err) {
    showToast(err.message, 'error');
    inp.value = text;
  } finally {
    sendBtn.disabled = false;
  }
}

async function reactMsg(messageId, emoji) {
  if (!state.activeConversationId) return;
  try {
    await api.reactMessage(state.activeConversationId, messageId, emoji);
    await loadThread(state.activeConversationId);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMsg();
  }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function insertEmoji() {
  const emojis = ['😊', '🚀', '✨', '🔥', '👾', '🎉', '💫', '🌙', '⚡', '🎧'];
  document.getElementById('msgInput').value += emojis[Math.floor(Math.random() * emojis.length)];
}

function insertVoice() {
  showToast('🎙 Voice message recording coming soon!');
}

// Polling keeps the open thread + sidebar previews fresh without a WebSocket.
function startPolling() {
  stopPolling();
  state.pollHandle = setInterval(() => {
    if (!state.user) return;
    refreshConversations();
    if (state.activeConversationId) loadThread(state.activeConversationId);
  }, 4000);
}

function stopPolling() {
  if (state.pollHandle) clearInterval(state.pollHandle);
  state.pollHandle = null;
}

// ---------- Right panel / AI chips (still mocked client-side — no backend AI yet) ----------

function buildRightPanel(c) {
  const suggestionsPool = [
    'Sounds amazing, count me in! ✨',
    "I'll set a reminder for that",
    'Cant wait, this is going to be 🔥',
  ];
  const mediaEmojis = ['🌌', '🔮', '🌊', '🦋', '🔥', '🌿', '⚡', '🎨', '🌙'];
  const mediaBgs = [
    'linear-gradient(135deg,#0f172a,#1e1b4b)',
    'linear-gradient(135deg,#1e1b4b,#312e81)',
    'linear-gradient(135deg,#0c4a6e,#0f172a)',
    'linear-gradient(135deg,#4a044e,#1e1b4b)',
    'linear-gradient(135deg,#422006,#1e1b4b)',
    'linear-gradient(135deg,#052e16,#0f172a)',
    'linear-gradient(135deg,#1c1917,#0f172a)',
    'linear-gradient(135deg,#2d1b69,#0f172a)',
    'linear-gradient(135deg,#0d2137,#0f172a)',
  ];
  document.getElementById('rpContent').innerHTML = `<div class="pcard"><div class="pav" style="background:${c.color}">${c.initials}</div><div class="pname">${c.name}</div><div class="pbio">${c.is_group ? 'Group conversation' : 'Lumina contact ✦'}</div></div><div class="action-grid"><div class="at" onclick="startCall('voice')"><div class="at-icon">📞</div><div class="at-lbl">Voice Call</div></div><div class="at" onclick="startCall('video')"><div class="at-icon">🎥</div><div class="at-lbl">Video Call</div></div><div class="at"><div class="at-icon">📌</div><div class="at-lbl">Pinned</div></div><div class="at"><div class="at-icon">🔇</div><div class="at-lbl">Mute</div></div></div><div class="sec">✦ AI Smart Replies</div><div class="ai-chips">${suggestionsPool.map((s) => `<div class="chip" onclick="useChip(this)"><span class="ai-star">✦</span>${s}</div>`).join('')}</div><div class="sec">Shared Media</div><div class="media-grid">${mediaEmojis.map((e, i) => `<div class="mt"><div class="mti" style="background:${mediaBgs[i]}">${e}</div></div>`).join('')}</div>`;
}

function useChip(el) {
  const text = el.textContent.replace('✦', '').trim();
  document.getElementById('msgInput').value = text;
  document.getElementById('msgInput').focus();
}

// ---------- Discover / rooms ----------

async function buildDiscover() {
  const grid = document.getElementById('discoverGrid');
  try {
    state.rooms = await api.listRooms();
  } catch (err) {
    grid.innerHTML = `<div class="empty-state">${err.message}</div>`;
    return;
  }
  grid.innerHTML = state.rooms
    .map(
      (r) => `<div class="disc-card">
      <div class="dc-top"><div class="dc-av" style="background:${r.color}">${r.initials}</div><div><div class="dc-name">${r.name}</div><div class="dc-members">${r.members.toLocaleString()} members</div></div></div>
      <div class="dc-desc">${r.description}</div>
      <div class="dc-tags">${r.tags.map((t) => `<span class="tag">#${t}</span>`).join('')}</div>
      <button class="join-btn" ${r.joined ? 'disabled' : ''} onclick="joinRoom(this,${r.id})">${r.joined ? '✓ Joined' : 'Join Room →'}</button>
    </div>`
    )
    .join('');
}

async function joinRoom(btn, roomId) {
  btn.disabled = true;
  try {
    await api.joinRoom(roomId);
    btn.textContent = '✓ Joined!';
    btn.style.background = 'rgba(16,185,129,.15)';
    btn.style.borderColor = 'rgba(16,185,129,.4)';
    btn.style.color = '#34d399';
    showToast('Joined room! 🚀');
  } catch (err) {
    btn.disabled = false;
    showToast(err.message, 'error');
  }
}

// ---------- Notifications ----------

async function buildNotifs() {
  const list = document.getElementById('notifList');
  let notifs;
  try {
    notifs = await api.listNotifications();
  } catch (err) {
    list.innerHTML = `<div class="empty-state">${err.message}</div>`;
    return;
  }
  list.innerHTML = `<div class="notif-title">Notifications</div>${notifs
    .map(
      (n) => `<div class="notif-item ${n.is_read ? '' : 'unread'}" onclick="markNotifRead(${n.id})">
      <div class="notif-av" style="background:${n.actor_color}">${n.actor_initials}</div>
      <div class="notif-body"><div class="notif-from">${n.actor_name}</div><div class="notif-text">${n.text}</div></div>
      <div style="display:flex;align-items:center;gap:8px"><div class="notif-time">${humanizeTime(n.created_at)}</div>${n.is_read ? '' : '<div class="notif-dot"></div>'}</div>
    </div>`
    )
    .join('')}`;
}

function humanizeTime(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

async function markNotifRead(id) {
  try {
    await api.markOneRead(id);
    await buildNotifs();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ---------- Profile ----------

function showProfile() {
  openOverlay('overlay-profile');
}

function buildProfile() {
  const u = state.user || {};
  const initials = (u.display_name || u.email || 'U').slice(0, 2).toUpperCase();
  const profAv = document.getElementById('profAvatar');
  if (profAv) {
    profAv.textContent = initials;
    profAv.style.background = u.avatar_color || AVATAR_COLORS[0];
  }
  const pn = document.getElementById('profName');
  if (pn) pn.textContent = u.display_name || 'Your Name';
  const pe = document.getElementById('profEmail');
  if (pe) pe.textContent = u.email || 'you@lumina.app';
  const pfn = document.getElementById('pf-name');
  if (pfn) pfn.value = u.display_name || '';
  const pfu = document.getElementById('pf-user');
  if (pfu) pfu.value = u.username || '';
  const pfb = document.getElementById('pf-bio');
  if (pfb) pfb.value = u.bio || '';
  const pfe = document.getElementById('pf-email');
  if (pfe) pfe.value = u.email || '';
  document.querySelectorAll('.tp').forEach((t) => t.classList.remove('sel'));
  const themeEl = document.querySelector(`.tp[data-theme="${u.theme || 'dark'}"]`);
  if (themeEl) themeEl.classList.add('sel');
}

function buildProfColors() {
  const wrap = document.getElementById('profColorPicks');
  if (!wrap) return;
  wrap.innerHTML = '';
  AVATAR_COLORS.forEach((c) => {
    const el = document.createElement('div');
    el.className = 'cp' + (state.user && state.user.avatar_color === c ? ' sel' : '');
    el.style.background = c;
    el.onclick = () => {
      document.querySelectorAll('#profColorPicks .cp').forEach((x) => x.classList.remove('sel'));
      el.classList.add('sel');
      if (state.user) state.user.color = c;
      const pa = document.getElementById('profAvatar');
      if (pa) pa.style.background = c;
      const ma = document.getElementById('myAvatar');
      if (ma) ma.style.background = c;
    };
    wrap.appendChild(el);
  });
}

function setTheme(el, theme) {
  document.querySelectorAll('.tp').forEach((t) => t.classList.remove('sel'));
  el.classList.add('sel');
  el.dataset.pendingTheme = theme;
}

async function saveProfile() {
  const dname = document.getElementById('pf-name')?.value.trim();
  const uname = document.getElementById('pf-user')?.value.trim();
  const bio = document.getElementById('pf-bio')?.value.trim();
  const email = document.getElementById('pf-email')?.value.trim();
  const selectedTheme = document.querySelector('.tp.sel')?.dataset.pendingTheme;
  const selectedColor = document.querySelector('#profColorPicks .cp.sel')?.style.background;

  const payload = {};
  if (dname) payload.display_name = dname;
  if (uname) payload.username = uname;
  if (email) payload.email = email;
  payload.bio = bio || '';
  if (selectedTheme) payload.theme = selectedTheme;
  if (selectedColor) payload.avatar_color = selectedColor;

  const btn = document.querySelector('.save-btn');
  try {
    state.user = await withLoading(btn, '<i class="ti ti-loader-2"></i> Saving...', () => api.updateMe(payload));
    buildProfile();
    applyMyAvatar();
    showToast('Profile saved ✓');
    setTimeout(closeOverlay, 800);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ---------- Calls (UI only — no real WebRTC backend) ----------

function startCall(type) {
  const c = state.conversations.find((x) => x.id === state.activeConversationId);
  if (!c) return;
  const modal = document.getElementById('call-modal');
  document.getElementById('callAvatar').textContent = c.initials;
  document.getElementById('callAvatar').style.background = c.color;
  document.getElementById('callName').textContent = c.name;
  document.getElementById('callType').textContent = type === 'video' ? 'Video Call' : 'Voice Call';
  document.getElementById('callStatus').textContent = 'Connecting...';
  modal.style.display = 'flex';
  setTimeout(() => {
    document.getElementById('callStatus').textContent = 'Connected · 00:00';
  }, 1500);
}

function endCall() {
  document.getElementById('call-modal').style.display = 'none';
  showToast('Call ended');
}

function openNewChat() {
  showToast('💬 Select a contact from the list to start chatting!');
}

function showToast(msg, type) {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.id = 'toast';
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(14,14,28,0.96)',
    color: '#f1f5f9',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(20px)',
    padding: '10px 22px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '500',
    zIndex: '9999',
    fontFamily: 'Inter,sans-serif',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    animation: 'mIn .3s ease',
  });
  if (type === 'error') t.style.borderColor = 'rgba(244,114,182,0.4)';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ---------- Bootstrap: resume session if a token is already stored ----------

(async function bootstrap() {
  const token = getToken();
  if (!token) return;
  try {
    state.user = await api.getMe();
    await enterApp();
  } catch (err) {
    setToken(null);
  }
})();
