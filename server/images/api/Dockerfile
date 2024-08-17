FROM node:latest

WORKDIR /usr/app

COPY package*.json ./

RUN npm install --quiet

RUN apt-get update && apt-get install -y postgresql-client

COPY . .

CMD ["npm", "run", "go"]