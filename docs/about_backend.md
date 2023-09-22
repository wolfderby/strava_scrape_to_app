cd to /backend

run 

```sh
conda activate patronus_viz_env
uvicorn data.strava_api:app --host 127.0.0.1 --reload --log-level debug

