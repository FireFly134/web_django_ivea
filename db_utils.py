from sqlalchemy import create_engine

from taskmanager import settings

url = (
    "postgresql"
    + f"://{settings.POSTGRES_USER}"
    + f":{settings.POSTGRES_PASSWORD}"
    + f"@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}"
    + f"/{settings.POSTGRES_DB}"
)

engine = create_engine(url)
