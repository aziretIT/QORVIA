import { ieltsPractices, ieltsSections } from '../data/ielts.js';
import { getState, recordActivity } from './store.js';
import { escape, icon, pageHeader, quiz } from './ui.js';

export function render(root) {
  let activeSection = 'listening';
  let stopPractice;
  const drafts = new Map();

  root.innerHTML = `
    ${pageHeader('IELTS Preparation', 'Practice listening, reading, writing, and speaking with original exercises.')}
    <p class="exam-note">QORVIA displays practice results and self-reviews. Official IELTS scores come from the examination.</p>
    <nav class="exam-sections exam-sections-four" aria-label="IELTS skills">
      ${ieltsSections.map(section => `
        <button class="exam-section" type="button" data-skill="${section.id}" aria-pressed="${section.id === activeSection}">
          <span class="exam-section-icon">${icon(section.icon, 21)}</span>
          <span><strong>${section.label}</strong><small>${section.description}</small></span>
        </button>`).join('')}
    </nav>
    <div class="stack exam-main" id="ielts-content"></div>`;

  const content = root.querySelector('#ielts-content');
  const sectionButtons = [...root.querySelectorAll('[data-skill]')];
  sectionButtons.forEach(button => button.addEventListener('click', () => {
    if (activeSection === button.dataset.skill) return;
    stopPractice?.();
    activeSection = button.dataset.skill;
    sectionButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    showSection();
  }));

  function showSection(focus = false) {
    const { label } = ieltsSections.find(section => section.id === activeSection);
    const attempts = getState().activity.filter(entry => entry.module === 'ielts' && entry.lessonId?.startsWith(`${activeSection}:`)).reverse();

    content.innerHTML = `
      <div class="exam-heading">
        <h2 tabindex="-1">${label} practice</h2>
        <span class="pill">${attempts.length} completed</span>
      </div>
      <div class="grid grid-2">
        ${ieltsPractices[activeSection].map(practice => {
          const lastAttempt = attempts.find(entry => entry.lessonId === `${activeSection}:${practice.id}`);
          const detail = practice.questions ? `${practice.questions.length} questions` : activeSection === 'writing' ? `${practice.minutes} min · ${practice.words}+ words` : '1 min preparation · 2 min speaking';
          return `
            <article class="card exam-item">
              <span class="pill">${detail}</span>
              <div><h3>${practice.title}</h3><p class="muted">${practice.context}</p></div>
              ${lastAttempt ? `<p class="exam-last-result">${icon('check', 15)} ${practice.questions ? `Last score ${lastAttempt.score}/${lastAttempt.total}` : 'Self-review completed'}</p>` : ''}
              <button class="button secondary" type="button" data-practice="${practice.id}">Open practice ${icon('arrow', 16)}</button>
            </article>`;
        }).join('')}
      </div>`;

    content.querySelectorAll('[data-practice]').forEach(button => button.addEventListener('click', () => {
      const practice = ieltsPractices[activeSection].find(item => item.id === button.dataset.practice);
      openPractice(practice);
    }));
    if (focus) content.querySelector('h2').focus();
  }

  function openPractice(practice) {
    stopPractice?.();
    stopPractice = undefined;
    const section = activeSection;
    const lessonId = `${section}:${practice.id}`;
    const startedAt = Date.now();

    const save = ({ score, total }) => recordActivity({
      module: 'ielts',
      lessonId,
      title: practice.title,
      score,
      total,
      minutes: Math.max(1, Math.round((Date.now() - startedAt) / 60000)),
    });

    content.innerHTML = `
      <button class="button ghost exam-back" type="button" data-back>Back to ${section} practice</button>
      <article class="card stack exam-practice">
        <div><h2 tabindex="-1">${practice.title}</h2><p class="muted">${practice.context}</p></div>
        <div class="stack" data-practice-body></div>
      </article>`;

    const body = content.querySelector('[data-practice-body]');
    if (section === 'listening') stopPractice = listening(body, practice, save);
    if (section === 'reading') reading(body, practice, save);
    if (section === 'writing') writing(body, practice, save, drafts);
    if (section === 'speaking') stopPractice = speaking(body, practice, save);
    content.querySelector('[data-back]').addEventListener('click', () => {
      stopPractice?.();
      showSection(true);
    });
    content.querySelector('h2').focus();
  }

  window.addEventListener('pagehide', () => stopPractice?.());
  showSection();
}

