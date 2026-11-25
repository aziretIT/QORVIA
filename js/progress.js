import { grammarLessons } from '../data/grammar.js';
import { vocabulary } from '../data/vocabulary.js';
import { dateKey, getState, streak } from './store.js';
import { emptyState, escape, icon, pageHeader } from './ui.js';

const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
const historyDateFormatter = new Intl.DateTimeFormat(undefined, {
  day: 'numeric', month: 'short', year: 'numeric',
});
const weekdayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'short' });
const monthDayFormatter = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' });

function metric(label, value, symbol, detail) {
  return `<article class="card stats-tile">
    <span class="feature-icon${symbol === 'fire' ? ' amber' : ''}">${icon(symbol)}</span>
    <div><p class="muted">${label}</p><strong>${value}</strong><small class="muted">${detail}</small></div>
  </article>`;
}

function currentWeek(activity) {
  const days = [];
  const now = new Date();
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset, 12);
    const key = dateKey(date);
    const minutes = activity.reduce((sum, item) => {
      return item.date === key && Number.isFinite(item.minutes) ? sum + item.minutes : sum;
    }, 0);
    days.push({ date, minutes: Math.max(0, Math.round(minutes)) });
  }
  return days;
}

function activityChart(activity) {
  const days = currentWeek(activity);
  const max = Math.max(...days.map(({ minutes }) => minutes), 1);
  const total = days.reduce((sum, day) => sum + day.minutes, 0);
  return `<section class="card progress-panel" aria-labelledby="weekly-activity">
    <div class="progress-panel-head">
      <div><h2 id="weekly-activity">Weekly activity</h2>
      <p class="muted">${escape(monthDayFormatter.format(days[0].date))} – ${escape(monthDayFormatter.format(days.at(-1).date))}</p></div>
      <span class="pill">${total} min estimated</span>
    </div>
    <ul class="activity-chart" aria-label="Estimated study minutes over the last seven days">
      ${days.map(({ date, minutes }) => `<li>
        <span class="activity-value" aria-label="${minutes} minutes">${minutes}</span>
        <div class="activity-track" aria-hidden="true"><span style="--activity-height:${(minutes / max) * 100}%"></span></div>
        <span class="activity-day" aria-label="${escape(historyDateFormatter.format(date))}">${escape(weekdayFormatter.format(date))}</span>
      </li>`).join('')}
    </ul>
    ${total ? '' : '<p class="muted">Finish a learning activity to start tracking your week.</p>'}
  </section>`;
}

function vocabularyProgress(learnedWords) {
  const countByLevel = levels.map((level) => {
    const count = learnedWords.filter((entry) => entry.level === level).length;
    const total = vocabulary.filter((entry) => entry.level === level).length;
    return `<div class="progress-level">
      <div><label for="vocab-${level}">${level}</label><span class="muted">${count} / ${total} learned</span></div>
      <progress id="vocab-${level}" max="${total || 1}" value="${count}"></progress>
    </div>`;
  }).join('');
  return `<section class="card progress-panel" aria-labelledby="vocabulary-progress">
    <div class="progress-panel-head">
      <div><h2 id="vocabulary-progress">Vocabulary progress</h2>
      <p class="muted">${learnedWords.length} of ${vocabulary.length} words learned</p></div>
      <a class="button ghost" href="vocabulary.html" aria-label="Open Vocabulary">${icon('arrow', 16)}</a>
    </div>
    <div class="progress-levels">${countByLevel}</div>
  </section>`;
}

function isScored(item) {
  return Number.isFinite(item.score) && Number.isFinite(item.total) && item.total > 0;
}

function isSelfReview(item) {
  return item.module === 'ielts' && /^(writing|speaking):/.test(item.lessonId);
}

function historyResult(item) {
  if (isSelfReview(item)) return isScored(item) ? `${item.score} / ${item.total} criteria marked` : 'Self-review saved';
  return isScored(item) ? `${item.score} / ${item.total}` : 'Completed';
}

