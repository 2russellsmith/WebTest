# base image
FROM node:erbium-alpine

WORKDIR /app

COPY ./frontend /app

#Python is not included in the image. This is needed to run node-sass build
RUN apk add g++ make python
RUN yarn add global @vue/cli
RUN yarn


EXPOSE 8080

CMD ["yarn", "serve"]
