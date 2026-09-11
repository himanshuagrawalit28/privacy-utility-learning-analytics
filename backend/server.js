const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;
const FASTAPI_URL = 'http://127.0.0.1:8001';

// Middleware
app.use(cors());
app.use(express.json());

// 1. Base route
app.get('/', (req, res) => {
    res.json({ message: 'ED-03 Node.js API Gateway is running' });
});

// 2. Fetch metrics route (Mocked for dashboard, but can be pulled from Python)
app.get('/api/metrics', (req, res) => {
    res.json({
        totalStudents: 32593,
        baseline: {
            accuracy: 72.96,
            auroc: 79.30,
            privacyScore: 99.76
        },
        protected: {
            accuracy: 73.14,
            auroc: 78.62,
            privacyScore: 99.51
        }
    });
});

// 3. Proxy prediction requests to Python FastAPI
app.post('/api/predict', async (req, res) => {
    try {
        const studentData = req.body;
        
        // Forward the request to FastAPI
        const pythonResponse = await axios.post(`${FASTAPI_URL}/predict`, studentData);
        
        // Return the ML results back to the React frontend
        res.json(pythonResponse.data);
    } catch (error) {
        console.error('Error forwarding request to ML service:', error.message);
        res.status(500).json({ error: 'Failed to get prediction from ML service' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Node.js Gateway Server running on http://localhost:${PORT}`);
    console.log(`Forwarding ML requests to FastAPI on ${FASTAPI_URL}`);
});
