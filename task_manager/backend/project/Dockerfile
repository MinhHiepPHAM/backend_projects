FROM python:3.8.10-slim

ENV PYTHONUNBUFFERED=1

RUN pip install --upgrade pip

WORKDIR /backend

RUN pip install django django-cors-headers
RUN apt-get update \
    && apt-get -y install libpq-dev gcc \
    && pip install psycopg2

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000