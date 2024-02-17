FROM node:latest

USER node
WORKDIR /home/node/karaoke
COPY ./package.json ./
RUN yarn global add create-react-app \
    && yarn install
COPY . .