function listening(root, practice, save) {
  const supportsAudio = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  root.innerHTML = `
    <div class="exam-passage stack">
      <h3>Listen to the announcement</h3>
      <p>Read the questions first, then listen for the details. You can replay the audio as needed.</p>
      ${supportsAudio ? `
        <div class="toolbar">
          <button class="button secondary" type="button" data-play>${icon('play', 16)} Play audio</button>
          <button class="button ghost" type="button" data-stop disabled>Stop</button>
        </div>
        <p class="muted exam-audio-status" data-audio-status role="status"></p>` : '<p class="muted">Audio playback is unavailable in this browser. Read the transcript to continue.</p>'}
      <details>
        <summary>Read the transcript</summary>
        <p>${practice.transcript}</p>
      </details>
    </div>
    <div data-quiz></div>`;

  quiz(root.querySelector('[data-quiz]'), { questions: practice.questions, onComplete: save });
  if (!supportsAudio) return undefined;

  const play = root.querySelector('[data-play]');
  const stop = root.querySelector('[data-stop]');
  const status = root.querySelector('[data-audio-status]');
  let utterance;

  function end(message) {
    utterance = undefined;
    play.disabled = false;
    stop.disabled = true;
    status.textContent = message;
  }

  function cancel(message = '') {
    if (!utterance) return;
    end(message);
    window.speechSynthesis.cancel();
  }

  play.addEventListener('click', () => {
    const clip = new SpeechSynthesisUtterance(practice.transcript);
    clip.lang = 'en-GB';
    clip.rate = 0.88;
    clip.onend = () => {
      if (clip === utterance) end('Audio finished. You can play it again.');
    };
    clip.onerror = () => {
      if (clip === utterance) end('Audio could not play. Read the transcript to continue.');
    };
    utterance = clip;
    play.disabled = true;
    stop.disabled = false;
    status.textContent = 'Playing audio.';
    try {
      window.speechSynthesis.speak(clip);
    } catch {
      end('Audio could not play. Read the transcript to continue.');
    }
  });
  stop.addEventListener('click', () => cancel('Audio stopped.'));
  return cancel;
}

function reading(root, practice, save) {
  root.innerHTML = `
    <div class="exam-passage">
      <h3>Reading passage</h3>
      ${practice.passage.map(paragraph => `<p>${paragraph}</p>`).join('')}
    </div>
    <div data-quiz></div>`;
  quiz(root.querySelector('[data-quiz]'), { questions: practice.questions, onComplete: save });
}

function writing(root, practice, save, drafts) {
  root.innerHTML = `
    <div class="exam-passage">
      <div class="toolbar"><span class="pill">${icon('clock', 15)} ${practice.minutes} min suggested</span><span class="pill">${practice.words}+ words</span></div>
      <h3>Writing prompt</h3>
      <p>${practice.prompt}</p>
      ${practice.table ? dataTable(practice.table) : ''}
    </div>
    <form class="stack" data-review-form>
      <label class="field">Your response
        <textarea id="essay-response" rows="8" maxlength="18000" aria-describedby="essay-count" required placeholder="Write your response here…">${escape(drafts.get(practice.id) ?? '')}</textarea>
      </label>
      <p id="essay-count" class="muted exam-word-count"></p>
      ${reviewFields(practice)}
    </form>`;
  const field = root.querySelector('#essay-response');
  const count = root.querySelector('#essay-count');

  function updateCount() {
    const words = field.value.trim().match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
    field.setCustomValidity(words > 0 || !field.value ? '' : 'Write at least one word before saving a self-review.');
    count.textContent = `${words} ${words === 1 ? 'word' : 'words'} · suggested minimum ${practice.words}`;
    drafts.set(practice.id, field.value);
  }

  field.addEventListener('input', updateCount);
  updateCount();
  bindReview(root, save, practice.review.length);
}

