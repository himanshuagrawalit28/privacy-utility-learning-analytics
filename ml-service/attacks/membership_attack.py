import numpy as np
import os
import joblib
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_DIR = os.path.join(BASE_DIR, 'dataset')
MODELS_DIR = os.path.join(BASE_DIR, 'models')

def get_attack_features(model, X, y):
    # Predict probabilities for the TRUE class
    probs = model.predict_proba(X)
    
    # Calculate probability of the true class
    true_class_probs = []
    # y can be a pandas series or numpy array
    y_array = np.array(y)
    for i in range(len(y_array)):
        # If true class is 1, get prob of 1. If 0, get prob of 0.
        class_idx = int(y_array[i])
        true_class_probs.append(probs[i, class_idx])
    
    true_class_probs = np.array(true_class_probs)
    
    # Binary correctness (1 if correct, 0 if wrong)
    preds = model.predict(X)
    correctness = (preds == y_array).astype(int)
    
    # Return as shape (N, 2)
    return np.column_stack((true_class_probs, correctness))

def run_membership_attack(target_model, model_name, X_train, y_train, X_test, y_test):
    print(f"\n--- Running Membership Attack on {model_name} ---")
    
    # 1. Generate attack features for Members (Train set)
    members_features = get_attack_features(target_model, X_train, y_train)
    members_labels = np.ones(len(members_features)) # 1 = seen in training
    
    # 2. Generate attack features for Non-Members (Test set)
    non_members_features = get_attack_features(target_model, X_test, y_test)
    non_members_labels = np.zeros(len(non_members_features)) # 0 = not seen
    
    # 3. Create a class-balanced dataset for the attack model
    # We must sample so members and non-members are exactly equal
    min_size = min(len(members_features), len(non_members_features))
    
    # Randomly sample to balance
    np.random.seed(42)
    idx_members = np.random.choice(len(members_features), min_size, replace=False)
    idx_non_members = np.random.choice(len(non_members_features), min_size, replace=False)
    
    attack_X = np.vstack((members_features[idx_members], non_members_features[idx_non_members]))
    attack_y = np.concatenate((members_labels[idx_members], non_members_labels[idx_non_members]))
    
    # Attack train-test split (50/50 for the attack evaluation)
    from sklearn.model_selection import train_test_split
    att_X_train, att_X_test, att_y_train, att_y_test = train_test_split(
        attack_X, attack_y, test_size=0.5, random_state=42, stratify=attack_y
    )
    
    # 4. Train Attack Model (strictly per ED-03 guidelines)
    attack_model = LogisticRegression(solver="liblinear", max_iter=1000, random_state=20260911)
    attack_model.fit(att_X_train, att_y_train)
    
    # 5. Evaluate Attack on the held-out attack test set
    att_probs = attack_model.predict_proba(att_X_test)[:, 1]
    attack_auc = roc_auc_score(att_y_test, att_probs)
    
    # Effective attack AUC formula from ED-03
    a_eff = max(attack_auc, 1 - attack_auc)
    
    # Privacy Utility formula from ED-03
    u_privacy = max(0, 2 * (1 - a_eff))
    
    print(f"Attack AUC (A)           : {attack_auc:.4f}")
    print(f"Effective Attack (A_eff) : {a_eff:.4f}")
    print(f"Privacy Utility (U_priv) : {u_privacy:.4f}")
    
    return u_privacy

def main():
    print("Loading datasets and models for Membership Inference Attack...")
    # Load Data
    data_path = os.path.join(DATASET_DIR, 'data_splits.npz')
    data = np.load(data_path)
    X_train, y_train = data['X_train'], data['y_train']
    X_test, y_test = data['X_test'], data['y_test'] # Using test set as the non-member audit partition
    
    # Load Models
    baseline_model = joblib.load(os.path.join(MODELS_DIR, 'baseline_model.pkl'))
    protected_model = joblib.load(os.path.join(MODELS_DIR, 'protected_model.pkl'))
    
    # Run Attack on Baseline
    u_priv_base = run_membership_attack(baseline_model, "Baseline Model", X_train, y_train, X_test, y_test)
    
    # Run Attack on Protected
    u_priv_prot = run_membership_attack(protected_model, "Protected Model", X_train, y_train, X_test, y_test)
    
    print("\n" + "="*40)
    print("FINAL PRIVACY RESULTS")
    print("="*40)
    print(f"Baseline Model Privacy Score : {u_priv_base:.4f}")
    print(f"Protected Model Privacy Score: {u_priv_prot:.4f}")
    print("="*40)
    
    if u_priv_prot > u_priv_base:
        print("[SUCCESS] The Protected Model has better privacy than the Baseline.")
    else:
        print("[WARNING] The Protected Model did not improve privacy.")

if __name__ == "__main__":
    main()
