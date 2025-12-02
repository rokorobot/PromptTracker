# PromptTracker

A comprehensive web application for saving, organizing, versioning, and analyzing LLM prompts with team collaboration features.

## 🎯 Features

### MVP Features (v1)
- **Prompt Library**: Create, edit, delete, and organize prompts with rich metadata
- **Versioning**: Track multiple versions of prompts with performance comparison
- **Usage Logging**: Manually log prompt runs with ratings and notes
- **Search & Filters**: Full-text search with filtering by tags, categories, and models
- **Collections**: Organize prompts into projects, clients, or workflows
- **Analytics**: Track prompt performance, usage statistics, and trends
- **Team Collaboration**: Share prompts with team members with role-based access

### Future Enhancements
- Browser extension for quick-save from ChatGPT/Claude
- Direct LLM API integration with auto-logging
- A/B testing for prompt variants
- Public templates marketplace
- AI-assisted prompt improvement

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Authentication**: Clerk
- **Forms**: React Hook Form + Zod validation
- **Markdown**: react-markdown
- **Charts**: Recharts

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **API Documentation**: Swagger/OpenAPI
- **Authentication**: Clerk + JWT

## 📁 Project Structure

```
prompt-tracker/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App router pages
│   │   ├── (auth)/         # Authentication pages
│   │   ├── (dashboard)/    # Main application pages
│   │   └── layout.tsx      # Root layout
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── prompts/       # Prompt-related components
│   │   ├── collections/   # Collection components
│   │   └── analytics/     # Analytics components
│   ├── lib/               # Utilities and API client
│   └── types/             # TypeScript types
│
├── backend/                # NestJS backend application
│   ├── src/
│   │   ├── prisma/        # Prisma service
│   │   ├── modules/       # Feature modules (to be added)
│   │   ├── app.module.ts  # Root module
│   │   └── main.ts        # Entry point
│   └── prisma/
│       └── schema.prisma  # Database schema
│
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Clerk account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   cd c:\Users\Robert Konecny\.gemini\antigravity\playground\prompt-tracker
   ```

2. **Set up the backend**
   ```bash
   cd backend
   cmd /c "npm install"
   
   # Copy environment file and configure
   copy .env.example .env
   # Edit .env with your database credentials and Clerk keys
   
   # Generate Prisma client
   cmd /c "npx prisma generate"
   
   # Run database migrations
   cmd /c "npx prisma migrate dev --name init"
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   cmd /c "npm install"
   
   # Copy environment file and configure
   copy .env.local.example .env.local
   # Edit .env.local with your Clerk keys
   ```

### Running the Application

1. **Start the backend** (in `backend/` directory):
   ```bash
   cmd /c "npm run start:dev"
   ```
   Backend will run on http://localhost:3001
   API docs available at http://localhost:3001/api/docs

2. **Start the frontend** (in `frontend/` directory):
   ```bash
   cmd /c "npm run dev"
   ```
   Frontend will run on http://localhost:3000

### Setting up Clerk Authentication

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Copy the publishable key and secret key
4. Add them to:
   - `frontend/.env.local` as `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
   - `backend/.env` as `CLERK_SECRET_KEY`
5. Configure OAuth providers (Google, GitHub) in Clerk dashboard if needed

### Database Setup

1. **Install PostgreSQL** if not already installed
2. **Create a database**:
   ```sql
   CREATE DATABASE prompttracker;
   ```
3. **Update DATABASE_URL** in `backend/.env`:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/prompttracker?schema=public"
   ```
4. **Run migrations**:
   ```bash
   cd backend
   cmd /c "npx prisma migrate dev"
   ```

## 📊 Database Schema

The application uses the following main entities:

- **User**: User accounts (synced with Clerk)
- **Workspace**: Personal or team workspaces
- **WorkspaceMember**: Team membership with roles
- **Collection**: Folders for organizing prompts
- **Prompt**: The main prompt entity
- **PromptVersion**: Version history for prompts
- **PromptRun**: Usage logs with ratings
- **Tag**: Tags for categorization
- **PromptTag**: Many-to-many relationship

See `backend/prisma/schema.prisma` for the complete schema.

## 🛠️ Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

**Backend:**
- `npm run start:dev` - Start development server with watch mode
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npx prisma studio` - Open Prisma Studio (database GUI)

### Adding shadcn/ui Components

```bash
cd frontend
cmd /c "npx shadcn@latest add button"
cmd /c "npx shadcn@latest add dialog"
# etc.
```

## 📝 API Documentation

Once the backend is running, visit http://localhost:3001/api/docs for interactive API documentation powered by Swagger.

## 🗺️ Development Roadmap

- [x] **Phase 0**: Design & Planning
- [x] **Phase 1**: Project Setup (In Progress)
  - [x] Initialize Next.js frontend
  - [x] Initialize NestJS backend
  - [x] Configure database schema
  - [ ] Install dependencies
  - [ ] Set up authentication
- [ ] **Phase 2**: Core Backend
- [ ] **Phase 3**: Core Frontend
- [ ] **Phase 4**: Team Features
- [ ] **Phase 5**: Analytics & Polish
- [ ] **Phase 6**: Testing & Deployment

See [task.md](../.gemini/antigravity/brain/8c6d0259-c69b-4b7a-a25a-9e3591f545d0/task.md) for detailed task breakdown.

## 🤝 Contributing

This is currently a private project. Contribution guidelines will be added when the project is open-sourced.

## 📄 License

MIT

## 🔗 Links

- [Implementation Plan](../.gemini/antigravity/brain/8c6d0259-c69b-4b7a-a25a-9e3591f545d0/implementation_plan.md)
- [Task Breakdown](../.gemini/antigravity/brain/8c6d0259-c69b-4b7a-a25a-9e3591f545d0/task.md)
- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
