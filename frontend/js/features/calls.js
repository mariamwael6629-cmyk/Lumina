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
