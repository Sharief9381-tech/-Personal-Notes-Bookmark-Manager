# Personal Notes & Bookmark Manager

A full-stack application for managing personal notes and bookmarks with search, tags, and favorites.

## Tech Stack

- **Backend**: Node.js + Express + MongoDB
- **Frontend**: Next.js + React + Tailwind CSS

## Features

- ✅ Create, read, update, delete notes and bookmarks
- ✅ Search by text and filter by tags
- ✅ Mark items as favorites
- ✅ Auto-fetch bookmark metadata from URLs
- ✅ JWT authentication
- ✅ Responsive UI with Tailwind CSS

## Project Structure

```
├── backend/          # Express API server
└── frontend/         # Next.js application
```

## Setup Instructions

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB connection string
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Notes API
- `POST /api/notes` - Create note
- `GET /api/notes?q=search&tags=tag1,tag2` - List/search notes
- `GET /api/notes/:id` - Get single note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Bookmarks API
- `POST /api/bookmarks` - Create bookmark
- `GET /api/bookmarks?q=search&tags=tag1,tag2` - List/search bookmarks
- `GET /api/bookmarks/:id` - Get single bookmark
- `PUT /api/bookmarks/:id` - Update bookmark
- `DELETE /api/bookmarks/:id` - Delete bookmark

### Sample cURL Requests

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"John Doe"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Create Note (use token from login)
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"My Note","content":"Note content","tags":["work","important"]}'

# Create Bookmark
curl -X POST http://localhost:5000/api/bookmarks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"url":"https://example.com","tags":["reference"]}'
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notes-app
JWT_SECRET=your-secret-key-change-in-production
```

## License

MIT
