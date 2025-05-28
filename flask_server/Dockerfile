FROM python:3.12-slim

WORKDIR ./flask_server/

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .

ENV FLASK_APP=main.py

EXPOSE 8000

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]