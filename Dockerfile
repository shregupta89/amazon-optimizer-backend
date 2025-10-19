FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5001

CMD ["sh", "-c", "npm run db:dev && npm run dev"]
