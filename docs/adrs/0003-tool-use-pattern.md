# ADR 3: Tool-Use Pattern for LLM Integration

## Status
Accepted

## Context
When a user asks a question like "What is the top-selling game?", the LLM needs to access the data in our SQLite database. Giving the LLM the entire dataset is not feasible due to token limits and costs. Asking the LLM to write raw SQL is risky and prone to syntax errors or security vulnerabilities.

## Decision
We implemented a **Function Calling (Tool-Use) pattern**. We defined specific Python functions (`get_top_selling_games`, `get_genre_distribution`, etc.) and exposed them as tools to the Gemini model.

## Rationale
- **Accuracy:** The AI doesn't have to "guess" the numbers or generate SQL. It calls a deterministic Python function that executes a known-good SQL query.
- **Security:** The AI only has access to the functions we explicitly provide. It cannot execute arbitrary code or delete data.
- **Explainability:** By using tools, the AI can explain *how* it got the answer (e.g., "I checked the top games and found...") because it knows which tool it called and what the result was.
- **Reliability:** This pattern reduces hallucinations. If a user asks about a genre that doesn't exist, the tool returns an empty list, and the AI correctly reports that no data was found.

## Consequences
- **Service Layer:** We must maintain a set of Python functions in `llm.py` that act as the interface between the LLM and the Database.
- **Logic Sync:** Any new dashboard metric that we want the AI to understand requires a corresponding tool definition.
