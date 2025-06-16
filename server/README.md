# UniSHIFT Server

Express.js backend server for the UniSHIFT charity website.

## Features

- RESTful API for questions and donations
- MongoDB integration
- Email notifications
- CORS enabled for frontend integration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`:
- `MONGODB_URI`: Your MongoDB connection string
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`: Email configuration
- `EMAIL_FROM`: The "from" email address
- `PORT`: Server port (default: 3001)

4. Start the server:
```bash
npm start
```

## API Endpoints

### Questions
- `POST /api/questions` - Submit a new question
- `GET /api/questions` - Get all questions (admin)
- `GET /api/questions/stats` - Get question statistics
- `POST /api/questions/:id/respond` - Send email response to a question

### Donations
- `GET /api/donations` - Get all donations
- `GET /api/donations/stats` - Get donation statistics

### Health
- `GET /api/health` - Health check

## Database Collections

### questions
```json
{
  "_id": "ObjectId",
  "email": "string",
  "question": "string",
  "timestamp": "Date",
  "status": "new|responded",
  "ipAddress": "string",
  "response": "string (optional)",
  "respondedAt": "Date (optional)"
}
```

### donations
```json
{
  "_id": "ObjectId",
  "amount": "number",
  "timestamp": "Date"
}
```