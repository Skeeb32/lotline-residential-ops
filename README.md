# Lotline

Lotline is a portfolio operations demo for a fictional residential investment team. It brings property status, capital funding, occupancy, operations work, and an upcoming distribution into one operating view.

**All names, properties, balances, dates, and performance figures are fictional demo data.** This project is not affiliated with any AI real estate investment company and does not process investments or payments.

## What it demonstrates

- A responsive Next.js and TypeScript operations dashboard with searchable and filterable property records.
- A NestJS REST API with validated asset creation, filtering, MongoDB persistence, and starter records.
- Docker Compose orchestration for the web app, API, and MongoDB.
- GitHub Actions workflow for TypeScript checks and production builds.
- Practical workflow details: task ownership and priority, investor distribution review, funding progress, and property launch status.

## Run locally

Requirements: Node.js 20+, pnpm 9+, and Docker Desktop.

```sh
cp .env.example .env
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000) for the dashboard and [http://localhost:4000/api/assets](http://localhost:4000/api/assets) for the API. MongoDB data is stored in the `lotline-data` Docker volume.

For a local development loop, start MongoDB with `docker compose up mongo`, then run `pnpm install` and `pnpm dev`. The dashboard can also be explored without the API; it starts with its fictional sample dataset and falls back to that data if the API is unavailable.

## API

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/assets` | List property records; accepts `?status=Operating`, `Launching`, or `Review` |
| `GET` | `/api/assets/:id` | Fetch a property record |
| `POST` | `/api/assets` | Create a property record |

Example request:

```json
{
  "name": "Cedar Row",
  "location": "Austin, TX",
  "units": 12,
  "fundedPercent": 0,
  "occupancyPercent": 0,
  "status": "Review"
}
```

## Product and architecture notes

- The web app uses a local demo task queue and distribution card so the dashboard stays useful without external services. Asset records load from the API when it is available; the add-property flow also submits new records to the API.
- The sample distribution is a review state only. There is no payment rail, tax calculation, investor authentication, or production financial logic.
- The API seeds four fictional assets when the database is empty. Requests are validated at the application boundary, and MongoDB enforces a unique property name.
- This is a portfolio project, not a production investment platform. Authentication, authorization, audit history, observability, and financial controls would be required before handling real data or money.

## Project layout

```text
apps/
  api/     NestJS service and MongoDB asset model
  web/     Next.js portfolio console
docker-compose.yml
```
