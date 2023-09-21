# F:\pitt\pat-green\backend\data\strava_api.py
from fastapi import FastAPI
import json

app = FastAPI()

@app.on_event("startup")
async def load_data():
    global strava_data
    json_file_path = "F:/pitt/pat-green/backend/data/strava_data.json"
    with open(json_file_path, 'r') as f:
        strava_data = json.load(f)

@app.get("/strava")
async def get_strava_data():
    return strava_data