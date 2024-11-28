import pandas as pd
import pickle
import sys
import json

# Load the trained model
with open('performance_model.pkl', 'rb') as f:
    model = pickle.load(f)

# Load input data
data = json.loads(sys.stdin.read())
df = pd.DataFrame(data)

# Define features
features = ['attendanceRate', 'averageScore', 'totalExams', 'totalAssignments']
X = df[features]

# Make predictions
df['predictedPerformance'] = model.predict(X)

# Output predictions
print(df[['studentId', 'predictedPerformance']].to_json(orient='records'))
