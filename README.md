# Privacy-Utility Learning Analytics (ED-03)

A comprehensive machine learning framework and analytical platform investigating privacy-utility tradeoffs in educational analytics. Built for the ED-03 Hackathon Challenge, this platform evaluates the resilience of student prediction models against **Membership Inference Attacks (MIA)** using **L2 Regularization** as a privacy-preserving mechanism.

---

## 🏗️ Repository Structure (Monorepo)

```tree
privacy-utility-learning-analytics/
├── frontend/                 # React 19 + Vite UI Dashboard
├── backend/                  # Node.js + Express API Gateway
├── ml-service/               # Python ML Pipeline & FastAPI Server
├── ed03_submission/          # Required hackathon metrics and privacy claims
└── README.md                 # Project root documentation
```

---

## 🚀 Getting Started

This project uses a microservice architecture. You will need to run the **Python ML Service**, the **Node.js Gateway**, and the **React Frontend**.

### 1. Start the Machine Learning Service (Python)
This service handles data preprocessing, model training, and serves predictions via FastAPI.

```powershell
cd ml-service
# Create and activate a virtual environment (if not already done)
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server (runs on port 8001)
python main.py
```
*(The Swagger testing UI will be available at http://127.0.0.1:8001/docs)*

### 2. Start the API Gateway (Node.js)
This server proxies requests from the React frontend to the Python ML service.

```powershell
cd backend
npm install
# Run the Node server (runs on port 5000)
node server.js
```

### 3. Start the UI Dashboard (React)
This is the beautiful user interface for teachers and administrators.

```powershell
cd frontend
npm install
# Run the React dev server (runs on port 5173 usually)
npm run dev
```

---

## 🛡️ Hackathon ML Pipeline & Attacks

The `ml-service/` directory contains the core of the ED-03 challenge:
1. **Preprocessing (`preprocess.py`)**: Filters the massive OULAD dataset into strict Day-90 features to predict student Pass/Fail outcomes.
2. **Models (`train.py` & `protected_model.py`)**: Trains the baseline Logistic Regression model, and a second "Protected" model utilizing heavy L2 Regularization.
3. **Membership Inference Attack (`membership_attack.py`)**: Simulates a hacker attempting to determine if specific students were in the training set, outputting the final **Privacy Utility ($U_{privacy}$)** scores.

### Official Results
| Model Type | Balanced Accuracy ($U_{pred}$) | Privacy Score ($U_{privacy}$) |
| :--- | :--- | :--- |
| **Baseline Model** | 72.96% | 0.9976 |
| **Protected Model** | 73.14% | 0.9951 |

For detailed breakdown of these metrics and our Empirical Privacy defense claims, see the [ed03_submission/](ed03_submission/) folder.
