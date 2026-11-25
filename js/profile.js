import { signOut } from './auth.js';
import { canSave, getState, streak, updateState } from './store.js';
import { escape, icon, pageHeader } from './ui.js';

const levels = [
  ['A1', 'Beginner'], ['A2', 'Elementary'], ['B1', 'Intermediate'],
  ['B2', 'Upper intermediate'], ['C1', 'Advanced'],
];
const subjects = ['Vocabulary', 'Grammar', 'IELTS', 'SAT'];

function subjectChoices(selected) {
  return subjects.map((subject) => `<label class="profile-subject">
    <input type="checkbox" name="subjects" value="${subject}" ${selected.includes(subject) ? 'checked' : ''}>
    ${icon(subject.toLowerCase(), 17)}<span>${subject}</span>
  </label>`).join('');
}

export function render(root, { account = null } = {}) {
  const state = getState();
  const { profile } = state;
  const completed = state.activity.filter((item) => item.completed).length;
  const words = Object.values(state.words).filter((entry) => entry.learned).length;
  const studyStreak = streak(state);
  const name = typeof profile.name === 'string' ? profile.name.trim() : '';
  const initial = [...name][0]?.toLocaleUpperCase() || 'Q';
  const selected = Array.isArray(profile.subjects) ? profile.subjects : [];

  root.innerHTML = `${pageHeader('Profile', 'Set a study goal and choose what you want to learn.')}
    <div class="profile-layout">
      <section class="card profile-panel" aria-labelledby="profile-settings-title">
        <div class="profile-heading">
          <span class="profile-avatar" aria-hidden="true">${escape(initial)}</span>
          <div><h2 id="profile-settings-title">Learning settings</h2><p class="muted">Personalize your learning dashboard.</p></div>
        </div>
        <form class="stack" id="profile-form">
          <div class="field"><label for="display-name">Display name</label>
            <input id="display-name" name="name" value="${escape(name)}" placeholder="Learner" maxlength="50" autocomplete="off">
            <small class="muted">Optional. A nickname works well.</small>
          </div>
          <div class="grid grid-2 profile-form-row">
            <div class="field"><label for="current-level">Current English level (CEFR)</label>
              <select id="current-level" name="level">${levels.map(([level, label]) => `<option value="${level}" ${profile.level === level ? 'selected' : ''}>${level} · ${label}</option>`).join('')}</select>
            </div>
            <div class="field"><label for="daily-goal">Daily study goal (minutes)</label>
              <input id="daily-goal" name="goal" type="number" min="5" max="120" required value="${escape(profile.goal)}">
            </div>
          </div>
          <fieldset class="profile-fieldset">
            <legend>Preferred subjects</legend>
            <p class="muted">Choose any subjects you want to prioritize.</p>
            <div class="profile-subjects">${subjectChoices(selected)}</div>
          </fieldset>
          <div class="profile-actions">
            <button class="button primary" type="submit">Save settings ${icon('check', 16)}</button>
            <p class="muted" id="profile-status" role="status"></p>
          </div>
        </form>
      </section>
      <aside class="stack" aria-label="Your learning information">
        ${account ? `<section class="card profile-panel stack" aria-labelledby="profile-account-title">
          <h2 id="profile-account-title">Account</h2>
          <p class="muted">Signed in as <strong>${escape(account.username)}</strong>.</p>
          <div><button class="button secondary" id="account-logout" type="button">Log out</button></div>
          <p class="muted" id="account-status" role="status" hidden></p>
        </section>` : ''}
        <section class="card profile-panel" aria-labelledby="profile-stats-title">
          <h2 id="profile-stats-title">Learning statistics</h2>
          <dl class="profile-stats">
            <div><dt>Completed exercises</dt><dd>${completed}</dd></div>
            <div><dt>Words learned</dt><dd>${words}</dd></div>
            <div><dt>Learning streak</dt><dd>${studyStreak} ${studyStreak === 1 ? 'day' : 'days'}</dd></div>
          </dl>
          <a class="button secondary" href="progress.html">View progress ${icon('arrow', 16)}</a>
        </section>
        <section class="card profile-panel profile-local" aria-labelledby="profile-privacy-title">
          <span class="feature-icon">${icon('lock')}</span>
          <div><h2 id="profile-privacy-title">Saved on this device</h2>
          <p class="muted">Your settings and learning activity are kept in this browser.</p></div>
        </section>
      </aside>
    </div>`;

  const form = root.querySelector('#profile-form');
  const status = root.querySelector('#profile-status');
  const logout = root.querySelector('#account-logout');
  logout?.addEventListener('click', async () => {
    logout.disabled = true;
    const accountStatus = root.querySelector('#account-status');
    accountStatus.hidden = true;
    try {
      await signOut();
      location.replace('index.html');
    } catch (error) {
      accountStatus.textContent = error.message;
      accountStatus.hidden = false;
      logout.disabled = false;
      logout.focus();
    }
  });
  form.addEventListener('input', () => { status.textContent = ''; });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const entries = new FormData(form);
    const settings = {
      name: String(entries.get('name')).trim(),
      goal: Number(entries.get('goal')),
      level: entries.get('level'),
      subjects: entries.getAll('subjects'),
    };
    updateState((next) => { next.profile = settings; });
    form.elements.namedItem('name').value = settings.name;
    root.querySelector('.profile-avatar').textContent = [...settings.name][0]?.toLocaleUpperCase() || 'Q';
    status.textContent = canSave() ? 'Settings saved.' : 'Settings updated for this session.';
    window.dispatchEvent(new Event('qorvia:profile-updated'));
  });
}
