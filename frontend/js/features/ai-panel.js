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
