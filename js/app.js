import { brand, escape, icon, pageHeader } from './ui.js';
import { accountEnabled, accountLink, getSession, onSessionChange } from './auth.js';
import { canSave, getState, setLearningAccount } from './store.js';

const sections = [
  ['Overview', [['dashboard', 'Dashboard']]],
  ['Study', [['vocabulary', 'Vocabulary'], ['grammar', 'Grammar'], ['ielts', 'IELTS Prep'], ['sat', 'SAT Prep']]],
  ['Activities', [['challenge', 'Daily Challenge'], ['progress', 'Progress']]],
  ['Account', [['profile', 'Profile'], ['pricing', 'Pricing']]],
];

const titles = Object.fromEntries(sections.flatMap(([, links]) => links));
const page = document.body.dataset.page;

function menu(toggle, close, panel, backdrop, background = []) {
  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('menu-open', open);
    if (backdrop) backdrop.hidden = !open;
    background.forEach((element) => { element.inert = open; });
  }

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'false';
    setOpen(open);
    if (open && close) close.focus();
  });

  function dismiss() {
    setOpen(false);
    toggle.focus();
  }

  close?.addEventListener('click', dismiss);
  backdrop?.addEventListener('click', dismiss);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') dismiss();
  });
  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });
  matchMedia('(min-width: 861px)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

function setupApp(account, accountUnavailable) {
  const displayName = () => getState().profile.name.trim() || account?.username || 'Guest';
  const initial = () => Array.from(displayName())[0].toLocaleUpperCase();
  const returnPath = `${page}.html${location.search}${location.hash}`;
  document.body.classList.add('app-body');
  document.body.insertAdjacentHTML('afterbegin', `
    <a class="skip-link" href="#main">Skip to content</a>
    <button class="menu-backdrop" type="button" aria-label="Close navigation" tabindex="-1" hidden></button>
    <aside class="sidebar" id="sidebar">
      <div class="side-brand">${brand()}
        <button type="button" class="icon-button side-close" aria-label="Close navigation">${icon('close')}</button>
      </div>
      <nav aria-label="Student navigation">
        ${sections.map(([label, links]) => `
          <div class="side-group">
            <p>${label}</p>
            ${links.map(([id, title]) => `<a href="${id}.html" ${id === page ? 'aria-current="page"' : ''}>${icon(id, 18)}<span>${title}</span></a>`).join('')}
          </div>`).join('')}
      </nav>
      <a class="side-home" href="index.html">${icon('back', 17)} Back to homepage</a>
    </aside>
    <header class="app-topbar">
      <div class="app-location">
        <button type="button" class="icon-button mobile-toggle" aria-controls="sidebar" aria-expanded="false" aria-label="Toggle navigation">${icon('menu')}</button>
        <span class="location-home">Learning space</span>${icon('chevron', 14)}<strong>${titles[page]}</strong>
      </div>
      <div class="app-account">
        ${account ? '' : `<a href="${escape(accountLink('login.html', returnPath))}" class="app-login">Log in</a>`}
        <a href="profile.html" class="avatar-link" aria-label="Open profile" ${page === 'profile' ? 'aria-current="page"' : ''}>
          <span class="avatar">${escape(initial())}</span><span class="avatar-name">${escape(displayName())}</span>
        </a>
      </div>
    </header>
    ${accountUnavailable ? '<div class="storage-notice" role="status">Account service is unavailable. You can continue as a guest.</div>' : ''}
    <div id="storage-notice" class="storage-notice" role="status" hidden></div>
  `);
  menu(document.querySelector('.mobile-toggle'), document.querySelector('.side-close'),
    document.querySelector('.sidebar'), document.querySelector('.menu-backdrop'),
    document.querySelectorAll('.skip-link, .app-topbar, #main'));

  function showStorageNotice() {
    const notice = document.querySelector('#storage-notice');
    notice.textContent = 'Browser storage is unavailable. Progress will stay on this page until you leave or reload.';
    notice.hidden = false;
  }
  window.addEventListener('qorvia:storage-unavailable', showStorageNotice);
  if (!canSave()) showStorageNotice();
  window.addEventListener('qorvia:profile-updated', () => {
    document.querySelector('.avatar').textContent = initial();
    document.querySelector('.avatar-name').textContent = displayName();
  });
}

if (page === 'home') {
  menu(document.querySelector('.public-menu-toggle'), null, document.querySelector('.public-nav'));
}

let account = null;
let accountUnavailable = false;
try {
  account = await getSession();
} catch {
  accountUnavailable = true;
}

if (accountEnabled) {
  onSessionChange(() => location.reload());
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) location.reload();
  });
}

if (page === 'home') {
  if (account) {
    document.querySelectorAll('[data-account-login]').forEach((link) => {
      link.href = 'dashboard.html';
      link.textContent = 'Open Dashboard';
    });
    document.querySelectorAll('[data-account-signup]').forEach((link) => { link.hidden = true; });
  }
} else {
  setLearningAccount(account?.id);
  setupApp(account, accountUnavailable);
  const root = document.querySelector('#main');
  try {
    const { render } = await import(`./${page}.js`);
    render(root, { account });
  } catch (error) {
    console.error(error);
    root.innerHTML = `${pageHeader('This page could not load', 'Reload the page to try again.')}
      <a class="button primary" href="${escape(location.pathname.split('/').at(-1))}">Reload page</a>`;
  }
}
