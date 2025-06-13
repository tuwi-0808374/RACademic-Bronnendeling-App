FROM python:3.12-slim

WORKDIR /flask_server

COPY ./ /flask_server/

RUN pip install -r requirements.txt
RUN mkdir -p databases
RUN python3 lib/databasegenerator.py

ENV FLASK_APP=main.py

EXPOSE 5000

CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0"]

# Stappen voor om alleen deze dockerfile te draaien:
# Dit uitvoeren als je in de map bent waar dit bestand staat
# docker build -t flask_server .
# docker run -p 5000:5000 flask_server