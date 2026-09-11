from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
import os
import json

app = FastAPI(title="ED-03 Privacy Learning Analytics API")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')

# Global variables for models
preprocessor = None
baseline_model = None
protected_model = None

# Pydantic model for request validation
class StudentData(BaseModel):
    gender: str
    region: str
    highest_education: str
    imd_band: str
    age_band: str
    num_of_prev_attempts: int
    studied_credits: int
    disability: str
    total_clicks_day90: float
    avg_score_day90: float

@app.on_event("startup")
def load_models():
    global preprocessor, baseline_model, protected_model
    try:
        preprocessor = joblib.load(os.path.join(MODELS_DIR, 'preprocessor.pkl'))
        baseline_model = joblib.load(os.path.join(MODELS_DIR, 'baseline_model.pkl'))
        # Protected model will be loaded here once implemented
        protected_model_path = os.path.join(MODELS_DIR, 'protected_model.pkl')
        if os.path.exists(protected_model_path):
            protected_model = joblib.load(protected_model_path)
        print("Models loaded successfully.")
    except Exception as e:
        print(f"Warning: Models not fully loaded. {e}")

@app.get("/")
def read_root():
    return {"message": "Welcome to ED-03 Privacy Learning Analytics API"}

@app.post("/predict")
def predict_student(student: StudentData):
    if preprocessor is None or baseline_model is None:
        raise HTTPException(status_code=500, detail="Models are not loaded.")
        
    # Convert input to DataFrame
    df = pd.DataFrame([student.model_dump()])
    
    # Preprocess
    X_processed = preprocessor.transform(df)
    
    # Predict using Baseline
    base_pred = baseline_model.predict(X_processed)[0]
    base_prob = baseline_model.predict_proba(X_processed)[0][1]
    
    # Predict using Protected (if available)
    prot_pred, prot_prob = None, None
    if protected_model is not None:
        prot_pred = protected_model.predict(X_processed)[0]
        prot_prob = protected_model.predict_proba(X_processed)[0][1]
        
    return {
        "baseline_model": {
            "prediction": "Pass" if base_pred == 1 else "Fail/Withdrawn",
            "probability": float(base_prob)
        },
        "protected_model": {
            "prediction": "Pass" if prot_pred == 1 else "Fail/Withdrawn" if prot_pred is not None else None,
            "probability": float(prot_prob) if prot_prob is not None else None
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
