# PromptTracker

A comprehensive web application for saving, organizing, versioning, and analyzing LLM prompts with team collaboration features.

## 🎯 Current Status

**MVP Core Features - Working!** ✅

The application is functional with core prompt management features. Authentication is temporarily disabled to allow testing of the main functionality.

### ✅ Implemented Features
- **Create Prompts**: Full form with title, description, content, and tags
- **View Prompts**: Detail page with version history and copy-to-clipboard functionality
- **Edit Prompts**: Update title, description, and tags
- **List Prompts**: Dashboard view showing all prompts in workspace
- **User/Workspace Sync**: Automatic workspace creation on first login
- **Tagging System**: Add and manage tags for prompt organization

### 🚧 In Progress
- **Authentication**: Clerk integration (JWT validation needs debugging)
- **Delete Prompts**: Backend endpoint ready, UI pending
- **Version History**: View and compare prompt versions
- **Collections**: Organize prompts into folders/projects

### 📋 Planned Features
- **Analytics Dashboard**: Track prompt performance and usage
- **Team Collaboration**: Share prompts with role-based access
- **Search & Filters**: Full-text search with advanced filtering
- **Browser Extension**: Quick-save from ChatGPT/Claude
- **API Integration**: Direct LLM API calls with auto-logging

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Authentication**: Clerk (temporarily disabled)
- **Forms**: React Hook Form + Zod validation

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **API Documentation**: Swagger/OpenAPI
- **Authentication**: Clerk + JWT (temporarily disabled)

## 📁 Project Structure

```
prompt-tracker/
├── frontend/                 # Next.js frontend application
│   ├── app/
│   │   ├── (auth)/          # Authentication pages
│   │   ├── dashboard/       # Main application pages
│   │   │   ├── page.tsx     # Dashboard home
│   │   │   └── prompts/     # Prompt management
│   │   │       ├── page.tsx           # Prompts list
│   │   │       ├── new/page.tsx       # Create prompt
│   │   │       └── [id]/              # Prompt detail & edit
│   │   └── layout.tsx       # Root layout with Clerk
│   ├── components/
│   │   ├── ui/             # shadcn/ui components
│   │   ├── auth/           # Auth components (UserSync)
│   │   ├── layout/         # Header, Sidebar
│   │   └── prompts/        # PromptCard, PromptList
│   ├── lib/
│   │   ├── services/       # API client
│   │   ├── hooks.ts        # React Query hooks
│   │   └── query-provider.tsx
│   └── middleware.ts       # Clerk middleware
│
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── auth/           # JWT strategy (JWKS integration)
│   │   ├── users/          # User management
│   │   ├── workspaces/     # Workspace management
│   │   ├── prompts/        # Prompt CRUD operations
│   │   ├── collections/    # Collections (planned)
│   │   ├── prisma/         # Prisma service
│   │   └── main.ts         # Entry point with CORS
│   └── prisma/
│       └── schema.prisma   # Database schema
│
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Clerk account (for authentication - optional for testing)

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
   # Edit .env with your database credentials
   
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
   # Edit .env.local with your Clerk keys (optional for testing)
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
   - Sign in with Google or GitHub (or skip if auth is disabled)
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

## 🔧 Known Issues

### Authentication (Temporary)
- **Status**: Authentication guards are currently **commented out** for testing
- **Mock User**: All requests use mock user ID `user_temp_test_123`
- **Issue**: JWT payload validation not being called despite successful signature validation
- **Workaround**: Auth guards disabled in all controllers
- **Fix Needed**: Debug why Passport's `validate()` method isn't being invoked

### Clock Skew
- Clerk tokens may expire due to system clock differences
- Workaround: Sign out and sign back in to get fresh tokens

## 📝 API Documentation

Once the backend is running, visit http://localhost:3001/api/docs for interactive API documentation powered by Swagger.

### Key Endpoints

**Prompts:**
- `POST /api/prompts` - Create a new prompt
- `GET /api/prompts?workspaceId=...` - List prompts
- `GET /api/prompts/:id` - Get prompt details
- `PATCH /api/prompts/:id` - Update prompt
- `POST /api/prompts/:id/versions` - Create new version

**Workspaces:**
- `GET /api/workspaces` - List user's workspaces
- `POST /api/workspaces` - Create workspace

**Users:**
- `POST /api/users/sync` - Sync Clerk user to database
- `GET /api/users/me` - Get current user

## 🗺️ Development Roadmap

- [x] **Phase 1**: Project Setup
  - [x] Initialize Next.js frontend
  - [x] Initialize NestJS backend
  - [x] Configure database schema
  - [x] Set up Clerk authentication (partial)
  
- [x] **Phase 2**: Core Prompt Management
  - [x] Create prompts
  - [x] View prompt details
  - [x] Edit prompts
  - [x] List prompts
  - [x] Tagging system
  
- [ ] **Phase 3**: Advanced Features
  - [ ] Delete prompts
  - [ ] Version history view
  - [ ] Collections management
  - [ ] Search and filtering
  
- [ ] **Phase 4**: Team Features
  - [ ] Workspace sharing
  - [ ] Role-based access control
  - [ ] Activity logs
  
- [ ] **Phase 5**: Analytics & Polish
  - [ ] Usage analytics
  - [ ] Performance tracking
  - [ ] UI/UX improvements
  
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
3. Run migrations: `npx prisma migrate dev`
4. Start backend first, then frontend
5. Visit http://localhost:3000 and start creating prompts!

### Troubleshooting
- **Connection refused**: Make sure both servers are running
- **Database errors**: Check DATABASE_URL in backend/.env
- **Auth issues**: Authentication is temporarily disabled, should work without Clerk keys
- **Port conflicts**: Backend uses 3001, frontend uses 3000

---

**Built with ❤️ using Next.js, NestJS, and Prisma**
