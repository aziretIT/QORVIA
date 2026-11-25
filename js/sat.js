import { satQuestions, satSections, satTopics } from '../data/sat.js';
import { getState, recordActivity } from './store.js';
import { emptyState, escape, icon, pageHeader, quiz } from './ui.js';

const difficulties = ['Easy', 'Medium', 'Hard'];
const dateFormat = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

export function render(root) {
  let activeSection = 'math';
  const selections = new Map();

  root.innerHTML = `
    ${pageHeader('SAT Preparation', 'Build accuracy with original Math and Reading & Writing questions.')}
    <nav class="exam-sections exam-sections-two" aria-label="SAT sections">
      ${satSections.map(section => `
        <button class="exam-section" type="button" data-sat-section="${section.id}" aria-pressed="${section.id === activeSection}">
          <span class="exam-section-icon">${icon(section.icon, 21)}</span>
          <span><strong>${section.label}</strong><small>${section.description}</small></span>
        </button>`).join('')}
    </nav>
    <div class="stack exam-main" data-sat-content></div>
    <section class="stack exam-main" data-performance aria-labelledby="sat-performance-title"></section>`;

  const content = root.querySelector('[data-sat-content]');
  const performance = root.querySelector('[data-performance]');
  const sectionButtons = [...root.querySelectorAll('[data-sat-section]')];
  sectionButtons.forEach(button => button.addEventListener('click', () => {
    if (activeSection === button.dataset.satSection) return;
    activeSection = button.dataset.satSection;
    sectionButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    showSetup();
    showPerformance();
  }));

  function showSetup(focus = false) {
    const section = satSections.find(item => item.id === activeSection);
    const selection = selections.get(activeSection) ?? { topic: '', difficulty: '' };

    content.innerHTML = `
      <section class="card stack exam-practice" aria-labelledby="sat-setup-title">
        <div><h2 id="sat-setup-title" tabindex="-1">${section.label} practice</h2><p class="muted">Choose a topic and difficulty to build your practice set.</p></div>
        <form class="stack" data-sat-setup>
          <div class="grid grid-2">
            <label class="field">Topic
              <select name="topic">
                <option value="">All topics</option>
                ${satTopics[activeSection].map(topic => `<option value="${escape(topic)}">${escape(topic)}</option>`).join('')}
              </select>
            </label>
            <label class="field">Difficulty
              <select name="difficulty">
                <option value="">All difficulties</option>
                ${difficulties.map(difficulty => `<option>${difficulty}</option>`).join('')}
              </select>
            </label>
          </div>
          <div class="toolbar">
            <button class="button primary" type="submit">Start practice ${icon('arrow', 16)}</button>
            <p class="muted" data-count role="status"></p>
          </div>
        </form>
      </section>`;

    const form = content.querySelector('[data-sat-setup]');
    const topic = form.elements.namedItem('topic');
    const difficulty = form.elements.namedItem('difficulty');
    const start = form.querySelector('button[type="submit"]');
    const count = form.querySelector('[data-count]');
    topic.value = selection.topic;
    difficulty.value = selection.difficulty;

    function selectedQuestions() {
      return satQuestions[activeSection].filter(item => (!topic.value || item.topic === topic.value) &&
        (!difficulty.value || item.difficulty === difficulty.value));
    }

    function updateCount() {
      const total = selectedQuestions().length;
      start.disabled = total === 0;
      count.textContent = total ? `${total} ${total === 1 ? 'question' : 'questions'} available` : 'Choose a different topic or difficulty.';
      selections.set(activeSection, { topic: topic.value, difficulty: difficulty.value });
    }

    form.addEventListener('change', updateCount);
    form.addEventListener('submit', event => {
      event.preventDefault();
      const questions = selectedQuestions();
      if (questions.length) openSet(section, questions, topic.value, difficulty.value);
    });
    updateCount();
    if (focus) content.querySelector('h2').focus();
  }

  function openSet(section, questions, topic, difficulty) {
    const title = topic || section.label;
    const startedAt = Date.now();
    content.innerHTML = `
      <button class="button ghost exam-back" type="button" data-sat-back>Back to practice setup</button>
      <section class="card stack exam-practice" aria-labelledby="sat-set-title">
        <div>
          <span class="eyebrow">SAT · ${section.label}</span>
          <h2 id="sat-set-title" tabindex="-1">${escape(title)} practice</h2>
          <p class="muted">${questions.length} ${questions.length === 1 ? 'question' : 'questions'} · ${escape(difficulty || 'Mixed difficulty')}</p>
        </div>
        <div data-sat-quiz></div>
      </section>`;

    content.querySelector('[data-sat-back]').addEventListener('click', () => showSetup(true));
    content.querySelector('h2').focus();
    quiz(content.querySelector('[data-sat-quiz]'), {
      questions,
      onComplete: ({ score, total }) => {
        recordActivity({
          module: 'sat',
          title: `SAT · ${title}`,
          lessonId: `${section.id}:${topic || 'all'}:${difficulty || 'all'}`,
          score,
          total,
          minutes: Math.max(1, Math.round((Date.now() - startedAt) / 60000)),
        });
        showPerformance();
      },
    });
  }

  function showPerformance() {
    const history = getState().activity.filter(entry => entry.module === 'sat' && entry.lessonId?.startsWith(`${activeSection}:`)).reverse();
    const total = history.reduce((sum, entry) => sum + entry.total, 0);
    const correct = history.reduce((sum, entry) => sum + entry.score, 0);
    const accuracy = total ? `${Math.round(correct / total * 100)}%` : '—';

    performance.innerHTML = `
      <div class="exam-heading"><h2 id="sat-performance-title">Your performance</h2></div>
      <div class="grid grid-3">
        <div class="card exam-metric"><span class="muted">Sets completed</span><strong>${history.length}</strong></div>
        <div class="card exam-metric"><span class="muted">Questions answered</span><strong>${total}</strong></div>
        <div class="card exam-metric"><span class="muted">Practice accuracy</span><strong>${accuracy}</strong></div>
      </div>
      ${history.length ? `
        <article class="card stack exam-history">
          <h3>Recent practice</h3>
          <ul>
            ${history.slice(0, 5).map(entry => `
              <li><span>${escape(entry.title)} <small class="muted">${dateFormat.format(new Date(`${entry.date}T00:00:00`))}</small></span><strong>${entry.score}/${entry.total}</strong></li>`).join('')}
          </ul>
        </article>` : emptyState('No practice yet', 'Finish a set in this section to see your results here.')}`;
  }

  showSetup();
  showPerformance();
}
