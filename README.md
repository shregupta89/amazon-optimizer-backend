# Amazon Listing Optimizer - Backend

Node.js backend for optimizing Amazon product listings using AI.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup MySQL with Docker
```bash
docker-compose up -d
```

### 3. Configure Environment
```bash
cp .env.example .env
```
Edit `.env` and add your OpenAI API key and RapidAPI key.

### 4. Setup Database
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Run Server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

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