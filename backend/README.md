# Backend API

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB connection string

4. Start the server:
```bash
npm run dev
```

## API Endpoints

All protected routes require `Authorization: Bearer <token>` header.

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Notes
- `GET /api/notes` - Get all notes (supports ?q=search&tags=tag1,tag2)
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Bookmarks
- `GET /api/bookmarks` - Get all bookmarks (supports ?q=search&tags=tag1,tag2)
- `GET /api/bookmarks/:id` - Get single bookmark
- `POST /api/bookmarks` - Create bookmark (auto-fetches title if not provided)
- `PUT /api/bookmarks/:id` - Update bookmark
- `DELETE /api/bookmarks/:id` - Delete bookmark
