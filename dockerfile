FROM node:lts-alpine3.22

WORKDIR /app

COPY . .

RUN npm install

# RUN npm run db:generate


EXPOSE 3333

# CMD ["npm", "run", "dev"]