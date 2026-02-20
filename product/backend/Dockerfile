FROM node:20-alpine

WORKDIR /app

# package.json をコピーして依存関係インストール
COPY package*.json ./
RUN npm install
RUN npm install pg @types/pg -D


# 残りのファイルをコピー
COPY . .

EXPOSE 3001

# NestJSをウォッチモードで起動
CMD ["npm", "run", "start:dev"]
