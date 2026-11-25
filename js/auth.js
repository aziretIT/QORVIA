import { accountEnabled } from './auth-config.js';

export { accountEnabled };

const studyPages = new Set([
  'dashboard.html', 'vocabulary.html', 'grammar.html', 'ielts.html',
  'sat.html', 'challenge.html', 'progress.html', 'profile.html', 'pricing.html',
]);

const unavailable = 'The account service is unavailable. Try again or continue as a guest.';
const sessionChannel = accountEnabled && typeof BroadcastChannel === 'function'
  ? new BroadcastChannel('qorvia-account-session')
  : null;

export function onSessionChange(listener) {
  sessionChannel?.addEventListener('message', listener);
}

function safeDestination(path) {
  const page = path?.split(/[?#]/, 1)[0];
  return studyPages.has(page) ? path : 'dashboard.html';
}

export function accountDestination() {
  return safeDestination(new URLSearchParams(location.search).get('next'));
}

export function accountLink(page, destination = accountDestination()) {
  const next = safeDestination(destination);
  return next === 'dashboard.html' ? page : `${page}?next=${encodeURIComponent(next)}`;
}

async function requestAccount(endpoint, details) {
  if (!accountEnabled) throw new Error('Start the QORVIA server to use accounts.');

  let response;
  let result;
  try {
    response = await fetch(`api/${endpoint}`, {
      cache: 'no-store',
      credentials: 'same-origin',
      signal: AbortSignal.timeout(8000),
      ...(details && {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      }),
    });
    result = await response.json();
  } catch {
    throw new Error(unavailable);
  }

  if (!response.ok) throw new Error(result.message || unavailable);
  if (details) sessionChannel?.postMessage('session changed');
  return result.account;
}

export function getSession() {
  return accountEnabled ? requestAccount('session') : Promise.resolve(null);
}

export function signIn(details) {
  return requestAccount('login', details);
}

export function signUp(details) {
  return requestAccount('signup', details);
}

export function signOut() {
  return requestAccount('logout', {});
}