function historyList(items) {
  return `<ul class="history-list">
    ${items.map((item) => {
      const date = new Date(`${item.date}T12:00:00`);
      const validDate = !Number.isNaN(date.getTime());
      return `<li><div><strong>${escape(item.title)}</strong>
        ${validDate ? `<time class="muted" datetime="${escape(item.date)}">${escape(historyDateFormatter.format(date))}</time>` : ''}</div>
        <span class="pill">${historyResult(item)}</span></li>`;
    }).join('')}
  </ul>`;
}

function practiceHistory({ title, module, symbol, activity, description }) {
  const attempts = activity.filter((item) => item.module === module && item.completed).slice().reverse();
  const scored = attempts.filter((item) => isScored(item) && !isSelfReview(item));
  const available = scored.reduce((sum, item) => sum + item.total, 0);
  const correct = scored.reduce((sum, item) => sum + item.score, 0);
  const accuracy = available ? `<span class="pill">${Math.round(correct / available * 100)}% practice accuracy</span>` : '';
  const link = `<a class="button secondary" href="${module}.html">Open ${module === 'grammar' ? 'Grammar' : module.toUpperCase()} ${icon('arrow', 16)}</a>`;
  return `<section class="card progress-panel" aria-labelledby="history-${module}">
    <div class="progress-panel-head"><div class="progress-panel-title">
      <span class="feature-icon">${icon(symbol)}</span>
      <div><h2 id="history-${module}">${title}</h2><p class="muted">${description}</p></div>
    </div>${accuracy}</div>
    ${attempts.length ? `${historyList(attempts.slice(0, 5))}
      ${attempts.length > 5 ? `<details class="older-history"><summary>Show ${attempts.length - 5} earlier ${attempts.length === 6 ? 'activity' : 'activities'}</summary>${historyList(attempts.slice(5))}</details>` : ''}
      ${link}` : emptyState('No practice recorded', 'Your completed practice will appear here.', link)}
  </section>`;
}

export function render(root) {
  const state = getState();
  const words = vocabulary.filter((entry) => state.words[entry.id]?.learned);
  const completed = state.activity.filter((item) => item.completed);
  const courseModules = ['grammar', 'ielts', 'sat'];
  const lessons = new Set(completed
    .filter((item) => courseModules.includes(item.module) && item.lessonId)
    .map((item) => `${item.module}/${item.lessonId}`));
  const grammarCount = grammarLessons.filter((lesson) => lessons.has(`grammar/${lesson.id}`)).length;
  const activeStreak = streak(state);
  const practice = completed.filter((item) => courseModules.includes(item.module)).length;

  root.innerHTML = `${pageHeader('Progress & Analytics', 'Track your learning activity, lesson completions, and practice results.')}
    <section class="grid grid-4 progress-metrics" aria-label="Learning totals">
      ${metric('Words learned', words.length, 'vocabulary', `Of ${vocabulary.length} available`)}
      ${metric('Learning streak', `${activeStreak} ${activeStreak === 1 ? 'day' : 'days'}`, 'fire', 'Consecutive study days')}
      ${metric('Lessons completed', lessons.size, 'check', 'Unique course lessons')}
      ${metric('Practice sessions', practice, 'target', 'Grammar, IELTS, and SAT')}
    </section>
    <div class="grid grid-2 progress-overview">
      ${activityChart(state.activity)}
      ${vocabularyProgress(words)}
    </div>
    <div class="stack progress-histories">
      ${practiceHistory({ title: 'Grammar test results', module: 'grammar', symbol: 'grammar', activity: state.activity, description: `${grammarCount} of ${grammarLessons.length} grammar lessons completed` })}
      ${practiceHistory({ title: 'IELTS practice history', module: 'ielts', symbol: 'ielts', activity: state.activity, description: 'Question accuracy covers listening and reading. Writing and speaking use self-review.' })}
      ${practiceHistory({ title: 'SAT practice history', module: 'sat', symbol: 'sat', activity: state.activity, description: 'Math and Reading & Writing practice' })}
    </div>`;
}
