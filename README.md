# 💰 Expense Tracker

A production-quality, minimal expense tracker built with **Next.js** (App Router) + **TypeScript** on the frontend and **Express** + **TypeScript** on the backend. Designed for correctness under real-world conditions — duplicate submissions, retries, network failures, and proper money handling.

---

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/       # HTTP request/response handling
│   │   │   └── expense.controller.ts
│   │   ├── middleware/        # Validation & error handling
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── models/            # Type definitions
│   │   │   └── expense.ts
│   │   ├── repository/        # Data access layer (swappable)
│   │   │   └── expense.repository.ts
│   │   ├── routes/            # Route definitions
│   │   │   └── expense.routes.ts
│   │   ├── services/          # Business logic
│   │   │   └── expense.service.ts
│   │   └── index.ts           # App entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css    # Design system & styles
│   │   │   ├── layout.tsx     # Root layout
│   │   │   └── page.tsx       # Main page
│   │   ├── components/
│   │   │   ├── ExpenseFilters.tsx
│   │   │   ├── ExpenseForm.tsx
│   │   │   ├── ExpenseList.tsx
│   │   │   └── TotalDisplay.tsx
│   │   ├── hooks/
│   │   │   └── useExpenses.ts
│   │   ├── lib/
│   │   │   ├── api.ts         # API client & money utils
│   │   │   └── types.ts       # Shared types & constants
│   │   └── providers/
│   │       └── QueryProvider.tsx
│   ├── next.config.mjs
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## 🏗️ Architecture Overview

### Layered Backend (Clean Architecture)

```
HTTP Request
    ↓
[Routes]        → defines endpoints
    ↓
[Middleware]     → validates input (Zod schemas)
    ↓
[Controllers]   → handles HTTP concerns (headers, status codes)
    ↓
[Services]      → business logic (idempotency, data transformation)
    ↓
[Repository]    → data storage (in-memory, swappable for DB)
```

**Rules:**
- **Controllers** never touch storage directly
- **Services** contain all business logic
- **Repository** interface (`IExpenseRepository`) can be swapped for SQLite/Postgres without touching upper layers

### Frontend (React Query + Hooks)

```
[Page]          → composes components
    ↓
[Components]    → UI rendering (form, list, filters, total)
    ↓
[useExpenses]   → central hook (state, mutations, idempotency)
    ↓
[API Client]    → fetch calls with idempotency headers
```

---

## 💰 Money Handling

**Floating-point is NEVER used for money.**

| Layer | Representation | Example |
|-------|---------------|---------|
| User Input | Dollar string | `"12.50"` |
| API / Storage | Integer cents | `1250` |
| Display | Formatted string | `"$12.50"` |

**Conversion (no floats):**
```typescript
// dollarsToCents("12.50") → 1250
function dollarsToCents(dollars: string): number {
  const parts = dollars.split('.');
  const whole = parseInt(parts[0] || '0', 10);
  const frac = parts[1] ? parts[1].padEnd(2, '0').slice(0, 2) : '00';
  return whole * 100 + parseInt(frac, 10);
}
```

**Total calculation** uses integer arithmetic on the filtered list — no accumulation of float errors.

---

## 🔐 Idempotency Strategy

### The Problem
Users double-click, networks retry, pages refresh — any of these can cause duplicate expense submissions.

### The Solution

1. **Client generates a UUID** (`Idempotency-Key`) when the form loads
2. **Sends it as a header** with every `POST /api/expenses` request
3. **Server checks** if this key was seen before:
   - **First time**: creates the expense, stores `key → expense` mapping, returns `201`
   - **Duplicate**: returns the previously created expense, returns `200` with `idempotent: true`
4. **On success**: client generates a **new** key for the next submission
5. **On failure**: client keeps the **same** key so retries are safe

```
Client                          Server
  │                               │
  ├──POST (key=abc123)──────────→ │ ← First time: create & store
  │←──201 Created────────────────┤
  │                               │
  ├──POST (key=abc123)──────────→ │ ← Duplicate: return cached
  │←──200 OK {idempotent: true}──┤
  │                               │
  ├──POST (key=def456)──────────→ │ ← New key: new expense
  │←──201 Created────────────────┤
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Start the Backend

```bash
cd backend
npm install
npm run dev
```

Server runs at `http://localhost:3001`

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000`

---

## 📡 API Reference

### `POST /api/expenses`

Create a new expense (idempotent).

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | `application/json` |
| `Idempotency-Key` | Yes | UUID for deduplication |

**Body:**
```json
{
  "amount": 1250,
  "category": "Food",
  "description": "Lunch at café",
  "date": "2024-01-15"
}
```

**Response (201 Created):**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 1250,
    "category": "Food",
    "description": "Lunch at café",
    "date": "2024-01-15",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Duplicate Response (200 OK):**
```json
{
  "data": { ... },
  "idempotent": true
}
```

### `GET /api/expenses`

List all expenses with optional filtering.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `category` | string | — | Filter by category |
| `sort` | string | `date_desc` | `date_desc` or `date_asc` |

**Example:**
```
GET /api/expenses?category=Food&sort=date_desc
```

### `GET /api/health`

Health check endpoint.

---

## ⚖️ Trade-offs

| Decision | Trade-off | Rationale |
|----------|-----------|-----------|
| **In-memory store** | No persistence across restarts | Simplicity; repository interface makes DB swap trivial |
| **Idempotency map in memory** | Lost on restart | Sufficient for demo; production would use Redis/DB |
| **No authentication** | Any client can create expenses | Out of scope for MVP |
| **No pagination** | Large lists may be slow | Fine for small datasets; add `limit`/`offset` later |
| **Single-threaded locking** | No true concurrency control | Node.js is single-threaded for JS; sufficient for in-memory |

---

## 🔮 Future Improvements

- **Database**: Replace `InMemoryExpenseRepository` with PostgreSQL/SQLite implementation (same interface)
- **Authentication**: JWT-based auth with user-scoped expenses
- **Pagination**: Cursor-based pagination for large datasets
- **Caching**: Redis for idempotency keys with TTL expiration
- **Delete/Edit**: Full CRUD operations
- **Export**: CSV/PDF export of expense reports
- **Charts**: Spending breakdown visualizations
- **Testing**: Jest unit tests for service layer, Playwright E2E tests

---

## 🧪 Sample cURL Commands

```bash
# Create an expense
curl -X POST http://localhost:3001/api/expenses \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{"amount": 1250, "category": "Food", "description": "Lunch", "date": "2024-01-15"}'

# Retry with same key (safe — returns same response)
curl -X POST http://localhost:3001/api/expenses \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: same-key-here" \
  -d '{"amount": 1250, "category": "Food", "description": "Lunch", "date": "2024-01-15"}'

# List all expenses
curl http://localhost:3001/api/expenses

# Filter by category
curl "http://localhost:3001/api/expenses?category=Food&sort=date_desc"

# Health check
curl http://localhost:3001/api/health
```
