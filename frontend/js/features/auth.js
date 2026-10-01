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
