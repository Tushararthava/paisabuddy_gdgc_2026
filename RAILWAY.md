# PaisaBuddy Monorepo

This repository contains both the frontend and backend for PaisaBuddy.

## Structure

- `/backend` - Node.js/Express/TypeScript backend
- `/Burnout_Internal-Round_39` - Next.js frontend

## Railway Deployment

This is a monorepo. When deploying to Railway:

### Backend Service
- **Root Directory**: `backend`
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `npm run start`
- **Environment Variables Required**:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `JWT_REFRESH_SECRET`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `GOOGLE_CALLBACK_URL`
  - `FRONTEND_URL`

### Frontend Service
- **Root Directory**: `Burnout_Internal-Round_39`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`
- **Environment Variables Required**:
  - `NEXT_PUBLIC_API_URL` (your backend URL)

### Database
- Add PostgreSQL database service
- Copy the `DATABASE_URL` to backend environment variables
