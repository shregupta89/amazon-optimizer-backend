# Amazon Listing Optimizer - Backend

Node.js backend for optimizing Amazon product listings using AI.

## Quick Setup

### Option 1: Docker (Recommended)

```bash
# 1. Create environment file
cp .env.docker .env
# Add your OPENAI_API_KEY and RAPIDAPI_KEY in .env

# 2. Start everything
docker-compose up -d

# 3. Check status
docker-compose ps
```

Server runs on `http://localhost:5001`

### Option 2: Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Start MySQL
docker run -d \
  --name amazon_optimizer_db \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=amazon_optimizer \
  -e MYSQL_USER=admin \
  -e MYSQL_PASSWORD=admin123 \
  -p 3306:3306 \
  mysql:8.0

# 3. Configure environment
cp .env.example .env
# Add your API keys

# 4. Setup database
npx prisma generate
npx prisma migrate dev --name init

# 5. Run server
npm run dev
```

## API Endpoints

### POST `/api/optimize`
Fetch and optimize Amazon listing.
```json
{
  "asin": "B0B8QMW657"
}
```

### GET `/api/history/:asin`
Get all optimizations for an ASIN.

### GET `/api/listings/:asin`
Get latest optimization for an ASIN.

## Tech Stack
- Node.js + Express
- MySQL + Prisma ORM
- OpenAI GPT-4o-mini
- RapidAPI (Amazon ASIN API)

## AI Prompt Strategy
The AI is prompted to optimize listings by:
- Creating keyword-rich titles under 200 characters
- Writing 5 clear, benefit-focused bullet points
- Crafting persuasive, Amazon-compliant descriptions
- Suggesting 3-5 relevant keywords

Structured JSON output ensures consistent parsing.

## Documentation

- **DOCKER_SETUP.md** - Docker deployment guide
- **SETUP.md** - Detailed local setup guide
- **README.md** - This file