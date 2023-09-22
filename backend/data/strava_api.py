# D:\pitt\test-vite-app-3\backend\data\strava_api.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import json

app = FastAPI()

origins = [
    "http://localhost:5173",  # React frontend
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello, World"}


@app.on_event("startup")
async def load_data():
    global strava_data
    # json_file_path = "D:/pitt/pat-green/backend/data/strava_data.json"
    json_file_path = "D:/pitt/test-vite-app-3/backend/data/strava_data.json"
    with open(json_file_path, 'r') as f:
        strava_data = json.load(f)

@app.get("/strava")
async def get_strava_data():
    return strava_data