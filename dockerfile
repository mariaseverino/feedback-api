FROM node:lts-alpine3.22

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3333

CMD ["npm", "run", "dev"]