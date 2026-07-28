/**
 * report.controller.js
 * Handles POST /api/analyze-report
 *
 * Flow:
 *   1. Validate uploaded file
 *   2. Extract text (PDF) or delegate to Gemini Vision (image)
 *   3. Send to Gemini for structured analysis
 *   4. Return JSON to frontend
 *   5. Clean up temp file
 */

const fs = require('fs');
const path = require('path');
const { validateFile } = require('../utils/fileValidator');
const { extractText } = require('../services/ocr.service');
const { analyzeReport } = require('../services/gemini.service');

/**
 * POST /api/analyze-report
 */
async function analyzeReportController(req, res) {
  const file = req.file;

  // ── 1. Validate ─────────────────────────────────────────
  const validation = validateFile(file);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const filePath = file.path;

  try {
    // ── 2. Extract text / image reference ────────────────
    console.log(`[Report] Processing: ${file.originalname} (${file.mimetype})`);
    const extractionResult = await extractText(filePath, file.mimetype);

    // ── 3. Analyze with Gemini ───────────────────────────
    console.log('[Report] Sending to Gemini...');
    const analysis = await analyzeReport(extractionResult);
    console.log('[Report] Analysis complete. Disease detected:', analysis.disease);

    // ── 4. Respond ───────────────────────────────────────
    return res.status(200).json(analysis);

  } catch (err) {
    console.error('[Report Controller Error]', err.message);

    // Distinguish Gemini API errors from internal errors
    if (err.message?.includes('API_KEY') || err.message?.includes('API key')) {
      return res.status(500).json({
        error: 'Gemini API key is invalid or missing. Please check your server/.env file.',
      });
    }

    return res.status(500).json({
      error: err.message || 'Failed to analyze the report. Please try again.',
    });

  } finally {
    // ── 5. Always clean up temp file ─────────────────────
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

module.exports = { analyzeReportController };
