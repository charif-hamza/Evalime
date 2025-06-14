// src/services/api.js

/**
 * Fetches questions for a given evaluation ID from the backend API.
 * @param {string} evalId - The ID of the evaluation to fetch.
 * @returns {Promise<Array>} A promise that resolves to an array of question objects.
 * @throws {Error} Throws an error if the network response is not ok.
 */
export async function fetchQuestionsByEvalId(evalId) {
  // The URL assumes the Vite dev server is proxying requests to your backend.
  // We will configure this in the `vite.config.js` file later.
  const response = await fetch(`/api/evaluations/${evalId}/questions`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})); // Try to parse error detail
    const errorMessage = errorData.detail || `An error occurred: ${response.statusText} (Status: ${response.status})`;
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Logs in a user using the provided username and password.
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Object>} A promise that resolves to the logged-in user's data.
 * @throws {Error} Throws an error if the network response is not ok.
 */
export async function login(username, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Login failed');
  }
  return response.json();
}

/**
 * Registers a new user with the provided username and password.
 * @param {string} username - The desired username for the new user.
 * @param {string} password - The desired password for the new user.
 * @returns {Promise<Object>} A promise that resolves to the registered user's data.
 * @throws {Error} Throws an error if the network response is not ok.
 */
export async function register(username, password) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Registration failed');
  }
  return response.json();
}

/**
 * Fetches the list of available evaluations.
 * @returns {Promise<Array<{id: number, ouvrage: string, epreuve: string}>>}
 */
export async function fetchEvaluationsList() {
  const response = await fetch('/api/evaluations/list');
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.detail || `Failed to fetch evaluations (${response.status})`;
    throw new Error(errorMessage);
  }

  const data = await response.json();
  // Pass through year and department from backend if present
  return data.map(ev => ({
    id: ev.id,
    ouvrage: ev.ouvrage || 'Unknown',
    epreuve: ev.epreuve || '',
    type_question: ev.type_question || '',
    total_question: ev.total_question || '',
    year: ev.year || '',
    department: ev.department || ''
  }));
}

export async function fetchTopicStats(userId, { nocache = false } = {}) {
  const url = `/api/stats/topic/${userId}${nocache ? '?nocache=1' : ''}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch topic stats');
  }
  return response.json();
}

export async function fetchProgress(userId, { nocache = false } = {}) {
  const url = `/api/stats/progress/${userId}${nocache ? '?nocache=1' : ''}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch progress');
  }
  return response.json();
}

export async function submitAnswers(userId, answers) {
  const response = await fetch('/api/answers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, answers })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to submit answers');
  }
  return response.json();
}