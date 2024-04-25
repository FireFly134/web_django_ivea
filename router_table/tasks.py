from taskmanager.celery import app

from .utils import update_stations_in_db


@app.task
def update_stations_in_db_task() -> None:
    update_stations_in_db()


app.add_periodic_task(
    5.0 * 60,
    update_stations_in_db_task,
    name="update station connection every 5 min (router_table)",
)
