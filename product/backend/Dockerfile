FROM node:20-alpine

WORKDIR /app

# 依存コピー
COPY package*.json ./

RUN npm install

# ソースコピー
COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
