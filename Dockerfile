FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
COPY start.sh .
RUN chmod +x start.sh

EXPOSE 3000

CMD ["./start.sh"]