FROM node:20

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./
RUN npm ci

RUN npx playwright install --with-deps
