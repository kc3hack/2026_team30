# Product (プロダクト)

このフォルダは本プロジェクトのコンテナ化されたプロダクト構成を含みます。バックエンド、感情解析API、フロントエンドの3つの主要サービスで構成され、Docker Composeでまとめて立ち上げられます。

## 目次
- 概要
- ディレクトリ構成
- 必要条件
- クイックスタート
- 個別サービスのローカル実行
- 環境変数とポート
- トラブルシューティング

## 概要
- `backend/`: Node.js ベースのAPIサーバー（`server.js`）。
- `emotion-api/`: Python ベースの感情解析サービス（`app/main.py` など）。
- `frontend/`: フロントエンド（Vite + React/TypeScript ベース）。

## ディレクトリ構成（抜粋）
- `backend/` - `server.js`, `package.json` を含むバックエンド
- `emotion-api/` - `app/` に Python アプリ（`main.py`, `sentimental.py`, `transcription.py`）
- `frontend/` - フロントエンドのソースと Dockerfile

## 必要条件
- Docker
- Docker Compose（Docker Desktop に同梱）

## クイックスタート（推奨）
1. このディレクトリに移動します:

```
cd product
```

2. 全サービスをビルドして起動します:

```bash
docker compose up --build
```

3. 停止してリソースを削除するには:

```bash
docker compose down
```

起動後、各サービスは以下のポートでアクセス可能です（デフォルト設定）：
- フロントエンド: http://localhost:5173
- バックエンド: http://localhost:3000
- 感情解析API: http://localhost:8000

（注）ポートは `docker-compose.yml` の公開設定に依存します。必要に応じてファイルを確認してください。

## 個別サービスのローカル実行
### Backend
```
cd backend
npm install
node server.js
```

### Emotion API (Python)
```
cd emotion-api
python -m venv .venv    # 任意
.venv\Scripts\activate  # Windows の場合
pip install -r requirements.txt
python app/main.py
```

### Frontend
```
cd frontend
npm install
npm run dev
```

## 環境変数
- 各サービスに必要な環境変数は、それぞれのフォルダ内の `README.md` または `Dockerfile` を参照してください。

## テスト・デバッグ
- 簡易的なエンドポイント確認は `curl` や Postman、ブラウザで行ってください。サンプルやテストスクリプトがある場合は各サブフォルダ内を参照します。

## トラブルシューティング
- コンテナがビルドできない／起動しない場合は、ログを確認してください:

```bash
docker compose logs --follow
```

- ポート競合がある場合は、ローカルで稼働中の同ポートのプロセスを停止するか、`docker-compose.yml` のポート設定を変更してください。

## 貢献・問い合わせ
- 変更や修正提案がある場合はリポジトリにプルリクエストを作成してください。質問がある場合は担当者に連絡してください。

---

必要に応じて内容を調整します。個々のサービスの詳しい起動手順や環境変数をREADMEに追加しますか？