#   React build stage
FROM node:16 as react-build

WORKDIR /app

COPY package.json /app/

ARG NPM_AUTH_TOKEN

RUN echo "//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN" > .npmrc

RUN yarn install

COPY . /app/

CMD yarn serve