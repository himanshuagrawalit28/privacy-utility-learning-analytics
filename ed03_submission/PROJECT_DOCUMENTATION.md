# PrivaLearn AI (ED-03) - Comprehensive Project Documentation

This document explains every single element of the **PrivaLearn AI** project. It is designed to help you completely understand how the frontend, backend, and machine learning models interact so you can confidently present your project to the hackathon judges.

---

## 🏗️ 1. Project Architecture (The Big Picture)

The project uses a **Microservice Architecture**, meaning the application is broken down into three separate "services" that talk to each other over the network:

1. **The React Frontend (Port 5173):** The user interface for the teachers.
2. **The Node.js API Gateway (Port 5000):** A middleman that safely routes requests.
3. **The Python ML FastAPI (Port 8001):** The brain that holds the AI models.

When a teacher clicks "Predict" on the frontend, the data travels from React $\rightarrow$ Node.js $\rightarrow$ Python AI. The Python AI calculates the risk, and sends the answer back down the chain: Python $\rightarrow$ Node.js $\rightarrow$ React.

---

## 📁 2. Element-by-Element Breakdown

Below is an explanation of every folder and file in your codebase and exactly what it does.

### A. The Frontend (`/frontend`)
This is the React application your collaborator built. It handles everything the user sees.

* **`src/pages/Login.jsx`**: The login screen. It has a "Demo Mode" built-in so judges can click "Fill Demo Credentials" without needing an actual database account.
* **`src/pages/Dashboard.jsx` & `Metrics.jsx`**: These pages display the beautiful charts. They show the 73% accuracy and 0.99 privacy score to prove the AI works and is secure.
* **`src/data/mockData.js`**: Since this is a hackathon, this file holds the dummy student data (like `STU-1001` to `STU-1025`) that you type into the search bar to test the predictions.
* **`src/services/api.js`**: This is the "messenger". Whenever a user clicks a button, this file sends a network request (`fetch` or `axios`) over to the Node.js backend.

### B. The API Gateway (`/backend`)
This is the Node.js traffic cop. 

* **`server.js`**: The only file in the backend. It uses **Express.js**. Its entire job is to listen for requests from the React frontend (like `/api/predict`), take the student data, and forward it to the Python server. 
  * *Why do we need this?* React cannot run Python code, and connecting React directly to an AI server is often a bad security practice. Node.js acts as a secure middleman (a "Proxy").

### C. The Machine Learning Engine (`/ml-service`)
This is the core of the ED-03 challenge. It handles the data, the AI, and the hacker simulations.

* **`/dataset` folder**: Holds the massive OULAD (Open University Learning Analytics Dataset) `.csv` files.
* **`preprocessing/preprocess.py`**: The data cleaner. Raw student clicks are messy. This script filters out all clicks that happened *after* 90 days, mathematically encodes text (like Gender: M/F) into numbers (0/1), and saves the clean data into a fast `data_splits.npz` file.
* **`models/train.py`**: The trainer. This script loads the clean data and teaches a Logistic Regression model how to predict if a student will Pass or Fail based on their Day-90 clicks. It saves the brain into `baseline_model.pkl`.
* **`privacy/protected_model.py`**: The shield. This trains a second AI model, but applies heavy **L2 Regularization** to the math. This prevents the AI from memorizing individual student data, granting it "Empirical Privacy."
* **`attacks/membership_attack.py`**: The Hacker. This script pretends to be an attacker performing a **Membership Inference Attack (MIA)**. It tries to guess if a specific student was used in the training data. Because of our L2 Regularization, the hacker fails (achieving a near-perfect Privacy Utility score of 0.99).
* **`main.py`**: The Web Server. This uses **FastAPI** to wrap your `.pkl` AI models into a web API. It constantly listens on port `8001`. When Node.js asks it for a prediction, `main.py` loads the AI, calculates the Pass/Fail probability, and replies.

### D. The Submission Docs (`/ed03_submission`)
These are the files the hackathon judges specifically requested.

* **`utility_privacy_results.md`**: A table showing that our AI achieves ~73% accuracy (Utility) and 0.99 Privacy.
* **`privacy_claims_note.md`**: Our official statement acknowledging that while our L2 Regularization strongly defends against hackers (Empirical Privacy), it is not strict Formal Differential Privacy (which requires DP-SGD noise injection).

---

## 🎯 3. How to Present to the Judges

When you present, follow this story:

1. **The Problem:** Explain that predicting student failure is great, but training AI on student data creates a massive privacy risk where hackers can steal student records.
2. **The Solution:** Show them the React dashboard. Explain that your team built a highly accurate predictive AI, but protected it using Mathematical Regularization.
3. **The Proof:** Show them the Privacy Dashboard. Explain that you literally coded a Hacker script (`membership_attack.py`) to attack your own AI, and the Hacker failed. 
4. **The Demo:** Search for `STU-1001` in the dashboard, hit Predict, and show the judges how React smoothly asks Node, Node asks Python, and the AI correctly identifies the student as High Risk.
