FROM ubuntu

RUN apt install npm -y
RUN apt install nodejs -y

RUN npm install -g yarn

RUN npm install -g react-native-cli


WORKDIR /app

COPY . .

EXPOSE 5000 8081

CMD ["bash", "-c", "yarn start --host 0.0.0.0"]