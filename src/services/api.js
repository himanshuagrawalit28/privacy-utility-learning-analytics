import axios from 'axios';
import {
  overviewMetrics,
  accuracyPrivacyTradeoff,
  privacyComparisonData,
  membershipAttackData,
  initialStudents
} from '../data/mockData.js';

// API Client Configuration
const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:5000/api';
// Default to mock mode if backend is not running or explicitly set
const FORCE_MOCK = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_USE_MOCK === 'false') ? false : true;

// Safe storage helper for SSR / test environments
const storage = {
  getItem: (key) => (typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem(key) : null),
  setItem: (key, val) => { if (typeof window !== 'undefined' && window.localStorage) window.localStorage.setItem(key, val); },
  removeItem: (key) => { if (typeof window !== 'undefined' && window.localStorage) window.localStorage.removeItem(key); }
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for Auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getItem('privalearn_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('[API Client Warning]: Backend unavailable or endpoint error, falling back if enabled.', error.message);
    return Promise.reject(error);
  }
);

// Simulated async delay for realistic UI loading states in mock mode
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// Centralized API Service Modules
export const authAPI = {
  login: async (credentials) => {
    if (FORCE_MOCK) {
      await delay(600);
      if (credentials.email && credentials.password) {
        const mockUser = {
          id: 'USR-ADMIN-1',
          name: 'Dr. Evelyn Vance',
          email: credentials.email,
          role: 'ML Privacy Officer & Academic Dean',
          token: 'mock-jwt-token-privalearn-secure-xyz99',
        };
        storage.setItem('privalearn_token', mockUser.token);
        storage.setItem('privalearn_user', JSON.stringify(mockUser));
        return { success: true, data: mockUser };
      }
      throw new Error('Please provide valid credentials.');
    }
    const res = await apiClient.post('/auth/login', credentials);
    if (res.data?.token) {
      storage.setItem('privalearn_token', res.data.token);
      storage.setItem('privalearn_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  logout: () => {
    storage.removeItem('privalearn_token');
    storage.removeItem('privalearn_user');
  },

  getCurrentUser: () => {
    const userStr = storage.getItem('privalearn_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

export const studentsAPI = {
  getStudents: async (params = {}) => {
    if (FORCE_MOCK) {
      await delay(350);
      let list = [...initialStudents];
      
      if (params.search) {
        const query = params.search.toLowerCase();
        list = list.filter(s => 
          s.name.toLowerCase().includes(query) ||
          s.id.toLowerCase().includes(query) ||
          s.department.toLowerCase().includes(query)
        );
      }
      if (params.risk && params.risk !== 'ALL') {
        list = list.filter(s => s.predictedRisk.toUpperCase() === params.risk.toUpperCase());
      }
      if (params.department && params.department !== 'ALL') {
        list = list.filter(s => s.department === params.department);
      }

      const total = list.length;
      const page = params.page || 1;
      const limit = params.limit || 8;
      const startIndex = (page - 1) * limit;
      const paginatedList = list.slice(startIndex, startIndex + limit);

      return {
        success: true,
        data: paginatedList,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    }

    try {
      const res = await apiClient.get('/students', { params });
      return res.data;
    } catch (err) {
      console.warn('Falling back to local data after network failure:', err.message);
      return studentsAPI.getStudents({ ...params, _forceMock: true });
    }
  },

  getStudentById: async (id) => {
    if (FORCE_MOCK) {
      await delay(200);
      const student = initialStudents.find(s => s.id === id);
      if (!student) throw new Error('Student not found');
      return { success: true, data: student };
    }
    const res = await apiClient.get(`/students/${id}`);
    return res.data;
  }
};

export const predictionAPI = {
  predictRisk: async (features) => {
    if (FORCE_MOCK) {
      await delay(500);
      const attendance = parseFloat(features.attendance) || 80;
      const midterm = parseFloat(features.midtermScore) || 75;
      const studyHours = parseFloat(features.studyHours) || 12;
      const absences = parseFloat(features.absences) || 2;
      const epsilon = parseFloat(features.epsilon) || 1.25;
      const dpEnabled = features.enableDP !== false;

      // Calibrated academic risk calculation
      const attRisk = (100 - attendance) / 100;
      const scoreRisk = (100 - midterm) / 100;
      const absenceRisk = Math.min(absences / 12, 1.0);
      const studyBonus = Math.min(studyHours / 25, 1.0);

      const rawRisk = (attRisk * 0.45) + (scoreRisk * 0.35) + (absenceRisk * 0.30) - (studyBonus * 0.15);
      const normalizedBaseRisk = Math.min(Math.max(rawRisk, 0.02), 0.98);

      // Differential Privacy Gaussian/Laplace Perturbation simulation:
      // Noise inversely proportional to epsilon
      let noise = 0;
      if (dpEnabled && epsilon > 0) {
        const scale = 0.08 / epsilon;
        noise = (Math.random() - 0.5) * scale;
      }

      const finalScore = Math.min(Math.max(normalizedBaseRisk + noise, 0.01), 0.99);
      let riskCategory = 'Low';
      if (finalScore >= 0.65) riskCategory = 'High';
      else if (finalScore >= 0.35) riskCategory = 'Medium';

      return {
        success: true,
        data: {
          riskScore: parseFloat(finalScore.toFixed(3)),
          rawScore: parseFloat(normalizedBaseRisk.toFixed(3)),
          noiseApplied: parseFloat(noise.toFixed(4)),
          predictedRisk: riskCategory,
          privacyGuarantee: dpEnabled ? `(ε = ${epsilon}, δ = 1e-5)` : 'Unprotected (ε = ∞)',
          confidenceInterval: [
            parseFloat(Math.max(0, finalScore - 0.06).toFixed(2)),
            parseFloat(Math.min(1, finalScore + 0.06).toFixed(2))
          ],
          timestamp: new Date().toISOString()
        }
      };
    }

    const res = await apiClient.post('/predict', features);
    return res.data;
  }
};

export const metricsAPI = {
  getOverviewMetrics: async () => {
    if (FORCE_MOCK) {
      await delay(300);
      return { success: true, data: overviewMetrics };
    }
    const res = await apiClient.get('/metrics/overview');
    return res.data;
  },

  getPrivacyComparison: async () => {
    if (FORCE_MOCK) {
      await delay(300);
      return { success: true, data: privacyComparisonData };
    }
    const res = await apiClient.get('/metrics/privacy-comparison');
    return res.data;
  },

  getAttackSimulation: async () => {
    if (FORCE_MOCK) {
      await delay(350);
      return { success: true, data: membershipAttackData };
    }
    const res = await apiClient.get('/metrics/attack-simulation');
    return res.data;
  },

  getTradeoffCurve: async () => {
    if (FORCE_MOCK) {
      await delay(300);
      return { success: true, data: accuracyPrivacyTradeoff };
    }
    const res = await apiClient.get('/metrics/tradeoff');
    return res.data;
  }
};
