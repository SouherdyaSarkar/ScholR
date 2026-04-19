# Scholr — MVP Requirements

**Target:** 100 users · Small team (2–3) · Self-hosted · Free tier stack

---

## Scope

### In
- Semester + subject workspace hierarchy
- File ingestion (PDF, PPTX, DOCX) with processing status
- Syllabus auto-parsing → module scaffolding
- Per-subject chat with RAG (streaming responses)
- Flashcard generation + basic review mode
- On-demand MCQ quizzes with per-question feedback
- Minimal dashboard (last studied, weak topics, pending cards)

### Out (post-MVP)
- Voice chat
- Cross-subject queries
- Full SM-2 spaced repetition
- Collaborative workspaces
- Progress analytics
- Offline mode

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | Next.js 14 + TailwindCSS | App router, deployed on Vercel |
| Auth | Firebase Auth | JWT passed to backend for verification |
| Database | Supabase (PostgreSQL) | User data, metadata, quiz/flashcard records |
| File storage | Supabase Storage | Raw file blobs, presigned URL access |
| Vector DB | Qdrant Cloud | Free tier — 1 cluster, 1GB. One collection per subject |
| LLM | Gemini 1.5 Flash | Free tier — 15 RPM, 1M tokens/day |
| Embeddings | Gemini text-embedding-004 | Free, pairs naturally with Gemini API |
| Backend | FastAPI (Python) | Monolith, deployed on Railway |
| Async workers | Celery + Redis | Background ingestion jobs |
| Containerisation | Docker Compose | Local dev + CI. Managed services used in production |

---

## Architecture

Single FastAPI monolith with internal modules — not microservices.

```
Vercel (Next.js)
      │
      ▼
Railway (FastAPI monolith)
  ├── Auth module       → Firebase token verification
  ├── Workspace module  → Semester / subject CRUD
  ├── Ingestion module  → Parse, chunk, embed, store
  ├── Chat module       → Prompt builder + Gemini streaming
  ├── Flashcard module  → Generation + review logic
  └── Quiz module       → MCQ generation + result storage
      │
      ├── Supabase (Postgres + Storage)
      ├── Qdrant Cloud (vector store)
      └── Redis + Celery (async ingestion queue)
```

Extract to separate service only when a real bottleneck appears (likely ingestion first).

---

## Functional Requirements

### Auth
- Email/password signup and login via Firebase
- JWT verified on every backend request
- No OAuth, no teams, no roles at MVP

### Workspace
- Create, rename, delete semesters
- Create, rename, delete subjects under a semester
- Root-level file uploads scoped to semester shared context
- Subject-level file uploads scoped to that subject only

### File Ingestion
- Accepted formats: PDF, PPTX, DOCX
- Max file size: 20MB
- Pipeline: parse → chunk → embed → store in subject's Qdrant collection
- Status indicator shown to user: queued → processing → done / failed
- Syllabus detection: if flagged or auto-detected, extract module names → show confirmation → commit topic map

### Chat
- One chat panel per subject
- Streaming responses via Gemini 1.5 Flash
- Prompt structure:
  - System: study persona + subject syllabus map + weak topics
  - Retrieved context: top-k chunks from subject's Qdrant collection (framing only)
  - User query
- Session history retained in UI only — not written back to vector DB

### Flashcards
- Auto-generated on ingestion (Celery background job)
- Manual creation within any subject
- Review mode: show front, reveal back, mark correct/incorrect
- Basic interval scheduling: correct → double interval, incorrect → reset to 1 day
- Results stored per card, aggregated per topic

### Quizzes
- On-demand generation scoped to a subject or specific module
- MCQ only (4 options)
- LLM evaluates answer and provides explanation
- Results stored: topic, score, timestamp
- Weak topics (< 60% score) surfaced on dashboard

### Dashboard
- Last studied timestamp per subject
- Weak topics list from quiz history
- Pending flashcard review count
- Recent upload status

---

## Non-Functional Requirements

| Concern | Target | Reasoning |
|---|---|---|
| Concurrent users | 15–20 simultaneous | Safe for Railway free tier |
| First token latency | < 3s | Streaming masks remainder |
| File processing time | < 60s per file | Async, user gets status feedback |
| Vector store scale | ~500 collections, ~50K chunks total | Comfortably within Qdrant free tier |
| Storage | ~100GB worst case | Supabase Storage or upgrade if needed |
| Uptime | Best-effort | No SLA at MVP |

---

## Team Split

| Person | Owns |
|---|---|
| Backend | FastAPI routes, Postgres schema, Celery pipeline, Qdrant integration, prompt builder, Gemini integration |
| Frontend | Next.js pages, workspace UI, streaming chat, file upload, flashcard + quiz views, dashboard |
| (If 3rd) Ingestion | PDF/PPTX parsing quality, chunking strategy, syllabus detection, embedding evaluation |

**Week 1 priority:** agree and document the OpenAPI spec before writing significant code. Mock all endpoints so frontend doesn't block on backend.

---

## Free Tier Limits Reference

| Service | Free allowance | Expected usage at 100 users |
|---|---|---|
| Firebase Auth | 10,000 MAU | ~100 — well within |
| Supabase DB | 500MB storage | ~50MB — fine |
| Supabase Storage | 1GB | ~10GB risk — monitor |
| Qdrant Cloud | 1GB vector storage | ~200MB — fine |
| Gemini 1.5 Flash | 1M tokens/day, 15 RPM | Light usage — fine |
| Vercel | 100GB bandwidth | Fine |
| Railway | $5 free credit/mo | Sufficient for low traffic |

> Supabase Storage is the first likely limit to hit. If users upload heavily, add a per-user file size quota (e.g. 200MB) early.
