# SPEC: DataLens

---

## 1. Objective

**What is DataLens?** 
DataLens is an automated data exploration and dashboarding web application that instantly turns a CSV upload into interactive visualizations and AI-driven insights. 

**Who is the target user?** 
A gaming industry business analyst or product manager who needs to quickly understand market trends (e.g., which platforms or genres drive the most global sales) without writing SQL or building manual dashboards in tools like Tableau.

**What does success look like?** 
A user can upload the "Video Game Sales with Ratings" CSV (up to 50MB), explore a generated dashboard with at least 4 visualizations (e.g., Sales by Genre, Top Platforms, Sales Trends over Time, Critic vs User Scores), filter the data, and generate an LLM-powered executive summary within 60 seconds of upload completion.

### User Stories

- As a gaming business analyst, I want to upload the Video Game Sales CSV, so that I can immediately see the distribution of global sales across different genres and platforms.
- As a product manager, I want to filter the dashboard by release year and platform, so that I can see the performance of specific game consoles over time.
- As an analyst, I want to ask questions to the AI about the data, so that I can quickly get insights without having to manually calculate them.
- As an executive, I want an automatically generated summary of the dataset, so that I understand the key takeaways of the gaming market at a glance.

### Assumptions

1. The uploaded CSV will closely follow the "Video Game Sales with Ratings" schema (having columns like Name, Platform, Year_of_Release, Genre, Publisher, NA_Sales, EU_Sales, JP_Sales, Other_Sales, Global_Sales, Critic_Score, User_Score).
2. The user will have a modern web browser to interact with the dashboard.
3. The server running the application will have an active internet connection to communicate with the chosen LLM provider API.

---

## 2. Tech Stack

- **Frontend framework:** React with Vite
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Chart library:** Recharts
- **Backend framework:** FastAPI
- **Data validation:** Pydantic
- **Python version:** 3.11+
- **Package manager:** uv
- **Database:** SQLite
- **Data processing:** Pandas
- **LLM provider:** Google Gemini
- **LLM integration pattern:** Tool-use / function calling
- **Testing (backend):** pytest
- **Testing (frontend):** Vitest
- **Coding agent:** Antigravity

---

## 3. Commands

```bash
Setup:     uv sync && cd frontend && npm install
Dev:       ./start.sh
Test:      cd backend && uv run pytest && cd ../frontend && npm run test
Lint:      cd backend && uv run ruff check . && cd ../frontend && npm run lint
```

---

## 4. Project Structure

```
.
├── .agent/skills/          → Agent Skills
├── docs/
│   ├── adrs/              → Architecture Decision Records
│   └── report.md          → Final reflection
├── tasks/
│   ├── plan.md            → Implementation plan
│   └── todo.md            → Task breakdown
├── backend/
│   ├── app/
│   │   ├── main.py        → FastAPI entry point
│   │   ├── routers/       → API route handlers
│   │   ├── models/        → Pydantic models
│   │   ├── services/      → Business logic (LLM integration, data profiling)
│   │   └── db/            → Database setup and SQLite queries for Pandas dataframes
│   └── tests/             → pytest tests
├── frontend/
│   ├── src/
│   │   ├── components/    → React components (UI, Charts)
│   │   ├── pages/         → Page-level components (Dashboard, Upload)
│   │   ├── hooks/         → Custom React hooks
│   │   └── lib/           → Utilities (API client)
│   └── tests/             → Vitest tests
├── SPEC.md
├── README.md
└── pyproject.toml
```

---

## 5. Code Style

**Sample Pydantic Model:**
```python
from pydantic import BaseModel, Field
from typing import Optional

class VideoGameSale(BaseModel):
    name: str
    platform: str
    year_of_release: Optional[int] = Field(None, description="Year the game was released")
    genre: str
    publisher: str
    global_sales: float = Field(..., description="Total worldwide sales in millions")
    critic_score: Optional[float] = None
    user_score: Optional[float] = None
```

