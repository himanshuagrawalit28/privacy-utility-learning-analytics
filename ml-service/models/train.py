import numpy as np
import os
import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import balanced_accuracy_score, roc_auc_score

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_DIR = os.path.join(BASE_DIR, 'dataset')
MODELS_DIR = os.path.join(BASE_DIR, 'models')

def train_and_evaluate_baseline():
    print("Loading preprocessed data splits...")
    data_path = os.path.join(DATASET_DIR, 'data_splits.npz')
    
    if not os.path.exists(data_path):
        raise FileNotFoundError("Data splits not found. Please run preprocessing/preprocess.py first.")
        
    data = np.load(data_path)
    X_train = data['X_train']
    y_train = data['y_train']
    X_val = data['X_val']
    y_val = data['y_val']
    
    print("Training Baseline Model (Logistic Regression)...")
    # Using Logistic Regression as the baseline classifier
    model = LogisticRegression(max_iter=1000, random_state=42)
    model.fit(X_train, y_train)
    
    print("Evaluating on Validation Set...")
    # Predict probabilities and classes
    y_val_pred = model.predict(X_val)
    y_val_proba = model.predict_proba(X_val)[:, 1] # Probability of Class 1 (Pass)
    
    # Calculate Metrics
    bal_acc = balanced_accuracy_score(y_val, y_val_pred)
    auroc = roc_auc_score(y_val, y_val_proba)
    
    # Upred calculation as per ED-03 guidelines
    u_pred = 0.5 * bal_acc + 0.5 * auroc
    
    print("-" * 30)
    print("Baseline Model Performance:")
    print(f"Balanced Accuracy : {bal_acc:.4f}")
    print(f"AUROC             : {auroc:.4f}")
    print(f"U_pred (Utility)  : {u_pred:.4f}")
    print("-" * 30)
    
    # Save the model
    model_path = os.path.join(MODELS_DIR, 'baseline_model.pkl')
    joblib.dump(model, model_path)
    print(f"Baseline model saved to {model_path}")

if __name__ == "__main__":
    train_and_evaluate_baseline()
