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
