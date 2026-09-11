import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_DIR = os.path.join(BASE_DIR, 'dataset')
MODELS_DIR = os.path.join(BASE_DIR, 'models')

def load_and_preprocess_oulad(day_cutoff=90):
    print("Loading OULAD data...")
    
    # Check if files exist
    info_path = os.path.join(DATASET_DIR, 'studentInfo.csv')
    vle_path = os.path.join(DATASET_DIR, 'studentVle.csv')
    assess_path = os.path.join(DATASET_DIR, 'studentAssessment.csv')
    
    if not all(os.path.exists(p) for p in [info_path, vle_path, assess_path]):
        raise FileNotFoundError(f"Dataset files not found in {DATASET_DIR}. Please add studentInfo.csv, studentVle.csv, and studentAssessment.csv")

    # Load static info
    info = pd.read_csv(info_path)
    
    # 1. Target Variable Definition
    # Pass and Distinction = 1, Fail and Withdrawn = 0
    info['target'] = info['final_result'].map({'Pass': 1, 'Distinction': 1, 'Fail': 0, 'Withdrawn': 0})
    info = info.dropna(subset=['target'])
    
    # 2. VLE (Clicks) Day-90 Feature
    vle = pd.read_csv(vle_path)
    vle_day90 = vle[vle['date'] <= day_cutoff]
    clicks_per_student = vle_day90.groupby(['code_module', 'code_presentation', 'id_student'])['sum_click'].sum().reset_index()
    clicks_per_student.rename(columns={'sum_click': 'total_clicks_day90'}, inplace=True)
    
    # 3. Assessment Day-90 Feature
    assess = pd.read_csv(assess_path)
    assess_day90 = assess[assess['date_submitted'] <= day_cutoff]
    score_per_student = assess_day90.groupby('id_student')['score'].mean().reset_index()
    score_per_student.rename(columns={'score': 'avg_score_day90'}, inplace=True)
    
    # Merge features
    df = info.merge(clicks_per_student, on=['code_module', 'code_presentation', 'id_student'], how='left')
    df = df.merge(score_per_student, on='id_student', how='left')
    
    # Fill NaN for students with 0 clicks or assessments
    df['total_clicks_day90'] = df['total_clicks_day90'].fillna(0)
    
    # Select features for training
    features = [
        'gender', 'region', 'highest_education', 'imd_band', 
        'age_band', 'num_of_prev_attempts', 'studied_credits', 'disability',
        'total_clicks_day90', 'avg_score_day90'
    ]
    
    X = df[features]
    y = df['target']
    
    print(f"Data processed: {len(X)} records found.")
    return X, y, df

def build_and_save_pipeline(X, y):
    print("Splitting data and building preprocessing pipeline...")
    
    # 1. Data Splitting: Disjoint train, validation, and test partitions
    # 60% Train, 20% Val, 20% Test
    X_temp, X_test, y_temp, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    X_train, X_val, y_train, y_val = train_test_split(X_temp, y_temp, test_size=0.25, random_state=42, stratify=y_temp)
    
    print(f"Train size: {len(X_train)}, Val size: {len(X_val)}, Test size: {len(X_test)}")
    
    # 2. Define Columns by Type
    numeric_features = ['num_of_prev_attempts', 'studied_credits', 'total_clicks_day90', 'avg_score_day90']
    categorical_features = ['gender', 'region', 'highest_education', 'imd_band', 'age_band', 'disability']
    
    # 3. Create Preprocessing Pipeline
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ])
    
    # 4. Fit ON TRAINING SET ONLY
    print("Fitting preprocessor on training data...")
    X_train_processed = preprocessor.fit_transform(X_train)
    X_val_processed = preprocessor.transform(X_val)
    X_test_processed = preprocessor.transform(X_test)
    
    # 5. Save preprocessor and splits
    joblib.dump(preprocessor, os.path.join(MODELS_DIR, 'preprocessor.pkl'))
    
    # Save the splits to disk so they can be loaded by Phase 2
    np.savez(os.path.join(DATASET_DIR, 'data_splits.npz'), 
             X_train=X_train_processed, y_train=y_train,
             X_val=X_val_processed, y_val=y_val,
             X_test=X_test_processed, y_test=y_test)
             
    print("Preprocessing completed. Preprocessor and splits saved to disk.")

if __name__ == "__main__":
    X, y, raw_df = load_and_preprocess_oulad(day_cutoff=90)
    build_and_save_pipeline(X, y)
