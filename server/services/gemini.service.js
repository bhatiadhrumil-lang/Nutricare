/**
 * gemini.service.js
 * All AI interactions via OpenRouter (OpenAI-compatible API).
 *
 * Model: google/gemma-4-26b-a4b-it:free  (free Google model via OpenRouter)
 *
 * OpenRouter accepts images as base64 in the same format as OpenAI vision.
 * This keeps the interface identical — swap model or provider here, nothing else changes.
 *
 * Exports:
 *   analyzeReport(extractionResult) → parsed JSON object
 *   chatWithAssistant(reportContext, history, userMessage) → reply string
 */

const fs = require('fs');
const { buildAnalysisPrompt, buildChatSystemPrompt } = require('../utils/promptBuilder');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemma-4-26b-a4b-it:free';

// ─── Helpers ──────────────────────────────────────────────

/** Shared headers for every OpenRouter request */
function getHeaders() {
  return {
    'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'http://localhost:5173',
    'X-Title': 'NutriHealth',
  };
}

/**
 * Strips markdown code fences that the model may wrap around JSON.
 */
function stripMarkdownFences(text) {
  return text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

/**
 * Reads an image file and returns an OpenRouter-compatible image content part.
 */
function fileToImagePart(filePath, mimeType) {
  const base64 = fs.readFileSync(filePath).toString('base64');
  return {
    type: 'image_url',
    image_url: {
      url: `data:${mimeType};base64,${base64}`,
    },
  };
}

// ─── Core API call ─────────────────────────────────────────

/**
 * Makes a chat completion request to OpenRouter.
 * @param {Array} messages - Array of { role, content } objects
 * @param {number} maxTokens
 * @param {number} temperature
 * @returns {Promise<string>} The assistant's reply text
 */
async function callOpenRouter(messages, maxTokens = 2048, temperature = 0.2) {
  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    const errMsg = data.error?.message || `OpenRouter error: HTTP ${response.status}`;
    throw new Error(errMsg);
  }

  if (!data.choices || data.choices.length === 0) {
    throw new Error('OpenRouter returned an empty response.');
  }

  return data.choices[0].message.content;
}

// ─── Report Analysis ──────────────────────────────────────

/**
 * Analyzes a blood report and returns structured JSON.
 *
 * @param {string | { isImage: true, filePath: string, mimeType: string }} extractionResult
 * @returns {Promise<object>} Parsed analysis JSON.
 */
async function analyzeReport(extractionResult) {
  let messages;

  if (typeof extractionResult === 'string') {
    // PDF path: plain text prompt
    messages = [
      {
        role: 'user',
        content: buildAnalysisPrompt(extractionResult),
      },
    ];
  } else if (extractionResult.isImage) {
    // Image path: vision (multimodal) prompt
    messages = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: buildAnalysisPrompt('[Extract all blood test values from the attached image of a blood report]'),
          },
          fileToImagePart(extractionResult.filePath, extractionResult.mimeType),
        ],
      },
    ];
  } else {
    throw new Error('Invalid extractionResult passed to analyzeReport.');
  }

  const rawText = await callOpenRouter(messages, 2048, 0.2);
  const cleanedText = stripMarkdownFences(rawText);

  let parsed;
  try {
    parsed = JSON.parse(cleanedText);
  } catch (parseErr) {
    console.error('[AI] Failed to parse JSON. Raw response (first 500 chars):', cleanedText.slice(0, 500));
    throw new Error('AI returned an unexpected format. Please try uploading again.');
  }

  // Ensure disclaimer is always present
  if (!parsed.disclaimer) {
    parsed.disclaimer = 'This is not medical advice. Please consult a qualified healthcare professional.';
  }

  return parsed;
}

// ─── AI Chat Assistant ─────────────────────────────────────

/**
 * Sends a chat message with report context and conversation history.
 *
 * @param {object|null} reportContext
 * @param {Array<{ role: string, text: string }>} history
 * @param {string} userMessage
 * @returns {Promise<string>}
 */
async function chatWithAssistant(reportContext, history, userMessage) {
  const systemPrompt = buildChatSystemPrompt(reportContext);

  const messages = [
    { role: 'system', content: systemPrompt },
    // Replay conversation history
    ...(history || []).map((turn) => ({
      role: turn.role === 'model' ? 'assistant' : 'user',
      content: turn.text,
    })),
    { role: 'user', content: userMessage },
  ];

  return callOpenRouter(messages, 512, 0.6);
}

module.exports = { analyzeReport, chatWithAssistant };
