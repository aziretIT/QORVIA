import { levels, vocabulary } from '../data/vocabulary.js';
import { addActivity, dateKey, getState, recordActivity, updateState } from './store.js';
import { emptyState, escape, icon, pageHeader, quiz } from './ui.js';

const pageSize = 12;
const reviewIntervals = [1, 3, 7, 14, 30, 60];
const modes = [
  ['library', 'Word library'],
  ['flashcards', 'Flashcards'],
  ['quiz', 'Quick quiz'],
  ['review', 'Spaced review'],
];
const quizTypes = {
  translation: {
    label: 'English to Spanish',
    answerKey: 'translation',
    prompt: (word) => `“${word.example}” What does “${word.word}” mean in Spanish here?`,
  },
  recall: {
    label: 'Spanish to English',
    answerKey: 'word',
    prompt: (word) => `Which English word means “${word.translation}”?`,
  },
  sentence: {
    label: 'Complete the sentence',
    answerKey: 'word',
    prompt: (word) => {
      const escapedWord = word.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const sentence = word.example.replace(new RegExp(`\\b${escapedWord}\\b`, 'i'), '___');
      return `Use the English word for “${word.translation}” to complete this sentence. “${sentence}”`;
    },
  },
};

function keyword(value) {
  return value.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').trim();
}

function dueIn(days) {
  const due = new Date();
  due.setDate(due.getDate() + days);
  return dateKey(due);
}

function hasReviewDue(wordState) {
  return wordState.learned && (!wordState.due || wordState.due <= dateKey());
}

function formatDue(due) {
  if (!due || due <= dateKey()) return 'Due today';
  const date = new Date(due + 'T12:00:00');
  if (Number.isNaN(date.getTime())) return 'Review date unavailable';
  return 'Due ' + new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date);
}

function wordActions(word, wordState) {
  const learnedLabel = wordState.learned ? 'Learned' : 'Mark learned';
  const savedLabel = wordState.saved ? 'Saved' : 'Save word';
  return `<div class="study-card-actions">
    <button type="button" class="button ${wordState.learned ? 'ghost' : 'secondary'}"
      data-study="learn" data-id="${word.id}" aria-pressed="${Boolean(wordState.learned)}"
      aria-label="${learnedLabel} for ${escape(word.word)}">
      ${wordState.learned ? icon('check', 16) : ''} ${learnedLabel}
    </button>
    <button type="button" class="button ghost" data-study="save" data-id="${word.id}"
      aria-pressed="${Boolean(wordState.saved)}" aria-label="${savedLabel} for ${escape(word.word)}">
      ${icon('bookmark', 16)} ${savedLabel}
    </button>
  </div>`;
}

function libraryCard(word, wordState) {
  return `<article class="card study-card">
    <div class="study-card-head">
      <h2>${escape(word.word)}</h2>
      <span class="pill">${word.level}</span>
    </div>
    <p><strong lang="es">${escape(word.translation)}</strong> <span class="muted">/${escape(word.ipa)}/</span></p>
    <p class="study-example">${escape(word.example)}</p>
    ${wordActions(word, wordState)}
  </article>`;
}

function shuffled(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const chosen = Math.floor(Math.random() * (index + 1));
    [result[index], result[chosen]] = [result[chosen], result[index]];
  }
  return result;
}

function buildQuestions(words, type) {
  const types = type === 'mixed'
    ? shuffled([...Object.values(quizTypes), ...Object.values(quizTypes)])
    : Array(6).fill(quizTypes[type]);

  return shuffled(words).slice(0, 6).map((word, index) => {
    const { answerKey, prompt } = types[index];
    const correct = word[answerKey];
    const alternatives = vocabulary.filter(other => other.level === word.level && other[answerKey] !== correct)
      .map(other => other[answerKey]);
    const distractors = shuffled([...new Set(alternatives)]).slice(0, 3);
    const options = shuffled([correct, ...distractors]);
    return {
      prompt: prompt(word),
      options,
      answer: options.indexOf(correct),
      explanation: `“${word.word}” means “${word.translation}” in this context. ${word.example}`,
    };
  });
}

