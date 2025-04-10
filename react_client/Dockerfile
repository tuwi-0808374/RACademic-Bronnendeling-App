FROM ubuntu

RUN apt install npm -y
RUN apt install nodejs -y

RUN npm install -g yarn

RUN npm install -g react-native-cli


WORKDIR /app

COPY package*.json ./

ENV PORT=5000 8081
EXPOSE 5000 8081

COPY . .

CMD ["npm", "start"]