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
