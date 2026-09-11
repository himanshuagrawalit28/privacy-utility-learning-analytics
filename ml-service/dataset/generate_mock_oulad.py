import pandas as pd
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def generate_mock_data(num_students=1000):
    print("Generating mock OULAD dataset for testing...")
    
    # 1. studentInfo.csv
    np.random.seed(42)
    id_students = np.arange(1, num_students + 1)
    
    info_df = pd.DataFrame({
        'code_module': np.random.choice(['AAA', 'BBB', 'CCC'], num_students),
        'code_presentation': np.random.choice(['2013J', '2014B', '2014J'], num_students),
        'id_student': id_students,
        'gender': np.random.choice(['M', 'F'], num_students),
        'region': np.random.choice(['London', 'Scotland', 'Wales'], num_students),
        'highest_education': np.random.choice(['HE Qualification', 'A Level or Equivalent', 'Lower Than A Level'], num_students),
        'imd_band': np.random.choice(['0-10%', '10-20', '20-30%'], num_students),
        'age_band': np.random.choice(['0-35', '35-55', '55<='], num_students),
        'num_of_prev_attempts': np.random.randint(0, 3, num_students),
        'studied_credits': np.random.randint(30, 120, num_students),
        'disability': np.random.choice(['Y', 'N'], num_students, p=[0.1, 0.9]),
        'final_result': np.random.choice(['Pass', 'Fail', 'Withdrawn', 'Distinction'], num_students, p=[0.4, 0.3, 0.2, 0.1])
    })
    info_df.to_csv(os.path.join(BASE_DIR, 'studentInfo.csv'), index=False)
    
    # 2. studentAssessment.csv
    # Multiple assessments per student
    assessments = []
    for sid in id_students:
        num_assess = np.random.randint(1, 5)
        for _ in range(num_assess):
            assessments.append({
                'id_assessment': np.random.randint(1000, 2000),
                'id_student': sid,
                'date_submitted': np.random.randint(10, 250), # Days
                'is_banked': 0,
                'score': np.random.randint(30, 100)
            })
    assess_df = pd.DataFrame(assessments)
    assess_df.to_csv(os.path.join(BASE_DIR, 'studentAssessment.csv'), index=False)
    
    # 3. studentVle.csv
    # Multiple VLE clicks per student
    vles = []
    for i in range(len(info_df)):
        row = info_df.iloc[i]
        num_clicks = np.random.randint(5, 50)
        for _ in range(num_clicks):
            vles.append({
                'code_module': row['code_module'],
                'code_presentation': row['code_presentation'],
                'id_student': row['id_student'],
                'id_site': np.random.randint(10000, 20000),
                'date': np.random.randint(-20, 250), # Can be before course start
                'sum_click': np.random.randint(1, 10)
            })
    vle_df = pd.DataFrame(vles)
    vle_df.to_csv(os.path.join(BASE_DIR, 'studentVle.csv'), index=False)
    
    print(f"Mock data created successfully in {BASE_DIR}")

if __name__ == "__main__":
    generate_mock_data()
