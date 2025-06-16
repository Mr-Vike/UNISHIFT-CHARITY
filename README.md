# UniSHIFT Project

A complete charity website system with Vue.js frontend, Express.js backend, and Discord bot integration.

## Project Structure

```
├── website/          # Vue.js frontend application
├── server/           # Express.js backend API
├── discord-bot/      # Discord bot for donation management
└── README.md         # This file
```

## Components

### 1. Website (Frontend)
- **Technology:** Vue 3 + TypeScript + Vite
- **Features:** 
  - Responsive charity website
  - Real-time donation statistics
  - Question submission form
  - MongoDB integration for live updates

### 2. Server (Backend)
- **Technology:** Express.js + MongoDB
- **Features:**
  - RESTful API for questions and donations
  - Email notifications
  - Database management
  - CORS enabled

### 3. Discord Bot
- **Technology:** Discord.js + MongoDB
- **Features:**
  - Slash commands for donation management
  - Question response system
  - Real-time notifications
  - Email integration

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- Discord bot token (for bot component)
- Email account with app password

### 1. Setup Website
```bash
cd website
npm install
cp .env.example .env
# Configure VITE_API_URL and VITE_MONGODB_URI in .env
npm run dev
```

### 2. Setup Server
```bash
cd server
npm install
cp .env.example .env
# Configure MongoDB and email settings in .env
npm start
```

### 3. Setup Discord Bot
```bash
cd discord-bot
npm install
cp .env.example .env
# Configure Discord and database settings in .env
npm start
```

## Environment Variables

### Website (.env)
```
VITE_API_URL=http://localhost:3001
VITE_MONGODB_URI=mongodb://localhost:27017/unishift
```

### Server (.env)
```
MONGODB_URI=mongodb://localhost:27017/unishift
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=info@unishift.org
PORT=3001
```

### Discord Bot (.env)
```
DISCORD_TOKEN=your_discord_bot_token
DISCORD_GUILD_ID=your_guild_id
DISCORD_QUESTIONS_CHANNEL_ID=your_questions_channel_id
MONGODB_URI=mongodb://localhost:27017/unishift
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=info@unishift.org
```

## Deployment

### Website (Frontend)
- **Recommended:** Netlify, Vercel, or any static hosting
- Build command: `npm run build`
- Publish directory: `dist`

### Server (Backend)
- **Recommended:** Render, Railway, Heroku, or VPS
- Supports Node.js applications
- Requires MongoDB connection

### Discord Bot
- **Recommended:** Render (background worker), Railway, or VPS
- Needs 24/7 uptime for real-time features

## Database Schema

### Collections

#### donations
```json
{
  "_id": "ObjectId",
  "amount": "number",
  "timestamp": "Date"
}
```

#### questions
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

## Features

### Real-time Updates
- Website automatically updates donation statistics
- Discord bot receives instant question notifications
- MongoDB change streams for live data synchronization

### Email Integration
- Automatic question submissions
- Staff responses via Discord
- Professional email templates

### Discord Commands
- `/add <amount>` - Add donation with confirmation
- `/view [page]` - Paginated donation history
- Question response system with modals

## Development

Each component can be developed independently:

1. **Website:** `cd website && npm run dev`
2. **Server:** `cd server && npm run dev`
3. **Discord Bot:** `cd discord-bot && npm run dev`

## Production Considerations

1. **Security:**
   - Use environment variables for all secrets
   - Enable CORS only for your domain
   - Use HTTPS in production

2. **Database:**
   - Use MongoDB Atlas or managed database
   - Set up proper indexes
   - Regular backups

3. **Monitoring:**
   - Add logging for all components
   - Monitor API endpoints
   - Discord bot uptime monitoring

## Support

For issues or questions:
1. Check individual component README files
2. Review environment variable configuration
3. Ensure MongoDB connection is working
4. Verify Discord bot permissions

## License

This project is for UniSHIFT charity organization.