/**
 * apiClient.js
 * Central API helper for all backend calls.
 * The Vite proxy (vite.config.js) forwards /api/* → http://localhost:5000
 * so the API key never touches the browser.
 */

const API_BASE = '/api';

/**
 * Uploads a blood report file and returns the AI analysis JSON.
 * @param {File} file - The file object from <input type="file">
 * @returns {Promise<object>} Parsed analysis result
 */
export async function analyzeReport(file) {
  const formData = new FormData();
  formData.append('report', file);

  const response = await fetch(`${API_BASE}/analyze-report`, {
    method: 'POST',
    body: formData,
    // Do NOT set Content-Type — browser sets it automatically with boundary
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Server error: ${response.status}`);
  }

  return data;
}

/**
 * Sends a chat message to the AI assistant.
 * @param {string} message - The user's message
 * @param {object|null} reportContext - The analyzed report (or null)
 * @param {Array<{role: string, text: string}>} history - Prior turns
 * @returns {Promise<string>} The assistant's reply
 */
export async function sendChatMessage(message, reportContext = null, history = []) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, reportContext, history }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Server error: ${response.status}`);
  }

  return data.reply;
}
