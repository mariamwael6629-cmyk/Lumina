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
