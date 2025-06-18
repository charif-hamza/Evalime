/**
 * Sends question-level performance data to the backend and returns dashboard insights.
 *
 * @param {Array<{question_id:number, topic?:string, is_correct:boolean}>} performanceList
 * @returns {Promise<Object>} Dashboard insights from the backend.
 */
export async function fetchDashboardInsights(performanceList) {
  const response = await fetch('/api/dashboard/insights', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(performanceList)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.detail || `Failed to fetch dashboard insights (${response.status})`;
    throw new Error(message);
  }

  return response.json();
} 