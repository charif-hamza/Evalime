export function parseJwt(token) {
  if (!token) return null;
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function getUserIdFromToken(token) {
  const payload = parseJwt(token);
  return payload ? parseInt(payload.sub, 10) : null;
}

export function calculateQuestionScore(question, selectedIds) {
  if (!question || !Array.isArray(question.choices)) return 0;
  const correctIds = question.choices
    .filter(c => c.is_correct !== undefined ? c.is_correct : c.is_correct_solution)
    .map(c => (c.choice_id ?? c.id));
  const selected = Array.isArray(selectedIds) ? selectedIds : [];
  if (selected.some(id => !correctIds.includes(id))) {
    return 0;
  }
  const numCorrect = selected.filter(id => correctIds.includes(id)).length;
  if (numCorrect === correctIds.length && selected.length === numCorrect) {
    return 1;
  }
  return correctIds.length ? numCorrect / correctIds.length : 0;
}
