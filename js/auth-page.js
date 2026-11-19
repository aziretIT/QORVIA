import { accountDestination, accountEnabled, accountLink, getSession, signIn, signUp } from './auth.js';
import { escape, icon } from './ui.js';

const signingUp = document.body.dataset.page === 'signup';
const title = signingUp ? 'Create your account' : 'Log in';
const submitLabel = signingUp ? 'Create account' : 'Log in';
const passwordLabel = signingUp ? 'passwords' : 'password';
const root = document.querySelector('#main');

function accountForm() {
  return `<form class="auth-form" method="post" action="${signingUp ? 'api/signup' : 'api/login'}">
    <div class="field">
      <label for="account-username">Username</label>
      <input id="account-username" name="username" type="text" required
        autocomplete="username" autocapitalize="none" spellcheck="false"
        minlength="3" maxlength="24" pattern="[A-Za-z0-9_\\-]{3,24}"
        ${signingUp ? 'aria-describedby="username-hint"' : ''}>
      ${signingUp ? '<p id="username-hint" class="auth-hint">3–24 letters, numbers, underscores, or hyphens.</p>' : ''}
    </div>
    <div class="field">
      <label for="account-password">Password</label>
      <div class="auth-password">
        <input id="account-password" name="password" type="password" required maxlength="128"
          ${signingUp ? 'minlength="12" autocomplete="new-password" aria-describedby="password-hint"' : 'autocomplete="current-password"'}>
        <button class="auth-reveal" type="button" aria-controls="account-password${signingUp ? ' account-confirmation' : ''}"
          aria-label="Show ${passwordLabel}">Show</button>
      </div>
      ${signingUp ? '<p id="password-hint" class="auth-hint">Use at least 12 characters.</p>' : ''}
    </div>
    ${signingUp ? `<div class="field">
      <label for="account-confirmation">Confirm password</label>
      <input id="account-confirmation" name="confirmation" type="password" required maxlength="128" autocomplete="new-password">
    </div>` : ''}
    <p class="auth-error" role="alert" tabindex="-1" hidden></p>
    <button class="button primary auth-submit" type="submit">
      <span>${submitLabel}</span>${icon('arrow', 17)}
    </button>
  </form>`;
}

function bindForm() {
  const form = root.querySelector('.auth-form');
  const password = form.elements.password;
  const confirmation = form.elements.confirmation;
  const reveal = root.querySelector('.auth-reveal');
  const submit = root.querySelector('.auth-submit');
  const submitText = submit.querySelector('span');
  const error = root.querySelector('.auth-error');

  reveal.addEventListener('click', () => {
    const visible = password.type === 'password';
    password.type = visible ? 'text' : 'password';
    if (confirmation) confirmation.type = password.type;
    reveal.textContent = visible ? 'Hide' : 'Show';
    reveal.setAttribute('aria-label', `${visible ? 'Hide' : 'Show'} ${passwordLabel}`);
  });

  form.addEventListener('input', () => {
    error.hidden = true;
    confirmation?.setCustomValidity('');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    error.hidden = true;

    if (confirmation && password.value !== confirmation.value) {
      confirmation.setCustomValidity('Enter the same password in both fields.');
      confirmation.reportValidity();
      confirmation.focus();
      return;
    }

    submit.disabled = true;
    submitText.textContent = signingUp ? 'Creating account…' : 'Logging in…';
    try {
      const authorize = signingUp ? signUp : signIn;
      await authorize({ username: form.elements.username.value.trim(), password: password.value });
      form.reset();
      location.replace(accountDestination());
    } catch (failure) {
      error.textContent = failure.message || 'Something went wrong. Please try again.';
      error.hidden = false;
      error.focus();
      submit.disabled = false;
      submitText.textContent = submitLabel;
    }
  });
}

async function render() {
  let sessionNotice = '';
  if (accountEnabled) {
    try {
      if (await getSession()) {
        location.replace(accountDestination());
        return;
      }
    } catch (error) {
      sessionNotice = error.message || 'Could not check your session. You can still continue as a guest.';
    }
  }

  root.innerHTML = `<div class="auth-layout">
    <aside class="auth-panel" aria-label="About QORVIA">
      <span class="auth-panel-mark">${icon('logo', 42)}</span>
      <div>
        <p class="auth-panel-title">Learn beyond limits.</p>
        <p>Build your English, prepare for IELTS and the SAT, and track the work you’ve put in.</p>
      </div>
    </aside>
    <section class="auth-card" aria-labelledby="account-title">
      <h1 id="account-title">${title}</h1>
      ${accountEnabled ? `<p class="auth-intro muted">${signingUp
        ? 'Choose a username and password to get started.'
        : 'Enter your username and password to open your learning space.'}</p>
      ${sessionNotice ? `<p class="auth-notice" role="status">${escape(sessionNotice)}</p>` : ''}
      ${accountForm()}` : `<p class="auth-notice">For account registration with a local copy, run <code>node server.mjs</code> in the QORVIA folder and open the address it prints. You can study as a guest here.</p>`}
      <div class="auth-links">
        ${accountEnabled ? `<p>${signingUp ? 'Already have an account?' : 'New to QORVIA?'}
          <a href="${escape(accountLink(signingUp ? 'login.html' : 'signup.html'))}">${signingUp ? 'Log in' : 'Sign up'}</a></p>` : ''}
        <a class="auth-guest" href="${escape(accountDestination())}">Continue as guest ${icon('arrow', 16)}</a>
      </div>
    </section>
  </div>`;

  if (accountEnabled) bindForm();
}

await render();
