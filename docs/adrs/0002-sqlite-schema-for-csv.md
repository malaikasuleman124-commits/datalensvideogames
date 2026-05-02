# ADR 2: SQLite Schema Design for Video Game Sales Data

## Status
Accepted

## Context
The application allows users to upload a CSV file containing video game sales and ratings. We need to persist this data to allow for filtering, aggregation, and AI-driven queries without re-processing the CSV on every request.

## Decision
We decided to use **SQLite** with a dedicated relational schema (`GameSaleRecord`) mapped via **SQLAlchemy**.

## Rationale
- **Performance:** Relational databases are optimized for the type of aggregations required by our dashboard (e.g., `SUM(sales) GROUP BY genre`). This is significantly faster than loading the entire dataset into memory with Pandas for every single request as the data grows.
- **Persistence:** Using SQLite ensures that once a user uploads a dataset, it remains available across sessions (until a new upload occurs).
- **Type Safety:** Defining a Pydantic and SQLAlchemy schema ensures that data is validated upon upload, preventing "dirty" data from breaking the visualization logic.
- **SQL Power:** By storing data in a standard relational format, we enable the AI to use SQL-like logic (via our Python tools) to answer complex questions.

## Consequences
- **Initialization:** The database must be initialized on app startup (`init_db`).
- **Storage:** A local `datalens.db` file is created in the backend directory.
