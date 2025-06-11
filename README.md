# UniSHIFT Charity Website

A Vue 3 + TypeScript charity website for UniSHIFT organization with question submission functionality.

## Features

- Modern, responsive design
- FAQ section with expandable questions
- Contact form with question submission
- Backend API for storing enquiries
- JSON file storage for visitor questions

## Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. In a separate terminal, start the backend server:
```bash
npm run server
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:3001`.

## API Endpoints

### Submit Question
- **POST** `/api/questions`
- Body: `{ email: string, question: string }`
- Response: `{ success: boolean, message: string, enquiryId?: string }`

### Get All Enquiries (Admin)
- **GET** `/api/questions`
- Response: `{ success: boolean, enquiries: Array }`

### Get Statistics
- **GET** `/api/questions/stats`
- Response: `{ success: boolean, stats: Object }`

### Health Check
- **GET** `/api/health`
- Response: `{ success: boolean, message: string, timestamp: string }`

## Data Storage

All visitor enquiries are stored in `server/data/enquiries.json` with the following structure:

```json
[
  {
    "id": "1704067200000",
    "email": "user@example.com",
    "question": "What is UniSHIFT?",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "status": "new",
    "ipAddress": "127.0.0.1"
  }
]
```

## Build for Production

```bash
npm run build
```

## Project Structure

```
├── src/
│   ├── components/          # Vue components
│   ├── App.vue             # Main app component
│   └── main.ts             # App entry point
├── server/
│   ├── data/               # JSON data storage
│   └── index.js            # Express server
└── public/                 # Static assets
```

## Technologies Used

- **Frontend**: Vue 3, TypeScript, Vite
- **Backend**: Node.js, Express
- **Styling**: CSS with custom properties
- **Icons**: Lucide Vue Next
- **Storage**: JSON files