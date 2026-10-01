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
