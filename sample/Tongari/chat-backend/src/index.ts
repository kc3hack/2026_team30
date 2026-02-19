//ここがエントリーポイントです。Expressサーバーを立ち上げてルートを登録します。
import express from 'express';
import cors from 'cors';
import messageRoutes from './routes/message.route';


//Express初期化
const app = express();

app.use(cors());
app.use(express.json());


//ルート登録
app.use('/api/messages', messageRoutes);

//サーバー起動
app.listen(3001, () => {
  console.log(`Server is running on port 3001`);
});