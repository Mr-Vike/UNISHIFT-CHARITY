# UniSHIFT Discord Bot

Discord bot for managing donations and responding to questions from the UniSHIFT website.

## Features

- **Slash Commands:**
  - `/add <amount>` - Add a donation to the database with confirmation
  - `/view [page]` - View donations with pagination
- **Question Management:**
  - Automatically receives new questions from the website
  - Allows staff to respond to questions via Discord
  - Sends email responses to users
- **Real-time Updates:**
  - Listens for new questions using MongoDB change streams

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
- `DISCORD_TOKEN`: Your Discord bot token
- `DISCORD_GUILD_ID`: Your Discord server ID
- `DISCORD_QUESTIONS_CHANNEL_ID`: Channel ID for question notifications
- `MONGODB_URI`: Your MongoDB connection string
- Email configuration for sending responses

4. Start the bot:
```bash
npm start
```

## Discord Bot Setup

1. Create a new application at https://discord.com/developers/applications
2. Create a bot user and copy the token
3. Invite the bot to your server with the following permissions:
   - Send Messages
   - Use Slash Commands
   - Embed Links
   - Read Message History

## Required Permissions

The bot needs the following Discord permissions:
- `GUILD_MESSAGES`
- `MESSAGE_CONTENT`
- `GUILDS`

## Commands

### `/add <amount>`
Adds a donation to the database. Shows a confirmation dialog before adding.

### `/view [page]`
Displays donations with pagination (10 per page). Shows:
- Donation amount
- Date added
- Total donations and amount

## Question Response System

When a new question is submitted via the website:
1. Bot receives notification via MongoDB change stream
2. Posts an embed in the configured questions channel
3. Staff can click "Respond" button
4. Modal opens for typing response
5. Email is sent to the user
6. Question status is updated in database