const guestStorageKey = 'qorvia.learning.v1';
let storageKey = guestStorageKey;

const initialState = () => ({
  profile: { name: '', goal: 15, level: 'A1', subjects: [] },
  words: {},
  activity: [],
  challenge: {},
});

let memory = initialState();
let storageAvailable = true;

export function setLearningAccount(accountId) {
  const nextKey = accountId ? `${guestStorageKey}.account.${accountId}` : guestStorageKey;
  if (nextKey === storageKey) return;
  storageKey = nextKey;
  memory = initialState();
}

function reportStorageError() {
  if (!storageAvailable) return;
  storageAvailable = false;
  window.dispatchEvent(new Event('qorvia:storage-unavailable'));
}

export function canSave() {
  return storageAvailable;
}

export function getState() {
  if (storageAvailable) {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const state = JSON.parse(saved);
        const defaults = initialState();
        memory = {
          profile: { ...defaults.profile, ...state.profile },
          words: state.words ?? defaults.words,
          activity: Array.isArray(state.activity) ? state.activity : defaults.activity,
          challenge: state.challenge ?? defaults.challenge,
          challengeDraft: state.challengeDraft,
        };
      } else {
        memory = initialState();
      }
    } catch {
      reportStorageError();
    }
  }
  return structuredClone(memory);
}

export function updateState(mutate) {
  const state = getState();
  mutate(state);
  memory = state;
  if (storageAvailable) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      reportStorageError();
    }
  }
  return structuredClone(state);
}

export function dateKey(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function addActivity(state, {
  module, title, score, total, minutes = 2, completed = true, lessonId,
}) {
  const now = new Date();
  state.activity.push({
    module, title, score, total, minutes, completed, lessonId,
    date: dateKey(now), timestamp: now.toISOString(),
  });
}

export function recordActivity(details) {
  return updateState((state) => addActivity(state, details));
}

export function streak(state = getState()) {
  const dates = new Set(state.activity.map((item) => item.date));
  const date = new Date();
  if (!dates.has(dateKey(date))) date.setDate(date.getDate() - 1);
  let count = 0;
  while (dates.has(dateKey(date))) {
    count += 1;
    date.setDate(date.getDate() - 1);
  }
  return count;
}
