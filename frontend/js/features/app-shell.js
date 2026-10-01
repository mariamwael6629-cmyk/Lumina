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
