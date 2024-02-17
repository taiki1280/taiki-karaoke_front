FROM node:latest
WORKDIR /karaoke
COPY ./package.json ./
RUN yarn global add create-react-app \
    && yarn install
COPY . .
