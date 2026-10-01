// ---------- Bootstrap: resume session if a token is already stored ----------

(async function bootstrap() {
  const token = getToken();
  if (!token) return;
  try {
    state.user = await api.getMe();
    await enterApp();
  } catch (err) {
    setToken(null);
  }
})();