function dataTable({ columns, rows }) {
  return `
    <table class="exam-table">
      <caption>Share of students by main travel method</caption>
      <thead><tr>${columns.map(column => `<th scope="col">${column}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(([method, ...values]) => `<tr><th scope="row">${method}</th>${values.map(value => `<td>${value}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>`;
}

function speaking(root, practice, save) {
  root.innerHTML = `
    <div class="exam-passage">
      <h3>Speaking cue card</h3>
      <p>${practice.prompt}</p>
      <ul>${practice.cues.map(cue => `<li>${cue}</li>`).join('')}</ul>
    </div>
    <div class="exam-timer">
      <div>
        <h3 data-phase>Preparation</h3>
        <p class="muted">Take one minute to plan, then speak for up to two minutes.</p>
      </div>
      <span class="exam-clock" data-clock role="timer" aria-label="Time remaining">1:00</span>
      <div class="toolbar">
        <button class="button secondary" type="button" data-timer>Start timer</button>
        <button class="button ghost" type="button" data-reset disabled>Reset</button>
      </div>
      <span class="exam-sr" role="status" data-timer-status></span>
    </div>
    <div class="exam-passage">
      <h3>Follow-up questions</h3>
      <ul>${practice.followUps.map(question => `<li>${question}</li>`).join('')}</ul>
    </div>
    <form class="stack" data-review-form>
      ${reviewFields(practice, '<label class="exam-review-row"><input type="checkbox" required> I completed a spoken response.</label>')}
    </form>`;

  bindReview(root, save, practice.review.length);
  return bindTimer(root);
}

function reviewFields(practice, confirmation = '') {
  return `
    <fieldset class="exam-review">
      <legend>Self-review</legend>
      <p class="muted">Check the criteria you met after completing your response.</p>
      ${practice.review.map(({ criterion, question }) => `
        <label class="exam-review-row"><input type="checkbox" name="criteria"><span><strong>${criterion}</strong> ${question}</span></label>`).join('')}
    </fieldset>
    <details class="exam-review-tip">
      <summary>Review guidance</summary>
      <p>${practice.guidance}</p>
    </details>
    ${confirmation}
    <div class="toolbar">
      <button class="button primary" type="submit">Save self-review</button>
      <p class="exam-review-result" role="status" data-review-result></p>
    </div>`;
}

function bindReview(root, save, total) {
  const form = root.querySelector('[data-review-form]');
  let submitted = false;
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (submitted) return;
    const score = form.querySelectorAll('[name="criteria"]:checked').length;
    save({ score, total });
    submitted = true;
    form.querySelector('[data-review-result]').textContent = `Self-review saved · ${score} of ${total} criteria marked.`;
    form.querySelectorAll('input[type="checkbox"]').forEach(input => { input.disabled = true; });
    form.querySelector('button[type="submit"]').disabled = true;
  });
}

function bindTimer(root) {
  const toggle = root.querySelector('[data-timer]');
  const reset = root.querySelector('[data-reset]');
  const clock = root.querySelector('[data-clock]');
  const phase = root.querySelector('[data-phase]');
  const status = root.querySelector('[data-timer-status]');
  let remaining = 60000;
  let deadline;
  let interval;
  let stage = 0;

  function showTime() {
    const seconds = Math.ceil(remaining / 1000);
    clock.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  }

  function stop() {
    clearInterval(interval);
    interval = undefined;
  }

  function tick() {
    const now = Date.now();
    if (stage === 0 && now >= deadline) {
      stage = 1;
      deadline += 120000;
      phase.textContent = 'Speaking';
      status.textContent = 'Preparation finished. Start speaking.';
    }
    remaining = Math.max(0, deadline - now);
    showTime();
    if (remaining > 0) return;
    stop();
    stage = 2;
    phase.textContent = 'Time complete';
    status.textContent = 'Speaking time finished. Complete your self-review.';
    toggle.textContent = 'Start again';
  }

  function restart() {
    stop();
    stage = 0;
    remaining = 60000;
    phase.textContent = 'Preparation';
    toggle.textContent = 'Start timer';
    reset.disabled = true;
    status.textContent = 'Timer ready.';
    showTime();
  }

  function pause() {
    if (interval === undefined) return;
    tick();
    if (stage === 2) return;
    stop();
    toggle.textContent = 'Resume timer';
    status.textContent = 'Timer paused.';
  }

  toggle.addEventListener('click', () => {
    if (interval !== undefined) return pause();
    if (stage === 2) restart();
    deadline = Date.now() + remaining;
    interval = setInterval(tick, 150);
    toggle.textContent = 'Pause timer';
    reset.disabled = false;
    status.textContent = stage === 0 ? 'Preparation timer running.' : 'Speaking timer running.';
  });
  reset.addEventListener('click', restart);
  return pause;
}
