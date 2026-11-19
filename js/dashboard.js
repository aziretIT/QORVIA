import { grammarLessons } from '../data/grammar.js';
import { vocabulary } from '../data/vocabulary.js';
import { dateKey, getState, streak } from './store.js';
import { escape, icon } from './ui.js';

const modules = {
  vocabulary: 'Vocabulary', grammar: 'Grammar', ielts: 'IELTS Prep',
  sat: 'SAT Prep', challenge: 'Daily Challenge',
};

function recommendation(state, today, completedLessons) {
  const due = vocabulary.filter(({ id }) => {
    const word = state.words[id];
    return word?.learned && (!word.due || word.due <= today);
  }).length;
  if (due) return {
    icon: 'refresh', title: 'Review your vocabulary',
    description: `${due} ${due === 1 ? 'word is' : 'words are'} due for spaced review.`,
    href: 'vocabulary.html?mode=review', action: 'Review words',
  };
  const next = grammarLessons.find((lesson) => !completedLessons.has(lesson.id));
  const choices = {
    Vocabulary: { icon: 'vocabulary', title: `${state.profile.level} vocabulary`, description: 'Use flashcards to practice words and their Spanish translations.', href: 'vocabulary.html?mode=flashcards', action: 'Open flashcards' },
    IELTS: { icon: 'ielts', title: 'Practice an IELTS skill', description: 'Try an original exercise in listening, reading, writing, or speaking.', href: 'ielts.html', action: 'Open IELTS Prep' },
    SAT: { icon: 'sat', title: 'Pick an SAT topic', description: 'Choose a Math or Reading and Writing question set.', href: 'sat.html', action: 'Open SAT Prep' },
    Grammar: next && { icon: 'grammar', title: next.title, description: next.description, href: `grammar.html?lesson=${next.id}`, action: 'Start lesson' },
  };
  return state.profile.subjects.map((subject) => choices[subject]).find(Boolean)
    || choices.Grammar || choices.Vocabulary;
}

function stat(symbol, color, value, label, link) {
  return `<a class="card stat-tile" href="${link}"><span class="feature-icon ${color}">${icon(symbol, 19)}</span>
    <span><strong>${value}</strong><small>${label}</small></span></a>`;
}

function track(label, value, max) {
  return `<div class="dash-track-row"><span><strong>${label}</strong> ${value} of ${max}</span>
    <progress max="${max}" value="${value}" aria-label="${label}"></progress></div>`;
}

export function render(root, { account = null } = {}) {
  const state = getState();
  const currentDate = new Date();
  const today = dateKey(currentDate);
  const dateLabel = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'short', day: 'numeric' }).format(currentDate);
  const learned = vocabulary.filter(({ id }) => state.words[id]?.learned).length;
  const exercises = state.activity.filter((item) => item.completed);
  const grammarIds = new Set(grammarLessons.map(({ id }) => id));
  const completedLessons = new Set(exercises.filter((item) => item.module === 'grammar' && grammarIds.has(item.lessonId)).map((item) => item.lessonId));
  const progress = Math.round((learned + completedLessons.size) / (vocabulary.length + grammarLessons.length) * 100);
  const minutes = state.activity.filter((item) => item.date === today && Number.isFinite(item.minutes))
    .reduce((sum, item) => sum + item.minutes, 0);
  const goal = state.profile.goal;
  const percent = Math.min(100, Math.round(minutes / goal * 100));
  const days = streak(state);
  const next = recommendation(state, today, completedLessons);
  const challenge = state.challenge[today];
  const displayName = state.profile.name || account?.username;
  const recent = state.activity.slice(-4).reverse();

  root.innerHTML = `
    <header class="page-head dashboard-head">
      <div><h1>${displayName ? `Welcome, ${escape(displayName)}` : 'Welcome to QORVIA'}</h1>
        <p>${exercises.length ? 'Pick up a lesson or see how your study is going.' : 'Choose a study area and take your first step today.'}</p></div>
      <span class="dashboard-date">${icon('calendar', 17)} <time datetime="${today}">${dateLabel}</time></span>
    </header>
    <div class="stack">
      <section class="dash-goal" aria-labelledby="goal-title">
        <div>
          <p class="eyebrow">${icon('target', 17)} Daily learning goal</p>
          <h2 id="goal-title">${percent === 100 ? 'You reached today’s goal.' : 'Make time to learn today.'}</h2>
          <p>${minutes} of ${goal} estimated study minutes</p>
          <a class="button secondary" href="profile.html">Edit my goal ${icon('arrow', 16)}</a>
        </div>
        <div class="goal-ring" style="--percent:${percent}%" role="img" aria-label="${percent}% of today’s goal">
          <div aria-hidden="true"><strong>${percent}%</strong><small>of daily goal</small></div>
        </div>
      </section>

      <section class="dash-stats" aria-label="Learning statistics">
        ${stat('vocabulary', 'blue', learned, 'Words learned', 'vocabulary.html?mode=review')}
        ${stat('check', 'mint', exercises.length, 'Exercises completed', 'progress.html')}
        ${stat('fire', 'amber', `${days} ${days === 1 ? 'day' : 'days'}`, 'Current streak', 'progress.html')}
        ${stat('progress', 'lilac', `${progress}%`, 'Vocabulary & grammar', 'progress.html')}
      </section>

      <div class="grid grid-2">
        <section class="card dash-card" aria-labelledby="next-title">
          <div class="dash-card-head"><span class="feature-icon blue">${icon(next.icon)}</span><span class="pill">Up next</span></div>
          <h2 id="next-title">${escape(next.title)}</h2>
          <p>${escape(next.description)}</p>
          <a class="button primary" href="${next.href}">${next.action} ${icon('arrow', 17)}</a>
        </section>
        <section class="card dash-card" aria-labelledby="challenge-title">
          <div class="dash-card-head"><span class="feature-icon amber">${icon('challenge')}</span><span class="pill">${challenge ? 'Completed today' : '3 questions'}</span></div>
          <h2 id="challenge-title">Daily Challenge</h2>
          <p>${challenge ? `You answered ${challenge.score} of ${challenge.total} questions correctly today.` : 'Try a quick mix of vocabulary, grammar, and reasoning.'}</p>
          <a class="button secondary" href="challenge.html">${challenge ? 'Review results' : 'Start challenge'} ${icon('arrow', 17)}</a>
        </section>
      </div>

      <div class="grid grid-2">
        <section class="card dash-card" aria-labelledby="recent-title">
          <h2 id="recent-title">Recent activity</h2>
          ${recent.length ? `<ul class="recent-list">${recent.map((item) => {
            const title = escape(item.title);
            const label = modules[item.module] || 'Practice';
            return `<li><div>${Object.hasOwn(modules, item.module) ? `<a href="${item.module}.html">${title}</a>` : title}<p>${label}</p></div><time datetime="${escape(item.date)}">${item.date === today ? 'Today' : escape(item.date)}</time></li>`;
          }).join('')}</ul>` : '<p>Completed practice will show up here. Start with a lesson or today’s challenge.</p>'}
        </section>
        <section class="card dash-track" aria-labelledby="track-title">
          <h2 id="track-title">Course progress</h2>
          ${track('Words learned', learned, vocabulary.length)}
          ${track('Grammar lessons practiced', completedLessons.size, grammarLessons.length)}
          <a class="text-link" href="progress.html">View analytics ${icon('arrow', 17)}</a>
        </section>
      </div>
    </div>`;
}
