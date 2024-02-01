FROM node:20-alpine

WORKDIR /usr/src/myapp

COPY package.json package-lock.json ./

RUN npm install

COPY ./prisma ./prisma

RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
