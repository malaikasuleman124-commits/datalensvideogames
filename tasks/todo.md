# DataLens Implementation To-Do List

This checklist tracks the progress of the DataLens Video Game Sales implementation.

## Task 1: Basic App Setup & Scaffolding
- [ ] Create `backend/app/main.py`
- [ ] Create `backend/app/routers/health.py`
- [ ] Create `backend/tests/test_health.py`
- [ ] Create `frontend/src/App.tsx`
- [ ] Create `frontend/src/main.tsx`

## Task 2: File Upload & SQLite Data Persistence
- [ ] Create `backend/app/models/dataset.py` (Pydantic schema for Video Game Sales)
- [ ] Create `backend/app/routers/upload.py`
- [ ] Create `backend/app/services/data_manager.py` (SQLite persistence logic)
- [ ] Create `backend/tests/test_upload.py`
- [ ] Create `frontend/src/components/UploadForm.tsx`

## Task 3: Data Profiling API & UI
- [ ] Create `backend/app/services/profiler.py` (Pandas profiling)
- [ ] Create `backend/app/routers/profile.py`
- [ ] Create `backend/tests/test_profiler.py`
- [ ] Create `frontend/src/lib/api.ts` (API client)
- [ ] Create `frontend/src/components/SummaryStats.tsx`

## Task 4: Visualizations & Dashboard Layout
- [ ] Create `frontend/src/components/Dashboard.tsx`
- [ ] Create `frontend/src/components/charts/SalesByGenreChart.tsx`
- [ ] Create `frontend/src/components/charts/TopPlatformsChart.tsx`
- [ ] Create `frontend/src/components/charts/SalesOverTimeChart.tsx`
- [ ] Create `frontend/tests/Dashboard.test.tsx`

## Task 5: Interactive Filtering Logic
- [ ] Create `backend/app/routers/data.py` (Filtered data endpoint)
- [ ] Create `backend/tests/test_data.py`
- [ ] Create `frontend/src/components/Filters.tsx`
- [ ] Create `frontend/src/hooks/useDataset.ts` (State management)
- [ ] Create `frontend/tests/Filters.test.tsx`

## Task 6: LLM Chat Integration
- [ ] Create `backend/app/services/llm.py` (Gemini tools and prompt)
- [ ] Create `backend/app/routers/chat.py`
- [ ] Create `backend/tests/test_chat.py`
- [ ] Create `frontend/src/components/ChatPanel.tsx`
- [ ] Create `frontend/src/components/ChatMessage.tsx`

## Task 7: Executive Summary & Final Polish
- [ ] Create `backend/app/routers/summary.py` (LLM narrative generator)
- [ ] Create `backend/tests/test_summary.py`
- [ ] Create `frontend/src/components/ExecutiveSummary.tsx`
- [ ] Create `frontend/src/pages/MainPage.tsx` (Integration)
- [ ] Create `frontend/tests/MainPage.test.tsx`
