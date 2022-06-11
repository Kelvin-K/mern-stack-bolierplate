FROM node:17

WORKDIR /usr/src/app

COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

RUN npm install

COPY . .

RUN npm run build 

EXPOSE 9000

CMD [ "npm", "run" , "start"]