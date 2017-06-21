FROM node:8.1.2

ENV app /deploy/
RUN mkdir -p $app

WORKDIR $app

COPY package.json /deploy/package.json

RUN npm install