export function render(root) {
  const requestedMode = new URLSearchParams(location.search).get('mode');
  const mode = modes.some(([value]) => value === requestedMode) ? requestedMode : 'library';
  const isReview = mode === 'review';
  let level = '';
  let scope = isReview ? 'due' : 'all';
  let search = '';
  let page = 0;
  let cardIndex = 0;
  let revealed = false;

  root.innerHTML = `
    ${pageHeader('Vocabulary', 'Build your English vocabulary with Spanish translations, examples, and regular review.')}
    <nav class="study-tabs" aria-label="Vocabulary study modes">
      ${modes.map(([value, label]) => `<a href="vocabulary.html${value === 'library' ? '' : '?mode=' + value}"
        ${value === mode ? 'aria-current="page"' : ''}>${label}</a>`).join('')}
    </nav>
    <div class="toolbar study-toolbar" data-study-toolbar>
      ${mode === 'library' ? `<label class="field study-search">
        <span>Search words</span>
        <input type="search" placeholder="English or Spanish" data-study-search>
      </label>` : ''}
      <label class="field">
        <span>CEFR level</span>
        <select data-study-level>
          <option value="">All levels</option>
          ${levels.map(value => `<option>${value}</option>`).join('')}
        </select>
      </label>
      ${mode === 'quiz' ? `<label class="field">
        <span>Practice type</span>
        <select data-quiz-type>
          ${Object.entries(quizTypes).map(([value, { label }]) => `<option value="${value}">${label}</option>`).join('')}
          <option value="mixed">Mixed practice</option>
        </select>
      </label>` : `<label class="field">
        <span>${isReview ? 'Review list' : 'Word status'}</span>
        <select data-study-scope>
          ${isReview ? `<option value="due">Due now</option><option value="learned">All learned</option>` : `
            <option value="all">All words</option>
            <option value="saved">Saved words</option>
            <option value="learned">Learned words</option>
            <option value="new">Unlearned words</option>
          `}
        </select>
      </label>`}
    </div>
    <p class="muted study-status" data-study-status role="status"></p>
    <section class="stack" data-study-content aria-label="Vocabulary activity"></section>
  `;

  const toolbar = root.querySelector('[data-study-toolbar]');
  const scopeSelect = root.querySelector('[data-study-scope]');
  const quizTypeSelect = root.querySelector('[data-quiz-type]');
  const status = root.querySelector('[data-study-status]');
  const content = root.querySelector('[data-study-content]');

  function currentWords(state) {
    const term = keyword(search);
    return vocabulary.filter(word => {
      if (level && word.level !== level) return false;
      if (term && !keyword(word.word + ' ' + word.translation).includes(term)) return false;
      const wordState = state.words[word.id] ?? {};
      if (scope === 'saved') return wordState.saved;
      if (scope === 'learned') return wordState.learned;
      if (scope === 'new') return !wordState.learned;
      if (scope === 'due') return hasReviewDue(wordState);
      return true;
    });
  }

  function renderLibrary(words, state) {
    status.textContent = `${words.length} ${words.length === 1 ? 'word' : 'words'}`;
    if (!words.length) {
      content.innerHTML = emptyState('No matching words', 'Try another word or clear your filters.',
        '<button class="button secondary" type="button" data-study="clear">Clear filters</button>');
      return;
    }
    const lastPage = Math.ceil(words.length / pageSize) - 1;
    page = Math.min(page, lastPage);
    content.innerHTML = `
      <div class="grid grid-2 study-grid">
        ${words.slice(page * pageSize, (page + 1) * pageSize)
          .map(word => libraryCard(word, state.words[word.id] ?? {})).join('')}
      </div>
      ${lastPage > 0 ? `<div class="study-pager">
        <button type="button" class="button secondary" data-study="previous" ${page === 0 ? 'disabled' : ''}>Previous page</button>
        <span>Page ${page + 1} of ${lastPage + 1}</span>
        <button type="button" class="button secondary" data-study="next" ${page === lastPage ? 'disabled' : ''}>Next page</button>
      </div>` : ''}
    `;
  }

  function renderDeck(words, state) {
    if (!words.length) {
      status.textContent = '';
      const hasLearnedWords = vocabulary.some(word => state.words[word.id]?.learned);
      if (isReview && scope === 'due') {
        content.innerHTML = emptyState('No reviews due', hasLearnedWords
          ? 'You can still practice any word you have learned.'
          : 'Mark a word learned to add it to your review schedule.', hasLearnedWords
          ? '<button class="button secondary" type="button" data-study="all-learned">View learned words</button>'
          : '<a class="button secondary" href="vocabulary.html">Open the word library</a>');
      } else {
        content.innerHTML = emptyState('No cards in this list', 'Choose another filter or visit the word library.',
          '<a class="button secondary" href="vocabulary.html">Open the word library</a>');
      }
      return;
    }

    cardIndex = Math.min(cardIndex, words.length - 1);
    const word = words[cardIndex];
    const wordState = state.words[word.id] ?? {};
    status.textContent = `Card ${cardIndex + 1} of ${words.length}`;
    content.innerHTML = `
      <article class="card flash-card">
        <div class="study-card-head"><span class="pill">${word.level}</span>
          ${isReview ? `<span class="muted">${formatDue(wordState.due)}</span>` : ''}
        </div>
        <h2>${escape(word.word)}</h2>
        <p class="muted">/${escape(word.ipa)}/</p>
        <div id="flashcard-answer" class="flash-answer" ${revealed ? '' : 'hidden'}>
          <p><strong lang="es">${escape(word.translation)}</strong></p>
          <p class="study-example">${escape(word.example)}</p>
        </div>
        ${revealed ? '' : '<p class="muted">Recall the Spanish translation before revealing the answer.</p>'}
        <button type="button" class="button primary" data-study="reveal"
          aria-controls="flashcard-answer" aria-expanded="${revealed}">${revealed ? 'Hide answer' : 'Reveal answer'}</button>
        ${isReview
          ? `<div class="study-card-actions" ${revealed ? '' : 'hidden'}>
              <button type="button" class="button secondary" data-study="again" data-id="${word.id}">Review tomorrow</button>
              <button type="button" class="button secondary" data-study="good" data-id="${word.id}">I remembered</button>
            </div>`
          : wordActions(word, wordState)}
      </article>
      <div class="study-pager">
        <button type="button" class="button secondary" data-study="previous" ${cardIndex === 0 ? 'disabled' : ''}>Previous card</button>
        <button type="button" class="button secondary" data-study="next" ${cardIndex === words.length - 1 ? 'disabled' : ''}>Next card</button>
      </div>
    `;
  }

  function renderContent() {
    const state = getState();
    const words = currentWords(state);
    if (mode === 'library') {
      renderLibrary(words, state);
    } else if (mode === 'quiz') {
      toolbar.hidden = false;
      status.textContent = '';
      content.innerHTML = `<div class="card study-card">
        <h2>Check what you remember</h2>
        <p>Translate in either direction, complete sentences, or mix all three. Each round has six questions with explanations.</p>
        <div><button type="button" class="button primary" data-study="start">Start quiz</button></div>
      </div>`;
    } else {
      renderDeck(words, state);
    }
  }

  function startQuiz() {
    const type = quizTypeSelect.value;
    const title = quizTypes[type]?.label ?? 'Mixed practice';
    const questions = buildQuestions(currentWords(getState()), type);
    toolbar.hidden = true;
    status.textContent = '';
    content.innerHTML = `<div class="card study-card">
      <h2 tabindex="-1">${title}</h2>
      <p class="muted">${questions.length} questions · ${level || 'All levels'}</p>
    </div>
    <div data-vocabulary-quiz></div>
    <div><button type="button" class="button secondary" data-study="restart">Back to quiz setup</button></div>`;
    const target = content.querySelector('[data-vocabulary-quiz]');
    content.querySelector('h2').focus();
    quiz(target, {
      questions,
      onComplete({ score, total }) {
        recordActivity({ module: 'vocabulary', title: `Vocabulary · ${title}`, score, total, minutes: 3 });
        content.querySelector('[data-study="restart"]').textContent = 'Choose another quiz';
      },
    });
  }

  function setWordStatus(id, action) {
    const updated = updateState(state => {
      const wordState = state.words[id] ??= {};
      if (action === 'save') {
        wordState.saved = !wordState.saved;
      } else {
        wordState.learned = !wordState.learned;
        wordState.interval = wordState.learned ? reviewIntervals[0] : 0;
        wordState.due = wordState.learned ? dueIn(wordState.interval) : '';
        if (wordState.learned) {
          addActivity(state, { module: 'vocabulary', title: `Learned ${id}`, minutes: 1, completed: false, lessonId: id });
        }
      }
    });
    if (mode === 'flashcards' && currentWords(updated)[cardIndex]?.id !== id) {
      revealed = false;
    }
  }

  function recordReview(id, remembered) {
    updateState(state => {
      const wordState = state.words[id];
      if (!wordState?.learned) return;
      if (!remembered || hasReviewDue(wordState)) {
        const interval = wordState.interval || 0;
        const next = reviewIntervals.find(value => value > interval) ?? reviewIntervals.at(-1);
        wordState.interval = remembered ? next : reviewIntervals[0];
        wordState.due = dueIn(wordState.interval);
      }
      addActivity(state, { module: 'vocabulary', title: `Reviewed ${id}`, minutes: 1, completed: false, lessonId: id });
    });
    if (scope === 'learned') cardIndex++;
    revealed = false;
  }

  function resetPosition() {
    page = 0;
    cardIndex = 0;
    revealed = false;
    renderContent();
  }

  root.querySelector('[data-study-search]')?.addEventListener('input', event => {
    search = event.target.value;
    resetPosition();
  });
  root.querySelector('[data-study-level]').addEventListener('change', event => {
    level = event.target.value;
    resetPosition();
  });
  scopeSelect?.addEventListener('change', event => {
    scope = event.target.value;
    resetPosition();
  });

  content.addEventListener('click', event => {
    const button = event.target.closest('button[data-study]');
    if (!button) return;

    const { study: action, id } = button.dataset;
    switch (action) {
      case 'start':
        startQuiz();
        return;
      case 'restart':
        renderContent();
        quizTypeSelect.focus();
        return;
      case 'learn':
      case 'save':
        setWordStatus(id, action);
        break;
      case 'reveal':
        revealed = !revealed;
        break;
      case 'again':
      case 'good':
        recordReview(id, action === 'good');
        break;
      case 'previous':
      case 'next': {
        const step = action === 'previous' ? -1 : 1;
        if (mode === 'library') {
          page += step;
        } else {
          cardIndex += step;
          revealed = false;
        }
        break;
      }
      case 'all-learned':
        scope = 'learned';
        scopeSelect.value = scope;
        break;
      case 'clear':
        level = '';
        search = '';
        scope = 'all';
        toolbar.querySelector('[data-study-search]').value = '';
        toolbar.querySelector('[data-study-level]').value = '';
        scopeSelect.value = scope;
        resetPosition();
        toolbar.querySelector('[data-study-search]').focus();
        return;
    }
    renderContent();
    const next = content.querySelector(`[data-study="${action}"]${id ? `[data-id="${id}"]` : ''}:enabled`);
    if (mode === 'library' && (action === 'previous' || action === 'next')) {
      status.tabIndex = -1;
      status.textContent += ` · Page ${page + 1}`;
      status.focus();
    } else {
      (next ?? content.querySelector('button:enabled, a[href]'))?.focus({ preventScroll: true });
    }
  });

  renderContent();
}
