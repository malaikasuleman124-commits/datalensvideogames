# DataLens — Video Game Analytics

DataLens is a comprehensive analytics platform designed to provide interactive visualizations and AI-powered insights for global video game sales data. It serves business analysts and executives in the gaming industry by transforming raw CSV data into actionable intelligence through a modern, responsive dashboard and a natural language chat interface.

## Team

- **Member 1:** [Name]
- **Member 2:** [Name]
- **Assigned Dataset:** Dataset 10 — Video Game Sales with Ratings

## Project Purpose

DataLens empowers users to analyze complex video game market trends without needing technical data skills. By simply uploading a dataset, users can instantly view sales distributions by genre and platform, track performance over time, and interact with an AI assistant to uncover deeper narrative insights about market dynamics.

## Prerequisites

Before running this project, you need the following installed on your machine:

- **Python 3.11 or higher** — [https://www.python.org/downloads/](https://www.python.org/downloads/)
- **Node.js 18 or higher** — [https://nodejs.org/](https://nodejs.org/)
- **uv** (Python package manager) — install with:
  ```bash
  curl -LsSf https://astral.sh/uv/install.sh | sh
  ```
  On Windows: `powershell -c "irm https://astral.sh/uv/install.ps1 | iex"`
- **Git** — [https://git-scm.com/](https://git-scm.com/)

## LLM API Key Setup

This application uses Google Gemini for the chat interface and executive summary features. You need an API key:

- **Google Gemini (recommended):** Get a key at [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/malaikasuleman124-commits/datalensvideogames.git
cd datalensvideogames
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` in a text editor and fill in:
- `LLM_PROVIDER` — set to `gemini`
- `GEMINI_API_KEY` — your Google Gemini API key

### 3. Install dependencies and start the application

You need to run both the backend and frontend simultaneously.

#### Start the Backend:
```bash
# From the root directory
uv run uvicorn backend.app.main:app --reload
```
The backend will be available at [http://localhost:8000](http://localhost:8000).

#### Start the Frontend:
```bash
# In a new terminal, from the frontend directory
cd frontend
npm install
npm run dev
```
The frontend will be available at [http://localhost:5173](http://localhost:5173).

## Usage

1. **Upload Data:** Click the "Analyze Dataset" button or drop a CSV file into the upload area.
2. **View Insights:** Explore the auto-generated charts showing Sales by Genre, Top Platforms, and Sales over Time.
3. **State Persistence:** Your filter selections (Genre/Platform) are automatically saved to your browser's local storage and will be restored when you return.
4. **AI Chat:** Use the floating chat button in the bottom right to ask questions in natural language.
5. **Executive Summary:** Read the AI-generated executive summary at the top of the page.
6. **Premium Experience:** Enjoy a modern, glassmorphism-based UI with dynamic mesh backgrounds and smooth transitions.

## Running Tests

### Backend tests
```bash
cd backend
uv run pytest
```

### Frontend tests
```bash
cd frontend
npm test
```

## Troubleshooting

**Problem:** `border-border` class does not exist / Blank page on load.
**Fix:** This is usually a Tailwind CSS configuration issue. Ensure `tailwind.config.js` includes the standard shadcn/ui color mappings for `border`, `input`, etc. Alternatively, check `index.css` and ensure no invalid `@apply` rules are present.

**Problem:** `404 models/gemini-1.5-flash is not found`.
**Fix:** Update the model name in `backend/app/services/llm.py` to `gemini-1.5-flash-latest` or `gemini-1.5-flash` depending on current API availability.

**Problem:** `Port 8000 already in use`.
**Fix:** Stop any existing FastAPI or uvicorn processes. On Windows, use `netstat -ano | findstr :8000` to find the PID and `taskkill /PID <PID> /F` to stop it.

**Problem:** CSV upload fails with "Internal Server Error".
**Fix:** Ensure the backend is running and the database `datalens.db` is writable. Check backend logs for specific schema mismatch errors.

## Project Structure

```
.
├── backend/               # FastAPI application code
│   ├── app/               # Core logic, models, and routers
│   └── tests/             # Backend test suite
├── frontend/              # React/Vite application code
│   ├── src/               # Components, pages, and hooks
│   └── tests/             # Frontend test suite
├── tasks/                 # Project planning and tracking
├── SPEC.md                # Project specification
├── README.md              # This file
└── .env.example           # Environment variable template
```

## Acknowledgments

This project was developed as part of the Spring 2026 Strategic Generative AI for Business course. Developed using the Antigravity coding agent with the Agent Skills framework.

## License

MIT License
