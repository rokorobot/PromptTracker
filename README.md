# PromptTracker

A comprehensive web application for saving, organizing, versioning, and analyzing LLM prompts with team collaboration features.

## 🎯 Current Status

**MVP Core Features - Complete!** ✅

The application is fully functional with authentication, prompt management, collections, and search capabilities.

### ✅ Implemented Features

**Authentication & User Management**
- Clerk authentication with Google OAuth
- Automatic user sync and workspace creation
- Secure JWT-based API authentication

**Prompt Management**
- Create prompts with title, description, content, and tags
- View prompt details with version history
- Edit and update prompts
- Delete prompts with confirmation
- Version history with copy-to-clipboard
- Enhanced search across title, description, content, and tags

**Collections**
- Create and manage collections
- Organize prompts into collections
- View prompts by collection
- Edit and delete collections

**User Interface**
- Modern, responsive dashboard with dark mode
- Settings page with profile and appearance controls
- Real-time search and filtering
- Toast notifications for user feedback

### 📋 Planned Features
- **Analytics Dashboard**: Track prompt performance and usage statistics
- **Team Collaboration**: Share workspaces with role-based access control
- **Advanced Filters**: Filter by collection, tags, date ranges
- **Browser Extension**: Quick-save from ChatGPT/Claude
- **API Integration**: Direct LLM API calls with auto-logging
- **Export**: Export prompts to JSON, CSV, or Markdown

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Authentication**: Clerk
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **API Documentation**: Swagger/OpenAPI
- **Authentication**: Clerk JWT + Passport

## 📁 Project Structure

```
prompt-tracker/
├── frontend/                 # Next.js frontend application
│   ├── app/
│   │   ├── (auth)/          # Authentication pages
│   │   ├── dashboard/       # Main application pages
│   │   │   ├── page.tsx           # Dashboard home
│   │   │   ├── prompts/           # Prompt management
│   │   │   ├── collections/       # Collections management
│   │   │   └── settings/          # User settings
│   │   └── layout.tsx       # Root layout with providers
│   ├── components/
│   │   ├── ui/             # shadcn/ui components
│   │   ├── auth/           # Auth components (UserSync)
│   │   ├── layout/         # Header, Sidebar
│   │   └── prompts/        # Prompt components
│   └── lib/
│       ├── services/       # API client
│       └── hooks.ts        # React Query hooks
│
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── auth/           # JWT strategy (JWKS integration)
│   │   ├── users/          # User management & sync
│   │   ├── workspaces/     # Workspace management
│   │   ├── prompts/        # Prompt CRUD operations
│   │   ├── collections/    # Collections management
│   │   └── prisma/         # Prisma service
│   └── prisma/
│       └── schema.prisma   # Database schema
│
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Clerk account (free tier available)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/rokorobot/PromptTracker.git
   cd PromptTracker
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   
   # Copy environment file and configure
   cp .env.example .env
   # Edit .env with your database credentials and Clerk keys
   
   # Generate Prisma client and run migrations
   npx prisma generate
   npx prisma migrate dev --name init
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   
   # Copy environment file
   cp .env.local.example .env.local
   # Edit .env.local with your Clerk keys
   ```

### Running the Application

1. **Start the backend** (in `backend/` directory):
   ```bash
   npm run start:dev
   ```
   - Backend runs on http://localhost:3001
   - API docs at http://localhost:3001/api/docs

2. **Start the frontend** (in `frontend/` directory):
   ```bash
   npm run dev
   ```
   - Frontend runs on http://localhost:3000

3. **Access the application**:
   - Open http://localhost:3000
   - Sign in with Google
   - Your personal workspace will be created automatically
   - Start creating prompts!

### Environment Variables

**Backend (.env):**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/prompttracker?schema=public"
PORT=3001
FRONTEND_URL=http://localhost:3000
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📊 Database Schema

Main entities:

- **User**: User accounts (synced with Clerk)
- **Workspace**: Personal or team workspaces
- **WorkspaceMember**: Team membership with roles (OWNER, EDITOR, VIEWER)
- **Collection**: Folders for organizing prompts
- **Prompt**: The main prompt entity with title, description
- **PromptVersion**: Version history for prompts with content
- **PromptRun**: Usage logs with ratings and notes
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
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply migrations

### Adding shadcn/ui Components

```bash
cd frontend
npx shadcn@latest add button
npx shadcn@latest add dialog
# etc.
```

## 📝 API Documentation

Once the backend is running, visit http://localhost:3001/api/docs for interactive API documentation powered by Swagger.

### Key Endpoints

**Authentication:**
- `POST /api/users/sync` - Sync Clerk user to database
- `GET /api/users/me` - Get current user

**Prompts:**
- `POST /api/prompts` - Create a new prompt
- `GET /api/prompts?workspaceId=...&search=...` - List and search prompts
- `GET /api/prompts/:id` - Get prompt details
- `PATCH /api/prompts/:id` - Update prompt
- `DELETE /api/prompts/:id` - Delete prompt
- `POST /api/prompts/:id/versions` - Create new version

**Collections:**
- `GET /api/collections?workspaceId=...` - List collections
- `POST /api/collections` - Create collection
- `GET /api/collections/:id` - Get collection details
- `PATCH /api/collections/:id` - Update collection
- `DELETE /api/collections/:id` - Delete collection

**Workspaces:**
- `GET /api/workspaces` - List user's workspaces
- `POST /api/workspaces` - Create workspace

## 🗺️ Development Roadmap

- [x] **Phase 1**: Project Setup
  - [x] Initialize Next.js frontend
  - [x] Initialize NestJS backend
  - [x] Configure database schema
  - [x] Set up Clerk authentication
  
- [x] **Phase 2**: Core Prompt Management
  - [x] Create prompts
  - [x] View prompt details
  - [x] Edit prompts
  - [x] Delete prompts
  - [x] List prompts
  - [x] Tagging system
  - [x] Version history
  
- [x] **Phase 3**: Collections & Search
  - [x] Collections management
  - [x] Enhanced search (title, description, content, tags)
  - [x] Settings page
  
- [ ] **Phase 4**: Analytics
  - [ ] Usage statistics
  - [ ] Performance tracking
  - [ ] Charts and visualizations
  
- [ ] **Phase 5**: Team Features
  - [ ] Workspace sharing
  - [ ] Role-based access control
  - [ ] Activity logs
  
- [ ] **Phase 6**: Testing & Deployment
  - [ ] Unit tests
  - [ ] E2E tests
  - [ ] Production deployment

## 🤝 Contributing

This is currently a private project. Contribution guidelines will be added when the project is open-sourced.

## 📄 License

MIT

## 🔗 Links

- [GitHub Repository](https://github.com/rokorobot/PromptTracker)
- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

## 💡 Tips

### First Time Setup
1. Make sure PostgreSQL is running
2. Create the database: `CREATE DATABASE prompttracker;`
3. Configure your Clerk application for Google OAuth
4. Run migrations: `npx prisma migrate dev`
5. Start backend first, then frontend
6. Visit http://localhost:3000 and sign in with Google!

### Troubleshooting
- **Connection refused**: Make sure both servers are running
- **Database errors**: Check DATABASE_URL in backend/.env
- **Auth errors**: Verify Clerk keys are correctly set in both .env files
- **Port conflicts**: Backend uses 3001, frontend uses 3000
- **Blank page after code changes**: Restart dev servers to clear cache

---

**Built with ❤️ using Next.js, NestJS, and Prisma**