**Sample FastAPI Endpoint:**
```python
from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
from app.services.profiler import profile_dataframe

router = APIRouter()

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    
    df = pd.read_csv(file.file)
    profile = profile_dataframe(df)
    return {"filename": file.filename, "profile": profile}
```

**Sample React Component:**
```tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface SalesByGenreProps {
  data: { genre: string; global_sales: number }[];
}

export function SalesByGenreChart({ data }: SalesByGenreProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Sales by Genre</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="genre" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="global_sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Conventions:**
- **Naming:** `snake_case` for Python, `camelCase` for TypeScript/React.
- **Formatting:** `ruff` for Python, `prettier` for Frontend.
- **Type hints:** Required on all Python functions.
- **TypeScript:** Strict mode enabled.
- **Comments:** Docstrings for all services and routers in Python. JSDoc for complex utility functions in Frontend.

---

## 6. Testing Strategy

- **Framework:** `pytest` (backend), `Vitest` (frontend)
- **Test locations:** `backend/tests/`, `frontend/tests/`
- **Coverage expectations:** At least 10 backend tests covering CSV upload, data profiling, and chat tool endpoints. At least 5 frontend tests covering key UI components (e.g., FileUpload, ChatPanel).
- **Test levels:**
  - Unit tests for: Data profiling logic, CSV parsing, DataFrame manipulation.
  - Integration tests for: Full upload → profile → query flow via API endpoints.
- **TDD discipline:** Write tests before the code they test. This is one of the six mandatory skills.

---

## 7. Boundaries

### Always Do

- Run tests locally before committing.
- Use Pydantic for every data boundary (API inputs/outputs).
- Validate uploaded CSV size (must be under 50MB) before processing.
- Ensure all charts gracefully handle missing data (e.g., missing critic scores).
- Commit the `.agent/skills/` folder.

### Ask First

- Adding new Python or Node dependencies.
- Changing the database schema or data persistence strategy.
- Modifying the public API shape.
- Changing the LLM provider from Gemini.
- Adding new environment variables.

### Never Do

- Commit API keys or secrets (like `GEMINI_API_KEY`).
- Commit `.env` files (only `.env.example`).
- Skip tests to ship features faster.
- Remove failing tests without explicit approval.
- Deploy to production (out of scope).
- Edit files in `.agent/skills/` (these come from Addy Osmani's repo).

---

## 8. Success Criteria

- CSV upload accepts files up to 50MB.
- Data profiling completes within 5 seconds for files under 10MB.
- Dashboard renders at least 4 video-game-specific visualizations automatically (e.g., Sales by Genre, Top Platforms, Sales by Year).
- Filters (e.g., by Platform or Genre) update all visualizations within 500ms.
- Chat interface responds to user questions about the video game dataset within 10 seconds.
- Executive summary generates within 30 seconds of upload completion.
- Multi-dataset support: uploading a different CSV replaces the previous dataset cleanly.
- Data persists across page refresh via SQLite.

---

## 9. Out of Scope

Explicitly excluded from the 3-week build:

- User authentication and multi-user accounts.
- Production deployment.
- Mobile responsive design (desktop-first focus).
- Custom machine learning models.
- Real-time collaborative editing.

---

## 10. Open Questions

- **Data Flexibility:** While the assigned dataset is Video Game Sales, should the default dashboard be hardcoded to look for Video Game columns (e.g., `Global_Sales`), or should it dynamically infer columns? *Decision: Proceeding with dynamic inference with specific fallbacks for the Video Game dataset to ensure smooth operations.*
- **Development Command:** Is a single script (like `./start.sh`) acceptable for booting both frontend and backend concurrently, or should users run them in two separate terminal tabs? *Decision: Proposed single `./start.sh` for developer convenience, but two tabs will be documented as the manual fallback.*

---

*Spec version: 1.0*
