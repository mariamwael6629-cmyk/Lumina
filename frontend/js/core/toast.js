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
