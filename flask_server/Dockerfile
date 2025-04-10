FROM ubuntu

RUN apt update
RUN apt install python3-pip -y

WORKDIR /app

COPY requirements*.txt ./

RUN pip3 install -r requirements*.txt

CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0"]
