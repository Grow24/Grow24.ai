# HBMP Docs Platform - Backend

## Setup

1. Install dependencies:
```bash
npm install
```

2. Generate Prisma client:
```bash
npm run prisma:generate
```

3. Run migrations:
```bash
npm run prisma:migrate
```

4. Seed database (optional):
```bash
npm run prisma:seed
```

5. Start development server:
```bash
npm run dev
```

Server runs on http://localhost:4000

## Database

- SQLite database stored at `prisma/dev.db`
- Use Prisma Studio to view/edit data: `npm run prisma:studio`

## API Endpoints

See `docs/api-spec.md` for full API documentation.

Base URL: http://localhost:4000/api

