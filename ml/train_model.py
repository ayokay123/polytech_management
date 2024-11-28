import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import pickle
import sys
import json

# Load input data
data = json.loads(sys.stdin.read())
df = pd.DataFrame(data)

# Features and target definition
features = ['attendanceRate', 'averageScore', 'totalExams', 'totalAssignments']
target = 'performance'

# Simulate a target if it's not provided
if target not in df:
    df[target] = (
        df['attendanceRate'] * 0.4 +
        (df['averageScore'] / 10) * 0.5 +  # Scale averageScore to a 0-10 range
        df['totalExams'] * 0.05 +
        df['totalAssignments'] * 0.05
    )

X = df[features]
y = df[target]

# Train model
model = RandomForestRegressor(random_state=42, n_estimators=100, max_depth=10, min_samples_leaf=5, max_features="sqrt")
model.fit(X, y)

# Save the model
with open('performance_model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("Model trained successfully.")
