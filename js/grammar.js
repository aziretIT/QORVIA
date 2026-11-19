import { grammarLessons } from '../data/grammar.js';
import { getState, recordActivity } from './store.js';
import { icon, pageHeader, quiz } from './ui.js';

const levels = ['Beginner', 'Intermediate', 'Advanced'];
const lessonSequence = levels.flatMap(level => grammarLessons.filter(lesson => lesson.level === level));

function completedLessons() {
  return new Set(getState().activity
    .filter(activity => activity.module === 'grammar' && activity.completed)
    .map(activity => activity.lessonId));
}

function lessonCard(lesson, completed) {
  return `<article class="card study-card">
    <div class="study-card-head">
      <span class="pill">${lesson.level}</span>
      ${completed ? `<span class="study-completed">${icon('check', 16)} Practiced</span>` : ''}
    </div>
    <h2>${lesson.title}</h2>
    <p class="muted">${lesson.description}</p>
    <div class="study-card-actions">
      <a class="button secondary" href="grammar.html?lesson=${lesson.id}">
        ${completed ? 'Review lesson' : 'Open lesson'} ${icon('arrow', 16)}
      </a>
    </div>
  </article>`;
}

function renderCatalog(root, invalidLesson) {
  const completed = completedLessons();
  const practiced = grammarLessons.filter(lesson => completed.has(lesson.id)).length;
  root.innerHTML = `
    ${pageHeader('Grammar', 'Study clear examples and practice using English grammar in context.',
      `<span class="pill">${practiced} / ${grammarLessons.length} practiced</span>`)}
    ${invalidLesson ? '<p class="study-example" role="status">That lesson could not be found. Choose a topic below.</p>' : ''}
    <div class="toolbar study-toolbar">
      <label class="field">
        <span>Lesson level</span>
        <select data-grammar-level>
          <option value="">All levels</option>
          ${levels.map(level => `<option>${level}</option>`).join('')}
        </select>
      </label>
    </div>
    <p class="muted study-status" data-grammar-status role="status"></p>
    <section class="grid grid-2 study-grid" data-grammar-lessons aria-label="Grammar lessons"></section>
  `;

  const level = root.querySelector('[data-grammar-level]');
  const status = root.querySelector('[data-grammar-status]');
  const listing = root.querySelector('[data-grammar-lessons]');

  function showLessons() {
    const visible = lessonSequence.filter(lesson => !level.value || lesson.level === level.value);
    listing.innerHTML = visible.map(lesson => lessonCard(lesson, completed.has(lesson.id))).join('');
    status.textContent = `${visible.length} lessons`;
  }

  level.addEventListener('change', showLessons);
  showLessons();
}

function renderLesson(root, lesson) {
  root.innerHTML = `
    <div class="lesson-detail stack">
      <div><a class="button ghost" href="grammar.html">${icon('back', 16)} All grammar lessons</a></div>
      ${pageHeader(lesson.title, lesson.description, `<span class="pill">${lesson.level}</span>`)}
      <div class="card study-card">
        <h2>How it works</h2>
        ${lesson.explanation.map(paragraph => `<p>${paragraph}</p>`).join('')}
        <h3>Examples</h3>
        <ul class="study-example lesson-note">
          ${lesson.examples.map(example => `<li>${example}</li>`).join('')}
        </ul>
      </div>
      <section class="stack" aria-labelledby="practice-heading">
        <div class="card study-card">
          <h2 id="practice-heading">Practice ${lesson.title.toLowerCase()}</h2>
          <p>Answer ${lesson.questions.length} questions and review the explanation for each one.</p>
          <p class="muted" data-grammar-history hidden></p>
          <div><button type="button" class="button primary" data-grammar-start>
            Start practice ${icon('arrow', 16)}
          </button></div>
        </div>
        <div data-grammar-quiz></div>
        <div class="study-card-actions" data-grammar-actions hidden></div>
      </section>
    </div>
  `;

  const history = root.querySelector('[data-grammar-history]');
  const start = root.querySelector('[data-grammar-start]');
  const practice = root.querySelector('[data-grammar-quiz]');
  const actions = root.querySelector('[data-grammar-actions]');

  function refreshHistory() {
    const latest = getState().activity.findLast(activity =>
      activity.module === 'grammar' && activity.lessonId === lesson.id && Number.isFinite(activity.score));
    history.textContent = latest ? `You answered ${latest.score} of ${latest.total} correctly on your last attempt.` : '';
    history.hidden = !latest;
  }

  function startPractice() {
    start.hidden = true;
    actions.hidden = true;
    quiz(practice, {
      questions: lesson.questions,
      onComplete({ score, total }) {
        recordActivity({ module: 'grammar', title: lesson.title, score, total, minutes: 4, lessonId: lesson.id });
        refreshHistory();
        const completed = completedLessons();
        const next = lessonSequence.find(candidate => !completed.has(candidate.id));
        actions.innerHTML = `
          <button class="button secondary" type="button" data-grammar-retry>Try again</button>
          <a class="button primary" href="grammar.html${next ? '?lesson=' + next.id : ''}">
            ${next ? 'Continue to ' + next.title : 'Back to lessons'} ${icon('arrow', 16)}
          </a>
        `;
        actions.hidden = false;
      },
    });
    practice.querySelector('input')?.focus();
  }

  start.addEventListener('click', startPractice);
  actions.addEventListener('click', event => {
    if (event.target.closest('[data-grammar-retry]')) startPractice();
  });
  refreshHistory();
}

export function render(root) {
  const id = new URLSearchParams(location.search).get('lesson');
  const lesson = grammarLessons.find(item => item.id === id);
  if (lesson) {
    renderLesson(root, lesson);
  } else {
    renderCatalog(root, Boolean(id));
  }
}
