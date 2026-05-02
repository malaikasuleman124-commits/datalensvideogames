# ADR 1: Choice of Gemini as LLM Provider

## Status
Accepted

## Context
The DataLens project requires a Large Language Model (LLM) to perform two primary functions:
1. Generate natural language summaries of large datasets (Video Game Sales).
2. Interface with the data using natural language queries (Chat).

We needed a provider that offers high performance, low latency, and robust support for function calling (tool use) while remaining cost-effective during development.

## Decision
We chose **Google Gemini 1.5 Flash** as the primary LLM provider.

## Rationale
- **Native Function Calling:** Gemini provides first-class support for tool-use, allowing the model to generate structured calls to our Python data tools.
- **Speed and Efficiency:** The 1.5 Flash model is optimized for low latency, which is critical for a responsive chat experience.
- **Context Window:** The large context window allows for future expansion where we might pass more metadata or larger dataset snippets directly to the model.
- **Ease of Integration:** The `google-generativeai` SDK is well-documented and integrates seamlessly with our FastAPI backend.

## Consequences
- **Dependency:** The project now depends on a valid `GEMINI_API_KEY`.
- **Package:** The `google-generativeai` package is added to the backend dependencies.
