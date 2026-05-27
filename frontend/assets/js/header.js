function getBaseForLinks() {
  const path = String(location.pathname || '');
  return path.includes('/pages/') || path.includes('\\pages\\') ? '' : 'pages/';
}

function makeAvatarInitials(name) {
  if (!name) return 'U';
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0] || '')
    .join('')
    .toUpperCase();
}

function readSessionUser() {
  try {
    const token = localStorage.getItem('LEVA_LEVE_TOKEN');
    const raw = localStorage.getItem('LEVA_LEVE_USER');
    if (!token || !raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function logout() {
  try {
    localStorage.removeItem('LEVA_LEVE_TOKEN');
    localStorage.removeItem('LEVA_LEVE_USER');
  } catch {}
  window.location.href = location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
}

function setHoverOutline(el) {
  if (!el) return;
  el.style.cursor = 'pointer';
  el.style.outline = '2px solid rgba(4,120,87,0.12)';
  el.style.outlineOffset = '2px';
  el.addEventListener('mouseenter', () => {
    el.style.outline = '2px solid rgba(4,120,87,0.24)';
  });
  el.addEventListener('mouseleave', () => {
    el.style.outline = '2px solid rgba(4,120,87,0.12)';
  });
}

function gearIconSrc() {
  return `${getAssetsBase()}gear-icon.svg?v=3`;
}

function getAssetsBase() {
  const path = String(location.pathname || '');
  return path.includes('/pages/') || path.includes('\\pages\\') ? '../assets/' : 'assets/';
}

function goToEditProfile() {
  window.location.href = `${getBaseForLinks()}editar-perfil.html`;
}

function showProfileHeader() {
  const user = readSessionUser();
  const header = document.querySelector('header');
  if (!header || !user) return;

  ['abrir-login-cliente', 'abrir-login-motorista', 'abrir-login-motorista-cta'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const base = getBaseForLinks();
  const profileTarget = user.role === 'driver' ? `${base}area-motorista.html` : `${base}solicitar-transporte.html`;

  const clientControls = header.querySelector('#client-header-controls');
  if (clientControls) {
    const userDiv = header.querySelector('#client-header-user');
    const avatar = header.querySelector('#client-header-avatar');

    if (userDiv) {
      // populate name/email from session
      userDiv.innerHTML = `<p class="text-sm font-bold text-slate-900">${user.name || ''}</p><p class="text-xs text-slate-500">${user.email || ''}</p>`;
      userDiv.style.cursor = 'pointer';
      userDiv.addEventListener('click', () => (window.location.href = profileTarget));
    }
    if (avatar) {
      avatar.textContent = makeAvatarInitials(user.name);
      setHoverOutline(avatar);
      avatar.addEventListener('click', () => (window.location.href = profileTarget));
    }
    // ensure avatar is left of the name/email
    if (avatar && userDiv && avatar.parentElement === clientControls) {
      clientControls.insertBefore(avatar, userDiv);
    }

    if (!header.querySelector('#ll-client-customize')) {
      const customize = document.createElement('button');
      customize.id = 'll-client-customize';
      customize.type = 'button';
      customize.className = 'inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white p-0 leading-none text-brand-700 shadow-sm transition hover:bg-slate-50';
      customize.title = 'Customizar perfil';
      customize.innerHTML = `<img src="${gearIconSrc()}" alt="" class="h-4 w-4" aria-hidden="true" />`;
      customize.addEventListener('click', goToEditProfile);
      // append at the end so gear appears to the right of the avatar/info block
      clientControls.appendChild(customize);
    }

    const logoutBtn = header.querySelector('#logoutBtnClient');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    // also populate any page-level profile placeholders
    populatePageProfile(user);
    return;
  }

  const driverAvatar = header.querySelector('#driver-avatar');
  const driverName = header.querySelector('#driver-name');
  const driverRating = header.querySelector('#driver-rating');
  if (driverAvatar) {
    setHoverOutline(driverAvatar);
    driverAvatar.addEventListener('click', () => (window.location.href = profileTarget));
  }
  if (driverName) {
    driverName.style.cursor = 'pointer';
    driverName.addEventListener('click', () => (window.location.href = profileTarget));
  }
  if (driverRating) {
    driverRating.style.cursor = 'pointer';
    driverRating.addEventListener('click', () => (window.location.href = profileTarget));
  }

  const nav = header.querySelector('nav') || header.querySelector('.mx-auto');
  if (nav && !header.querySelector('.ll-profile')) {
    const profileWrap = document.createElement('div');
    profileWrap.className = 'll-profile hidden items-center gap-3 md:flex';

    const info = document.createElement('div');
    info.className = 'text-right leading-tight';
    info.innerHTML = `<p class="text-sm font-bold text-slate-900">${user.name || ''}</p><p class="text-xs text-slate-500">${user.email || ''}</p>`;
    info.style.cursor = 'pointer';
    info.addEventListener('click', () => (window.location.href = profileTarget));

    const customize = document.createElement('button');
    customize.type = 'button';
    customize.className = 'inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white p-0 leading-none text-brand-700 shadow-sm transition hover:bg-slate-50';
    customize.title = 'Customizar perfil';
    customize.innerHTML = `<img src="${gearIconSrc()}" alt="" class="h-4 w-4" aria-hidden="true" />`;
    customize.addEventListener('click', goToEditProfile);

    const avatar = document.createElement('span');
    avatar.className = 'inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white';
    avatar.textContent = makeAvatarInitials(user.name);
    setHoverOutline(avatar);
    avatar.addEventListener('click', () => (window.location.href = profileTarget));

    const logoutBtn = document.createElement('button');
    logoutBtn.type = 'button';
    logoutBtn.className = 'rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50';
    logoutBtn.textContent = 'Sair';
    logoutBtn.addEventListener('click', logout);

    // Order: avatar | info | logout | customize (gear on the right)
    profileWrap.appendChild(avatar);
    profileWrap.appendChild(info);
    profileWrap.appendChild(logoutBtn);
    profileWrap.appendChild(customize);
    nav.appendChild(profileWrap);
    profileWrap.classList.remove('hidden');
  }

  const headerRight = header.querySelector('button.text-xl')?.parentElement || null;
  if (headerRight && !header.querySelector('#ll-driver-customize')) {
    const customize = document.createElement('button');
    customize.id = 'll-driver-customize';
    customize.type = 'button';
    customize.className = 'inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white p-0 leading-none text-brand-700 shadow-sm transition hover:bg-slate-50';
    customize.title = 'Customizar perfil';
    customize.innerHTML = `<img src="${gearIconSrc()}" alt="" class="h-4 w-4" aria-hidden="true" />`;
    customize.addEventListener('click', goToEditProfile);
    // append the gear to the right in this headerRight area
    headerRight.appendChild(customize);
  }

  const logoutBtn = header.querySelector('#logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  // populate any profile placeholders outside the header
  populatePageProfile(user);
}

function populatePageProfile(user) {
  if (!user) return;
  const nameEls = document.querySelectorAll('#page-user-name, #user-name');
  const emailEls = document.querySelectorAll('#page-user-email, #user-email');
  nameEls.forEach((el) => (el.textContent = user.name || ''));
  emailEls.forEach((el) => (el.textContent = user.email || ''));
  // also try client header user block if present outside header context
  const clientHeaderUser = document.querySelector('#client-header-user');
  const clientAvatar = document.querySelector('#client-header-avatar');
  if (clientHeaderUser) clientHeaderUser.innerHTML = `<p class="text-sm font-bold text-slate-900">${user.name || ''}</p><p class="text-xs text-slate-500">${user.email || ''}</p>`;
  if (clientAvatar) clientAvatar.textContent = makeAvatarInitials(user.name);
}

document.addEventListener('DOMContentLoaded', () => {
  if (readSessionUser()) showProfileHeader();
});

export default {};
