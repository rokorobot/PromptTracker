# PromptTracker - Quick Start Guide

## ✅ What's Been Set Up

Phase 1 of the PromptTracker project is complete! Here's what has been created:

### Frontend (Next.js + TypeScript)
- ✅ Next.js 15 with App Router
- ✅ TypeScript configuration
- ✅ Tailwind CSS + shadcn/ui setup
- ✅ Clerk authentication integration
- ✅ TanStack Query for data fetching
- ✅ Landing page with gradient design
- ✅ All dependencies installed

**Location**: `c:\Users\Robert Konecny\.gemini\antigravity\playground\prompt-tracker\frontend`

### Backend (NestJS + TypeScript)
- ✅ NestJS framework setup
- ✅ TypeScript configuration
- ✅ Prisma ORM with complete database schema
- ✅ Swagger/OpenAPI documentation
- ✅ CORS and validation configured
- ✅ Health check endpoints
- ✅ All dependencies installed

**Location**: `c:\Users\Robert Konecny\.gemini\antigravity\playground\prompt-tracker\backend`

### Database Schema (Prisma)
- ✅ User model (synced with Clerk)
- ✅ Workspace model (personal/team)
- ✅ WorkspaceMember model (roles: owner/editor/viewer)
- ✅ Collection model (folders for prompts)
- ✅ Prompt model
- ✅ PromptVersion model (versioning system)
- ✅ PromptRun model (usage tracking)
- ✅ Tag and PromptTag models

## 🚀 Next Steps

### 1. Set Up PostgreSQL Database

You need to install PostgreSQL and create a database:

```bash
# After installing PostgreSQL, create the database
createdb prompttracker

# Or using psql:
psql -U postgres
CREATE DATABASE prompttracker;
\q
```

### 2. Configure Environment Variables

**Backend** (`backend/.env`):
```bash
cd backend
copy .env.example .env
```

Edit `backend/.env` and update:
- `DATABASE_URL` with your PostgreSQL connection string
- `CLERK_SECRET_KEY` (get from Clerk dashboard)
- `JWT_SECRET` (generate a random string)

**Frontend** (`frontend/.env.local`):
```bash
cd frontend
copy .env.local.example .env.local
```

Edit `frontend/.env.local` and update:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (get from Clerk dashboard)
- `CLERK_SECRET_KEY` (same as backend)

### 3. Set Up Clerk Authentication

1. Go to https://clerk.com and sign up
2. Create a new application
3. Copy the API keys:
   - Publishable Key → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Secret Key → `CLERK_SECRET_KEY`
4. Enable OAuth providers (optional):
   - Go to "User & Authentication" → "Social Connections"
   - Enable Google, GitHub, etc.

### 4. Initialize the Database

```bash
cd backend

# Generate Prisma client
cmd /c "npx prisma generate"

# Create and run migrations
cmd /c "npx prisma migrate dev --name init"

# (Optional) Open Prisma Studio to view database
cmd /c "npx prisma studio"
```

### 5. Start the Development Servers

**Terminal 1 - Backend**:
```bash
cd backend
cmd /c "npm run start:dev"
```
- Backend runs on: http://localhost:3001
- API docs: http://localhost:3001/api/docs

**Terminal 2 - Frontend**:
```bash
cd frontend
cmd /c "npm run dev"
```
- Frontend runs on: http://localhost:3000

### 6. Verify Everything Works

1. Open http://localhost:3000 - You should see the landing page
2. Open http://localhost:3001/api/health - Should return `{"status":"ok"}`
3. Open http://localhost:3001/api/docs - Should show Swagger UI

## 📋 What's Next in Development

### Phase 2: Database & Core Models ✅ (Schema Complete)
- Database schema is ready
- Next: Run migrations and seed data

### Phase 3: Backend API (Next Priority)
- Implement workspace endpoints
- Implement prompt CRUD endpoints
- Implement versioning system
- Implement run logging
- Add search & filtering

### Phase 4: Frontend UI Components
- Create design system components
- Build dashboard layout
- Implement prompt management UI
- Create version history view
- Build analytics dashboard

## 🛠️ Useful Commands

### Frontend
```bash
cd frontend
cmd /c "npm run dev"          # Start dev server
cmd /c "npm run build"        # Build for production
cmd /c "npm run lint"         # Run linter
```

### Backend
```bash
cd backend
cmd /c "npm run start:dev"    # Start dev server with watch
cmd /c "npm run build"        # Build for production
cmd /c "npm run test"         # Run tests
cmd /c "npx prisma studio"    # Open database GUI
cmd /c "npx prisma migrate dev"  # Create new migration
```

### Adding shadcn/ui Components
```bash
cd frontend
cmd /c "npx shadcn@latest add button"
cmd /c "npx shadcn@latest add dialog"
cmd /c "npx shadcn@latest add card"
# etc.
```

## 📚 Documentation

- [Full Implementation Plan](../../.gemini/antigravity/brain/8c6d0259-c69b-4b7a-a25a-9e3591f545d0/implementation_plan.md)
- [Task Breakdown](../../.gemini/antigravity/brain/8c6d0259-c69b-4b7a-a25a-9e3591f545d0/task.md)
- [Main README](./README.md)

## ⚠️ Important Notes

1. **PowerShell Execution Policy**: Use `cmd /c "command"` to run npm commands
2. **Database**: Make sure PostgreSQL is running before starting the backend
3. **Environment Variables**: Never commit `.env` or `.env.local` files
4. **Clerk Keys**: Keep your Clerk secret key secure

## 🎯 Current Status

**Phase 1: Project Setup** ✅ COMPLETE
- All project files created
- Dependencies installed
- Configuration complete

**Ready for Phase 2**: Database initialization and backend API development

---

Need help? Check the main [README.md](./README.md) or the [implementation plan](../../.gemini/antigravity/brain/8c6d0259-c69b-4b7a-a25a-9e3591f545d0/implementation_plan.md).
