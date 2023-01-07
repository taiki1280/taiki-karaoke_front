FROM node:18.12-alpine
WORKDIR /karaoke
COPY ./package.json ./
RUN yarn global add create-react-app \
    && yarn install
COPY . .
