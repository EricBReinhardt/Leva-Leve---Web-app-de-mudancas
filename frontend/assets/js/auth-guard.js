import { request, setSession } from './api.js';

document.documentElement.style.visibility = 'hidden';
document.documentElement.style.opacity = '0';

function defaultRedirect() {
  return location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
}

function clearSession() {
  try {
    localStorage.removeItem('LEVA_LEVE_TOKEN');
    localStorage.removeItem('LEVA_LEVE_USER');
  } catch {}
}

async function refreshSession() {
  try {
    const currentUser = await request('/me');
    setSession({ user: currentUser });
    return currentUser;
  } catch {
    clearSession();
    return null;
  }
}

function redirectTo(target) {
  window.location.replace(target || defaultRedirect());
}

async function enforceAuth() {
  const config = window.LL_GUARD || {};
  const redirect = config.redirect || defaultRedirect();
  const allowedRoles = Array.isArray(config.roles) ? config.roles : [];

  const user = await refreshSession();
  if (!user) {
    redirectTo(redirect);
    return;
  }

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    redirectTo(config.fallback || redirect);
    return;
  }

  document.documentElement.style.visibility = 'visible';
  document.documentElement.style.opacity = '1';
}

document.addEventListener('DOMContentLoaded', () => {
  void enforceAuth();
});
