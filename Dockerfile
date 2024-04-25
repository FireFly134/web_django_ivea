FROM python:3.11-alpine

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /code

RUN pip install pipenv
COPY Pipfile /code/
COPY Pipfile.lock /code/

RUN pipenv install --system --dev --deploy

COPY . /code/
RUN chmod u+x entrypoint.sh