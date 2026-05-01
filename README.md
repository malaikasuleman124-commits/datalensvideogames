<<<<<<< HEAD
# DataLens — [Your Team Name]

> **Starter template:** This README is a template. Replace every section marked `[TODO]` with your actual content as you build. The quality of this README is part of your grade — see the grading rubric in the Final Project Specification.

## Team

- **Member 1:** [Name]
- **Member 2:** [Name]
- **Member 3 (if applicable):** [Name]
- **Assigned Dataset:** [Dataset name and number, e.g., "Dataset 10 — Hotel Booking Demand"]

## Project Purpose

[TODO — 2-3 sentences describing what DataLens does and who it serves. This should be accessible to someone who has not read the Final Project Specification.]

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

This application uses an LLM for the chat interface and executive summary features. You need an API key from at least one of the following providers:

- **Google Gemini (recommended — has a free tier):** Get a key at [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
- **Anthropic Claude:** Get a key at [https://console.anthropic.com/](https://console.anthropic.com/)
- **OpenAI:** Get a key at [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Groq (has a free tier):** Get a key at [https://console.groq.com/keys](https://console.groq.com/keys)

## Setup Instructions

### 1. Clone the repository

```bash
git clone [your-repo-url]
cd [repo-name]
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` in a text editor and fill in:
- `LLM_PROVIDER` — set to one of: `gemini`, `anthropic`, `openai`, `groq`
- The corresponding API key variable for your chosen provider

### 3. Install dependencies and start the application

[TODO — Document the single command that starts both the backend and frontend. Example:

```bash
./start.sh
```

or

```bash
npm run dev
```

The command must install all dependencies (Python via uv, Node via npm) and start both the backend (port 8000) and frontend (port 5173). Document the command here, and include the actual script or configuration in your repo.]

### 4. Open the application

Once started, visit [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

[TODO — Brief usage walkthrough:
1. Click "Upload" and select a CSV file
2. Wait for data profiling to complete
3. Explore the auto-generated dashboard
4. Use the filters to narrow the view
5. Ask questions in the chat panel
6. Read the generated executive summary
]

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

[TODO — Document common issues and their fixes. Add to this section as you encounter problems during development. At minimum, address:

- Port already in use (8000 or 5173)
- Python version mismatch
- Node version mismatch
- LLM API key issues or rate limits
- CSV upload failures
- Missing dependencies

Example format:

**Problem:** `Port 8000 already in use`
**Fix:** Find and stop the conflicting process: `lsof -i :8000` (macOS/Linux) or `netstat -ano | findstr :8000` (Windows)
]

## Project Structure

```
.
├── .agent/skills/          # Agent Skills (6 mandatory skills, auto-loaded by coding agent)
├── docs/
│   ├── adrs/              # Architecture Decision Records
│   └── report.md          # Final project reflection
├── tasks/
│   ├── plan.md            # Implementation plan
│   └── todo.md            # Task breakdown
├── backend/
│   ├── app/               # FastAPI application code
│   └── tests/             # pytest tests
├── frontend/
│   ├── src/               # React application code
│   └── tests/             # Vitest tests
├── SPEC.md                 # Project specification
├── README.md               # This file
├── .env.example           # Environment variable template
└── pyproject.toml         # Python dependencies
```

## Contribution Summary

[TODO — Brief summary of who did what. This is used for grading team member contribution fairness.]

- **[Member 1 Name]:** [Primary responsibilities]
- **[Member 2 Name]:** [Primary responsibilities]

## Acknowledgments

This project was developed as part of the Spring 2026 Strategic Generative AI for Business course. We used [Antigravity / Claude Code / Codex / Cursor] as our coding agent, guided by the Agent Skills framework authored by Addy Osmani (MIT licensed, available at [https://github.com/addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)).

## License

[TODO — Choose a license or remove this section.]
=======
# datalensvideogames
>>>>>>> f87905755347edaaeafe2499e23fafa1f0955d6d
