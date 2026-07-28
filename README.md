# 🥗 NutriHealth (NutriCare) — AI-Powered Blood Report & Health Engine

> **Empowering personal wellness through AI-driven biomarker analysis, tailored nutrition, and actionable lifestyle recommendations.**

NutriHealth (future name: **NutriCare**) is a full-stack web application designed to simplify medical lab reports. Users can upload blood reports (PDF or image format), receive instant plain-language explanations of their health parameters, detect disease risk indicators (focusing on **Diabetes**), and get personalized diet and lifestyle suggestions. It also includes an interactive AI Assistant for follow-up medical and nutritional guidance based directly on the uploaded report.

---

## ✨ Features

- 📄 **Multi-Format Report Upload**: Supports both PDF documents and direct image uploads (PNG, JPG, WebP) up to 15 MB.
- 🔬 **Biomarker Extraction & Explanation**: Automatically scans blood values (e.g., HbA1c, Fasting Glucose, LDL, Hemoglobin) and explains what they mean in simple, patient-friendly terms.
- 🩺 **Disease Indicator Detection**: Specifically flags Diabetes indicators (pre-diabetic or diabetic ranges) with confidence metrics.
- 🥗 **Personalized Diet Plan**: Recommends key nutrients required, foods to eat, and foods to avoid based on identified abnormalities.
- 🏃 **Lifestyle & Wellness Guidance**: Provides actionable habits for sleep, exercise, hydration, and stress management.
- 💬 **NutriHealth AI Assistant**: Interactive chat interface powered by LLM memory that answers follow-up questions tailored specifically to the patient's report context.
- 🔒 **Secure Architecture**: All AI processing happens server-side via Node.js/Express. API keys are strictly kept on the backend and never exposed to the client.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS (v4)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router (v7)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **File Upload**: Multer (v2)
- **PDF Parser**: `pdf-parse`

### AI & LLM Engine
- **Provider**: OpenRouter / Google Gemini (`google/gemma-4-26b-a4b-it:free` / `gemini-1.5-flash`)
- **Multimodal Support**: Native vision & text prompt engineering for structured JSON output.

---

## 📂 Project Architecture

```
NutriHealth(prototype)/
├── README.md                      ← Project documentation
├── .gitignore                     ← Root git rules (protects .env & secrets)
│
├── server/                        ← Express.js Backend
│   ├── .env.example               ← Template for environment variables
│   ├── index.js                   ← Entry point & middleware setup
│   ├── routes/
│   │   ├── report.routes.js       ← POST /api/analyze-report
│   │   └── chat.routes.js         ← POST /api/chat
│   ├── controllers/
│   │   ├── report.controller.js   ← Report parsing & analysis coordinator
│   │   └── chat.controller.js     ← Assistant chat logic
│   ├── services/
│   │   ├── gemini.service.js      ← AI Model integration (OpenRouter/Gemini API)
│   │   └── ocr.service.js         ← Text extraction pipeline
│   └── utils/
│       ├── fileValidator.js       ← Upload size & MIME-type validation
│       └── promptBuilder.js       ← Disease-specific prompt templates
│
└── NutriHealth-main/              ← React + Vite Frontend
    ├── vite.config.js             ← Vite dev proxy configuration (/api → :5000)
    └── src/
        ├── api/
        │   └── apiClient.js       ← Backend API service layer
        ├── context/
        │   └── ReportContext.jsx  ← Global report & assistant state
        ├── App.jsx                ← Routes & layout wrapper
        ├── Dashboard.jsx          ← Upload page
        ├── Processing.jsx         ← Real-time processing indicator
        ├── Results.jsx            ← Health summary & recommendations dashboard
        ├── Assistant.jsx          ← AI Assistant chat interface
        └── ...
```

---

## 🚀 Quickstart Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm` or `yarn`
- An API Key from **[OpenRouter](https://openrouter.ai/)** or **[Google AI Studio](https://aistudio.google.com/)**

---

### 1. Clone the Repository
```bash
git clone https://github.com/JAYSHIL00/nutrihealth3.git
cd nutrihealth3
```

---

### 2. Backend Setup (`server`)

1. Navigate to the server folder:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file from the template:
   ```bash
   cp .env.example .env
   ```

4. Add your API key to `server/.env`:
   ```env
   GEMINI_API_KEY=sk-or-v1-your-openrouter-or-gemini-key
   PORT=5000
   NODE_ENV=development
   ```

5. Start the backend server:
   ```bash
   node index.js
   ```
   *The server will run at `http://localhost:5000`.*

---

### 3. Frontend Setup (`NutriHealth-main`)

1. Open a new terminal tab and navigate to the frontend folder:
   ```bash
   cd NutriHealth-main
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run at `http://localhost:5173`.*

---

## 🔌 API Endpoints

### 1. `POST /api/analyze-report`
- **Description**: Uploads a medical blood report for AI extraction and analysis.
- **Content-Type**: `multipart/form-data`
- **Body**: `report` (File: PDF, PNG, JPG, or WebP up to 15 MB)
- **Response**:
```json
{
  "disease": "Diabetes",
  "confidence": "High",
  "summary": "Blood sugar levels and long-term averages show elevation...",
  "bloodParameters": [
    {
      "name": "HbA1c",
      "value": "7.8%",
      "normalRange": "4.0 - 5.6%",
      "status": "high",
      "explanation": "Indicates elevated average blood sugar over the last 3 months."
    }
  ],
  "nutrients": ["Chromium", "Magnesium", "Fiber"],
  "foodsToEat": ["Oats", "Spinach", "Almonds"],
  "foodsToAvoid": ["Refined sugar", "White bread", "Sweetened beverages"],
  "lifestyle": ["30 minutes of aerobic exercise daily", "Maintain regular sleep schedule"],
  "disclaimer": "This is not medical advice. Please consult a qualified healthcare professional."
}
```

### 2. `POST /api/chat`
- **Description**: Sends user queries to the assistant with full report context awareness.
- **Content-Type**: `application/json`
- **Body**:
```json
{
  "message": "Why is my HbA1c level high?",
  "reportContext": { ... },
  "history": [
    { "role": "user", "text": "Hello" },
    { "role": "model", "text": "Hi! How can I help you with your report today?" }
  ]
}
```
- **Response**:
```json
{
  "reply": "Your HbA1c is 7.8%, which is above the standard reference range..."
}
```

### 3. `GET /api/health`
- **Description**: Health-check endpoint for server status monitoring.
- **Response**: `{ "status": "ok", "message": "NutriHealth server is running" }`

---

## 🧬 Extending the System (Adding New Diseases)

NutriHealth is architected to be modular so additional conditions can be integrated with minimal changes:

1. Open `server/utils/promptBuilder.js`.
2. Add condition-specific rules or context instructions inside `buildAnalysisPrompt()`.
3. Update `buildChatSystemPrompt()` if specialized dietary guardrails are required for the new condition (e.g., Anemia, Hypertension, High Cholesterol, Thyroid, Vitamin D Deficiency).

---

## ⚠️ Disclaimer

NutriHealth provides informational analysis generated by artificial intelligence. **It is not a substitute for professional medical advice, diagnosis, or treatment.** Always seek the guidance of a qualified physician or healthcare provider regarding any medical condition.

---

## 📜 License

This project is licensed under the MIT License.
