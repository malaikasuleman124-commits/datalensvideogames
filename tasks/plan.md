# Implementation Plan: DataLens (Video Game Sales)

This document breaks down the implementation of the DataLens project into 7 manageable tasks. Each task touches roughly 5 files and includes clear acceptance criteria.

## Task 1: Basic App Setup & Scaffolding
**Goal:** Establish the foundation for both frontend and backend.
- `backend/app/main.py`
- `backend/app/routers/health.py`
- `backend/tests/test_health.py`
- `frontend/src/App.tsx`
- `frontend/src/main.tsx`

**Acceptance Criteria:** Backend serves a healthy `GET /health` endpoint. Frontend renders a basic React App shell. Vitest and pytest suites execute successfully.

---

## Task 2: File Upload & SQLite Data Persistence
**Goal:** Allow users to upload the Video Game Sales CSV and store it.
- `backend/app/models/dataset.py` (Pydantic schemas including `VideoGameSale`)
- `backend/app/routers/upload.py`
- `backend/app/services/data_manager.py` (SQLite persistence)
- `backend/tests/test_upload.py`
- `frontend/src/components/UploadForm.tsx`

**Acceptance Criteria:** User can upload a CSV via UI. Backend validates size (<50MB) and stores the data in SQLite.

---

## Task 3: Data Profiling API & UI
**Goal:** Analyze the uploaded dataset and show high-level metrics.
- `backend/app/services/profiler.py` (Pandas profiling logic)
- `backend/app/routers/profile.py`
- `backend/tests/test_profiler.py`
- `frontend/src/lib/api.ts` (Centralized Axios/Fetch client)
- `frontend/src/components/SummaryStats.tsx`

**Acceptance Criteria:** Backend returns total games, min/max years, and total global sales. Frontend displays these as KPI cards.

---

## Task 4: Visualizations & Dashboard Layout
**Goal:** Render the charts for the Video Game Sales data.
- `frontend/src/components/Dashboard.tsx`
- `frontend/src/components/charts/SalesByGenreChart.tsx`
- `frontend/src/components/charts/TopPlatformsChart.tsx`
- `frontend/src/components/charts/SalesOverTimeChart.tsx`
- `frontend/tests/Dashboard.test.tsx`

**Acceptance Criteria:** The UI displays 3 functional `Recharts` graphs utilizing the dataset endpoint.

---

## Task 5: Interactive Filtering Logic
**Goal:** Make the dashboard interactive by adding genre/platform filters.
- `backend/app/routers/data.py` (Endpoints to query filtered slices)
- `backend/tests/test_data.py`
- `frontend/src/components/Filters.tsx`
- `frontend/src/hooks/useDataset.ts` (State management)
- `frontend/tests/Filters.test.tsx`

**Acceptance Criteria:** User can select a specific Platform/Genre. The frontend fetches filtered data and updates all charts within 500ms.

---

## Task 6: LLM Chat Integration
**Goal:** Implement the Gemini-powered chat interface.
- `backend/app/services/llm.py` (Gemini API integration & tool definitions)
- `backend/app/routers/chat.py`
- `backend/tests/test_chat.py`
- `frontend/src/components/ChatPanel.tsx`
- `frontend/src/components/ChatMessage.tsx`

**Acceptance Criteria:** User can ask "What is the top-selling game?". The backend queries the LLM, which uses a data retrieval tool to return the correct answer.

---

## Task 7: Executive Summary & Final Polish
**Goal:** Auto-generate a narrative summary of the data on upload.
- `backend/app/routers/summary.py` (Triggers LLM summary generation)
- `backend/tests/test_summary.py`
- `frontend/src/components/ExecutiveSummary.tsx`
- `frontend/src/pages/MainPage.tsx` (Integrates Upload, Dashboard, Chat)
- `frontend/tests/MainPage.test.tsx`

**Acceptance Criteria:** An AI-generated summary appears above the dashboard after upload. The main page is fully responsive and stylized with Tailwind/Shadcn.
