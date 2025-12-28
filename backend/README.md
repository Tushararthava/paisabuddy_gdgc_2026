# PaisaBuddy Backend

Production-level Node.js/TypeScript backend for PaisaBuddy financial learning platform.

## Features

- ✅ **TypeScript** - Type-safe code with strict mode
- ✅ **Express.js** - Fast, unopinionated web framework
- ✅ **Prisma ORM** - Type-safe database access with PostgreSQL
- ✅ **Winston Logger** - Production-grade logging with daily rotation
- ✅ **JWT Authentication** - Secure token-based auth with Google OAuth2
- ✅ **Zod Validation** - Runtime type checking and validation
- ✅ **Rate Limiting** - Protection against abuse
- ✅ **Helmet** - Security headers
- ✅ **CORS** - Cross-origin resource sharing
- ✅ **ESLint & Prettier** - Code quality and formatting

## Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your configuration
```

## Environment Variables

```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/paisabuddy?schema=public"
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=info
```

## Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with sample companies
npm run db:seed

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

## Development

```bash
# Start development server with hot reload
npm run dev
```

## Production

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## API Endpoints

### Authentication
- `GET /api/auth/google` - Get Google OAuth URL
- `POST /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (protected)

### Companies
- `GET /api/companies` - Get all companies (with filters)
- `GET /api/companies/:id` - Get company by ID
- `GET /api/companies/symbol/:symbol` - Get company by symbol
- `GET /api/companies/sectors` - Get all sectors
- `GET /api/companies/market-cap-categories` - Get market cap categories

### Stocks
- `GET /api/stocks/holdings` - Get user stock holdings (protected)
- `GET /api/stocks/portfolio` - Get portfolio summary (protected)
- `POST /api/stocks/buy` - Buy stock (protected)
- `POST /api/stocks/sell` - Sell stock (protected)

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── index.ts     # Environment config
│   │   ├── logger.ts    # Winston logger
│   │   └── database.ts  # Prisma client
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── middleware/      # Express middleware
│   ├── routes/          # Route definitions
│   ├── validators/      # Zod schemas
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript types
│   ├── scripts/         # Database seeds, etc.
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── logs/                # Log files
├── .env                 # Environment variables
├── tsconfig.json        # TypeScript config
└── package.json         # Dependencies
```

## Logging

Logs are stored in the `logs/` directory:
- `combined-YYYY-MM-DD.log` - All logs
- `error-YYYY-MM-DD.log` - Error logs only
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled promise rejections

## Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format
```

## License

ISC
