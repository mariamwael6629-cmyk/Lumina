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
