FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npm install @nestjs/microservices --save

COPY . .

RUN npm run build

CMD ["npm", "run", "start:dev"]
