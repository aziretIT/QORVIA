import { dailyQuestions } from '../data/challenge.js';
import { addActivity, dateKey, getState, updateState } from './store.js';
import { escape, icon, pageHeader } from './ui.js';

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'long', month: 'long', day: 'numeric',
});

function challengeStreak(challenges, today) {
  const date = new Date(`${today}T12:00:00`);
  if (!challenges[today]) date.setDate(date.getDate() - 1);
  let days = 0;
  while (challenges[dateKey(date)]) {
    days += 1;
    date.setDate(date.getDate() - 1);
  }
  return days;
}

function summaryCard(label, value, symbol, detail) {
  return `<article class="card stats-tile">
    <span class="feature-icon${symbol === 'fire' ? ' amber' : ''}" aria-hidden="true">${icon(symbol)}</span>
    <div><p class="muted">${label}</p><strong>${value}</strong><small class="muted">${detail}</small></div>
  </article>`;
}

function questionCard(question, number, selected, result) {
  const complete = Boolean(result);
  const correct = selected === question.answer;
  const answerStatus = Number.isInteger(selected) ? 'Answered' : 'To do';
  const resultStatus = correct ? 'Correct' : 'Review';
  const options = complete ? '' : `<div class="quiz-options" role="group" aria-labelledby="prompt-${question.id}">
    ${question.options.map((option, index) => `<label class="quiz-option">
      <input type="radio" name="${question.id}" value="${index}" ${index === 0 ? 'required' : ''} ${selected === index ? 'checked' : ''}>
      <span>${escape(option)}</span>
    </label>`).join('')}
  </div>`;

  return `<section class="card challenge-question" aria-labelledby="prompt-${question.id}">
    <div class="challenge-question-head">
      <p class="eyebrow">${escape(question.label)}</p>
      <span class="pill${complete && correct ? ' success' : ''}" data-status="${question.id}">${complete ? resultStatus : answerStatus}</span>
    </div>
    <h2 id="prompt-${question.id}"><span class="learning-visually-hidden">Question ${number}. </span>${escape(question.prompt)}</h2>
    ${options}
    ${complete ? `<div class="challenge-feedback">
      ${Number.isInteger(selected) ? `<p><strong>Your answer</strong> ${escape(question.options[selected])}</p>` : ''}
      <p><strong>Correct answer</strong> ${escape(question.options[question.answer])}</p>
      <p class="muted">${escape(question.explanation)}</p>
    </div>` : ''}
  </section>`;
}

export function render(root) {
  const today = dateKey();
  const state = getState();
  const questions = dailyQuestions(today);
  const result = state.challenge[today];
  const draft = state.challengeDraft?.date === today ? state.challengeDraft.answers : {};
  const answers = result?.answers || draft || {};
  const answered = result ? questions.length : questions.filter(({ id }) => Number.isInteger(answers[id])).length;
  const days = challengeStreak(state.challenge, today);
  const questionCards = questions.map((question, index) => questionCard(question, index + 1, answers[question.id], result)).join('');

  root.innerHTML = `${pageHeader('Daily Challenge', 'Three questions to keep your vocabulary, grammar, and reasoning sharp.')}
    <section class="grid grid-3 challenge-summary" aria-label="Today’s challenge summary">
      ${summaryCard('Today’s score', result ? `${result.score} / ${result.total}` : '—', 'target', result ? 'Challenge complete' : 'Available after checking')}
      ${summaryCard('Daily progress', `${answered} / ${questions.length}`, 'check', 'Questions answered')}
      ${summaryCard('Challenge streak', `${days} ${days === 1 ? 'day' : 'days'}`, 'fire', 'Consecutive daily challenges')}
    </section>
    <div class="challenge-heading">
      <h2>${escape(dateFormatter.format(new Date(`${today}T12:00:00`)))}</h2>
      <span class="pill">${result ? 'Completed' : 'Today’s set'}</span>
    </div>
    ${result ? `<div class="stack" id="challenge-results" tabindex="-1">${questionCards}
      <a class="button secondary" href="progress.html">View your progress ${icon('arrow', 16)}</a>
    </div>` : `<form class="stack" id="challenge-form">${questionCards}
      <div class="challenge-actions">
        <p class="muted" id="challenge-status" role="status">${answered} of ${questions.length} answered</p>
        <button class="button primary" type="submit">Check answers ${icon('arrow', 16)}</button>
      </div>
    </form>`}`;

  if (result) return;

  const form = root.querySelector('#challenge-form');
  const currentAnswers = () => {
    const selections = new FormData(form);
    return Object.fromEntries(questions
      .filter(({ id }) => selections.has(id))
      .map(({ id }) => [id, Number(selections.get(id))]));
  };

  form.addEventListener('change', (event) => {
    if (dateKey() !== today) {
      render(root);
      root.focus();
      return;
    }
    const selection = event.target;
    const current = currentAnswers();
    updateState((next) => {
      if (next.challenge[today]) return;
      const saved = next.challengeDraft?.date === today ? next.challengeDraft.answers : {};
      next.challengeDraft = { date: today, answers: { ...saved, [selection.name]: Number(selection.value) } };
    });
    root.querySelector(`[data-status="${selection.name}"]`).textContent = 'Answered';
    const count = Object.keys(current).length;
    root.querySelector('#challenge-status').textContent = `${count} of ${questions.length} answered`;
    root.querySelector('.challenge-summary .stats-tile:nth-child(2) strong').textContent = `${count} / ${questions.length}`;
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (dateKey() !== today) {
      render(root);
      root.focus();
      return;
    }
    const answers = currentAnswers();
    if (Object.keys(answers).length !== questions.length) return;
    const score = questions.filter((question) => answers[question.id] === question.answer).length;
    const total = questions.length;
    updateState((next) => {
      if (next.challenge[today]) return;
      next.challenge[today] = { score, total, answers };
      if (next.challengeDraft?.date === today) delete next.challengeDraft;
      addActivity(next, {
        module: 'challenge', title: 'Daily challenge', score, total, minutes: 3,
        lessonId: today,
      });
    });
    render(root);
    root.querySelector('#challenge-results')?.focus();
  });
}
