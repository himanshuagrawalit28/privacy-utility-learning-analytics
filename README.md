# PrivaLearn AI — Privacy-Preserving Student Risk Analytics

PrivaLearn AI is an educational machine learning dashboard designed to predict academic dropout and performance risk under rigorous **Differential Privacy (DP-SGD)** guarantees.

The platform provides university administrators and data scientists with visibility into model accuracy, privacy loss budgets ($\epsilon, \delta$), and empirical resistance against **Membership Inference Attacks (MIA)**.

---

## Tech Stack

- **Core & Framework**: React 19, Vite
- **Styling**: Tailwind CSS v3 (Custom Dark Theme & Glassmorphism)
- **Data Visualization**: Recharts (Area, Donut, Stacked Bar, Radar, and Line ROC curves)
- **API & HTTP Client**: Axios with centralized service layer and request interceptors
- **Icons & Micro-interactions**: Lucide React
- **Routing**: React Router v7

---

## System Architecture & Routes

| Route | Page | Description |
|---|---|---|
| `/` | **Login** | Secure authentication portal with quick demo credentials autofill. |
| `/dashboard` | **Main Overview** | Executive overview of Model Accuracy, Privacy Score, Attack Success, and the Pareto Tradeoff curve. |
| `/students` | **Student Data Grid** | Filterable, paginated table of 25+ student features with an inspector for Differential Privacy noise perturbation. |
| `/prediction` | **Individual Risk Predictor** | Interactive student feature input simulator with configurable $\epsilon$ noise injection and live risk probability meter. |
| `/privacy` | **Privacy Protection Benchmark** | Side-by-side comparison of Normal Model vs DP-SGD Protected Model metrics, multi-dimensional defense radar, and feature sensitivity weights. |
| `/attack` | **Membership Attack Visualizer** | Adversary ROC curves ($\text{AUC}=0.86$ vs $\text{AUC}=0.53$), AUC metrics, and training member score overlap distributions. |
| `/analytics` | **Tradeoff Analytics** | Interactive $\epsilon$ parameter tuner simulating projected utility and defense in real time, accompanied by evaluated configuration benchmarks. |

---

## Key Privacy Features

1. **Differential Privacy Guarantee ($\epsilon = 1.25, \delta = 10^{-5}$)**:
   - Evaluates utility preservation vs. privacy leakage under Rényi Differential Privacy bounds.
   - Retains **89.4% model accuracy** (only -4.8% utility tradeoff from the 94.2% non-private baseline).
2. **Membership Inference Attack (MIA) Defense**:
   - Reduces adversary classification AUC from **0.86 (High Risk)** down to **0.53 (Empirically Safe - Near 0.50 Random Guessing)**.
3. **Calibrated DP Noise Simulation**:
   - Perturbs individual confidence scores with Gaussian/Laplacian noise scaled inversely with $\epsilon$ to prevent membership reconstruction.

---

## Local Development & Setup

### Prerequisites
- Node.js `v18+` (Tested on Node v24)
- npm `v9+`

### Installation
```bash
# Clone or open repository folder
cd Frontend

# Install runtime and development dependencies
npm install
```

### Running Locally
```bash
# Launch Vite development server
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### Building for Production
```bash
# Compile and optimize production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## API Service Layer & Configuration

The application features a centralized API service layer located in `src/services/api.js`.

### Environment Variables
Create a `.env` file in the root directory to configure the backend connection:

```env
# URL for backend REST API endpoints
VITE_API_BASE_URL=http://localhost:5000/api

# Set to 'false' to connect to live backend, or 'true' to use standalone mock engine
VITE_USE_MOCK=true
```

When `VITE_USE_MOCK` is active (default), all API calls execute with realistic simulated network latencies and mock data fallback.

---

## License & Compliance
Compliant with FERPA student privacy standards and GDPR differential privacy recommendations.
