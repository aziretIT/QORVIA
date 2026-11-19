const icons = {
  logo: '<path d="M16.5 17.5a7 7 0 1 1 2-4.9"/><path d="m13 13 6.4 6.4"/><path d="M17 13h3v3"/>',
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  'arrow-up': '<path d="M7 17 17 7M7 7h10v10"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  back: '<path d="M20 12H5m6 6-6-6 6-6"/>',
  dashboard: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  vocabulary: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v18H6.5A2.5 2.5 0 0 1 4 18.5v-13ZM4 17h16M8 7h8m-8 3h5"/>',
  grammar: '<path d="M5 6h14M12 6v13m-4 0h8M5 6v3m14-3v3"/>',
  ielts: '<path d="M3 14v-2a9 9 0 0 1 18 0v2m-18 0v3a2 2 0 0 0 2 2h2v-7H5a2 2 0 0 0-2 2Zm18 0v3a2 2 0 0 1-2 2h-2v-7h2a2 2 0 0 1 2 2Z"/>',
  sat: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8m-8 5h1m6 0h1m-8 4h1m6 0h1"/>',
  challenge: '<path d="m13 2-9 12h7l-1 8 10-12h-7l1-8Z"/>',
  progress: '<path d="M4 4v16h16m-12-4 4-5 3 2 5-6"/>',
  profile: '<circle cx="12" cy="8" r="3.5"/><path d="M5 21v-1a7 7 0 0 1 14 0v1"/>',
  pricing: '<path d="M12 3 3 8l9 5 9-5-9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  fire: '<path d="M12 22c4.4 0 7-3 7-6.5 0-3-1.6-5.2-3.7-7-.4 2-1.2 3.1-2.2 3.5.1-4-2-6.5-4.7-9-3.5 4.7-4.4 8.2-4.4 12.5C4 19 7.1 22 12 22Z"/><path d="M9 18a3 3 0 0 0 6 0c0-1.4-1.2-2.7-3-4-1.6 1.3-3 2.6-3 4Z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5m-18 4 9 5 9-5"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
  bookmark: '<path d="M6 4h12v16l-6-4-6 4V4Z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  sparkle: '<path d="M12 2 9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2Z"/>',
  refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6 8a7 7 0 0 1 12-2l2 6m-2 4a7 7 0 0 1-12 2l-2-6"/>',
  headphones: '<path d="M3 14v-2a9 9 0 0 1 18 0v2M3 14v4h4v-5H5Zm18 0v4h-4v-5h2Z"/>',
  book: '<path d="M12 6C9 4 6 4 3 5v13c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Zm0 0v13"/>',
  pencil: '<path d="m4 16 12-12 4 4L8 20H4Zm9-9 4 4"/>',
  mic: '<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0m-7 7v3m-4 0h8"/>',
  play: '<path d="m8 5 12 7-12 7V5Z"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="1"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  home: '<path d="m3 10 9-7 9 7v10h-6v-6H9v6H3Z"/>',
};

export function icon(name, size = 20) {
  return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icons[name] ?? icons.info}</svg>`;
}

export function escape(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

export function brand() {
  return `<a class="brand" href="index.html"><span class="brand-mark">${icon('logo', 26)}</span><span>QORVIA</span></a>`;
}

export function pageHeader(title, description = '', action = '') {
  return `<header class="page-head"><div><h1>${escape(title)}</h1>${description ? `<p>${escape(description)}</p>` : ''}</div>${action}</header>`;
}

export function emptyState(title, detail, action = '') {
  return `<div class="empty-state"><span class="feature-icon blue">${icon('layers')}</span><h3>${escape(title)}</h3><p>${escape(detail)}</p>${action}</div>`;
}

export function quiz(container, { questions, onComplete, submitLabel = 'Check answers' }) {
  container.innerHTML = `
    <form class="quiz-form stack">
      ${questions.map((question, index) => `
        <fieldset class="card quiz-question">
          <legend><span class="quiz-number">${index + 1}.</span> ${escape(question.prompt)}</legend>
          <div class="quiz-options">
            ${question.options.map((option, optionIndex) => `
              <label class="quiz-option"><input type="radio" name="answer-${index}" value="${optionIndex}" required>
                <span>${escape(option)}</span>
              </label>`).join('')}
          </div>
          <p class="quiz-feedback" hidden></p>
        </fieldset>`).join('')}
      <div class="quiz-submit">
        <button class="button primary" type="submit">${escape(submitLabel)} ${icon('arrow', 16)}</button>
        <p class="quiz-score" tabindex="-1" hidden></p>
      </div>
    </form>`;

  const form = container.querySelector('form');
  let submitted = false;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (submitted) return;
    const answers = new FormData(form);
    if (questions.some((_, index) => !answers.has(`answer-${index}`))) return;
    submitted = true;
    let score = 0;
    form.querySelectorAll('fieldset').forEach((fieldset, index) => {
      const question = questions[index];
      const selected = Number(answers.get(`answer-${index}`));
      const correct = selected === question.answer;
      if (correct) score += 1;
      const labels = fieldset.querySelectorAll('label');
      labels[question.answer].classList.add('correct');
      if (!correct) labels[selected].classList.add('incorrect');
      const feedback = fieldset.querySelector('.quiz-feedback');
      feedback.textContent = `${correct ? 'Correct.' : `Correct answer: ${question.options[question.answer]}.`} ${question.explanation}`;
      feedback.hidden = false;
      fieldset.disabled = true;
    });
    form.querySelector('[type=submit]').hidden = true;
    const result = form.querySelector('.quiz-score');
    result.textContent = `You scored ${score} out of ${questions.length}.`;
    result.hidden = false;
    result.focus();
    onComplete?.({ score, total: questions.length });
  });
}
