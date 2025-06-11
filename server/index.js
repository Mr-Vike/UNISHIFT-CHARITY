import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Path to the enquiries JSON file
const enquiriesPath = path.join(__dirname, 'data', 'enquiries.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize enquiries file if it doesn't exist
if (!fs.existsSync(enquiriesPath)) {
  fs.writeFileSync(enquiriesPath, JSON.stringify([], null, 2));
}

// Helper function to read enquiries
const readEnquiries = () => {
  try {
    const data = fs.readFileSync(enquiriesPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading enquiries:', error);
    return [];
  }
};

// Helper function to write enquiries
const writeEnquiries = (enquiries) => {
  try {
    fs.writeFileSync(enquiriesPath, JSON.stringify(enquiries, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing enquiries:', error);
    return false;
  }
};

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'UniSHIFT API Server',
    version: '1.0.0',
    endpoints: {
      'POST /api/questions': 'Submit a new question',
      'GET /api/questions': 'Get all enquiries (admin)',
      'GET /api/questions/stats': 'Get enquiry statistics',
      'GET /api/health': 'Health check'
    }
  });
});

// POST endpoint to submit a question
app.post('/api/questions', (req, res) => {
  try {
    const { email, question } = req.body;

    // Validate input
    if (!email || !question) {
      return res.status(400).json({
        success: false,
        message: 'Email and question are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Create new enquiry object
    const newEnquiry = {
      id: Date.now().toString(),
      email: email.trim(),
      question: question.trim(),
      timestamp: new Date().toISOString(),
      status: 'new',
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown'
    };

    // Read existing enquiries
    const enquiries = readEnquiries();

    // Add new enquiry
    enquiries.push(newEnquiry);

    // Write back to file
    const writeSuccess = writeEnquiries(enquiries);

    if (writeSuccess) {
      res.status(201).json({
        success: true,
        message: 'Your question has been submitted successfully! We\'ll get back to you within 24 hours.',
        enquiryId: newEnquiry.id
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to save your question. Please try again.'
      });
    }

  } catch (error) {
    console.error('Error submitting question:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while submitting your question. Please try again.'
    });
  }
});

// GET endpoint to retrieve all enquiries (for admin purposes)
app.get('/api/questions', (req, res) => {
  try {
    const enquiries = readEnquiries();
    res.json({
      success: true,
      enquiries: enquiries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    });
  } catch (error) {
    console.error('Error retrieving enquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve enquiries'
    });
  }
});

// GET endpoint to get enquiry statistics
app.get('/api/questions/stats', (req, res) => {
  try {
    const enquiries = readEnquiries();
    const stats = {
      total: enquiries.length,
      new: enquiries.filter(e => e.status === 'new').length,
      responded: enquiries.filter(e => e.status === 'responded').length,
      thisMonth: enquiries.filter(e => {
        const enquiryDate = new Date(e.timestamp);
        const now = new Date();
        return enquiryDate.getMonth() === now.getMonth() && 
               enquiryDate.getFullYear() === now.getFullYear();
      }).length
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get statistics'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: [
      'GET /',
      'POST /api/questions',
      'GET /api/questions',
      'GET /api/questions/stats',
      'GET /api/health'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at: http://localhost:${PORT}`);
  console.log(`Enquiries will be saved to: ${enquiriesPath}`);
});