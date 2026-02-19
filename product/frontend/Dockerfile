FROM node:20

WORKDIR /app

# 依存関係コピー
COPY package*.json ./

RUN npm install

# ソースコピー
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
