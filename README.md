## WhosTurn

WhosTurn is a small web app for keeping track of whose turn it is — useful for games, chores, or any shared tasks where people take turns. It provides simple authentication, group management, and lightweight notifications so groups can rotate turns without friction.

### Key features

- Email/password authentication and session management
- Create and manage groups (members, turn order)
- Assign and rotate turns within a group
- Push/visual notifications when it's a user's turn (via in-app notifications)
- Simple, responsive UI built with React + TypeScript

### Tech stack

- Frontend: React, TypeScript, Vite
- Backend / Realtime & Auth: Supabase (client in `src/lib/supabase.ts`)
- App structure: Components (e.g. `AuthForm.tsx`, `CreateGroupModal.tsx`), Context (`AuthContext.tsx`), custom hooks (`useGroups`, `useNotifications`)
- Styling: PostCSS (project already includes `postcss.config.mjs`)

### Quick start

1. Install dependencies

```bash
npm install
```

2. Provide Supabase environment variables (create a `.env` at the project root). The app expects the Supabase values to be available to Vite — commonly prefixed with `VITE_`:

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. Run the dev server

```bash
npm run dev
```

4. Build for production

```bash
npm run build
npm run preview
```

### Where to look in the code

- `src/pages/Dashboard.tsx` — main app view for managing groups and turns
- `src/components/CreateGroupModal.tsx` — create groups & invite members
- `src/hooks/useGroups.tsx` — group-related logic and API wiring
- `src/hooks/useNotifications.tsx` — notification handling
- `src/lib/supabase.ts` — Supabase client setup
