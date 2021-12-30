FROM node:16

WORKDIR /app

RUN mkdir /app/data && chown node /app/data

COPY ./package* ./

RUN npm install

COPY . ./

RUN npm run build

USER node

CMD ["npm", "start"]
