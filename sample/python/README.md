# Pythonの検証用フォルダ

## 課題
チャットって感情が分かりにくい

## 作りたいもの
- 音声入力を基に感情を反映させたメッセージの作成
- 色や文字の大きさ、フォントなど
- 議事録でも会場の雰囲気を確認

## 作成するサンプル
- サンプルAPI(音声読み込み、サンプルデータの送信)
- 音声入力→テキスト変換、感情パラメータ作成、声量分析
- テキストデータとパラメータの連結

## サンプル1:APIの土台
### 使用ファイル
- index.html
- app.py
### 使用手順
1. wavファイルを用意
2. `uvicorn app:app --reload` でAPIサーバーを起動(venv起動済み)
3. index.htmlを開きファイルを選択
4. ダミーのjsonデータが渡され表示される
### 実装、未実装
#### 実装済み
- 平均的な声の大きさ
- 音の高さ
- 平均ピッチ
#### 未実装
- 感情変換
- テキスト化
### 今後の活用方法
- wavファイルから音声入力へ
- ダミーデータから音声分析後データへ

# 音声感情分析API

## 概要
音声ファイルを入力として、以下の分析を行うWebアプリケーション：
- **文字起こし**（Whisper を使用）
- **感情推測**（音量・ピッチから簡易推測）
- **音声特徴量**（声量・ピッチ値）

## 使用技術
- **FastAPI** - Web フレームワーク
- **Whisper** - 音声文字起こし（OpenAI）
- **Librosa** - 音声処理
- **Docker & Docker Compose** - 環境構築・実行

---

## 📦 インストール & 起動

### 方法1: Docker（推奨）
Docker と Docker Compose がインストール済みの状態で実行：

```bash
# フォルダに移動
cd sample/python

# Docker コンテナをビルド & 起動（2サービス: api + speechbrain）
docker compose up --build -d

# 起動完了確認
docker compose ps

# ブラウザで以下にアクセス
# http://localhost:8000  （フロントエンド）
# SpeechBrain API: http://localhost:8001/health
```

### 方法2: ローカル venv（開発用）vertion違いで動かない可能性あり
```bash
# フォルダに移動
cd sample/python

# 仮想環境の作成（初回のみ）
python -m venv venv

# 仮想環境の起動
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 依存パッケージのインストール
pip install -r requirements.txt

# Whisper モデルの事前ダウンロード（初回のみ）
python -c "import whisper; whisper.load_model('base')"

# API サーバーの起動
uvicorn app:app --reload --host 0.0.0.0 --port 8000

# ブラウザで以下にアクセス
# http://localhost:8000
```

---

## 🎯 使い方

1. **ブラウザで http://localhost:8000 にアクセス**
   - `index.html` の UI が表示されます

## 🏗 サービス構成（重要）
- `api` (ポート 8000) : フロントエンド + 文字起こし、音声解析を提供します。
- `speechbrain` (ポート 8001) : SpeechBrain を利用した感情分類を担当するマイクロサービス。

`api` は内部で `http://speechbrain:8001/classify/` に POST して感情を取得します（Docker Compose 内のサービス名で到達）。

2. **音声ファイルをアップロード**
   - WAV形式の音声ファイルを選択
   - または `audio/asano.wav` を使ってテスト可能

3. **結果確認**
   - 文字起こしテキストが表示
   - 感情（joy/anger/sadness）に応じて色・文字サイズが変化

---

## 📡 API エンドポイント

### POST `/analyze/`
音声ファイルをアップロードして分析

**Request:**
```bash
curl -F "file=@audio/asano.wav" http://localhost:8000/analyze/
```

**Response:**
```json
{
  "speaker_id": "user_01",
  "audio_file": "asano.wav",
  "transcription": [
    {
      "timestamp": "00:00:00",
      "text": "文字起こし結果",
      "emotion_label": "happy",
      "emotion_confidence": 0.7,
      "emotion": {
        "joy": 0.7,
        "anger": 0.0,
        "sadness": 0.0
      },
      "volume": 0.039,
      "pitch": 1428.97
    }
  ]
}
```

### GET `/health`
ヘルスチェック

```bash
curl http://localhost:8000/health
```

### GET `/docs`
API ドキュメント（Swagger UI）

```
http://localhost:8000/docs
```

---

## 🛑 終了方法

### Docker の場合
```bash
docker compose down
```

### ローカル venv の場合
```bash
# ターミナルで Ctrl+C を押す
# その後、仮想環境から抜ける
deactivate
```

---

## 📝 ファイル構成

```
sample/python/
├── app.py                  # FastAPI メインアプリケーション
├── index.html              # Web UI（HTML）
├── requirements.txt        # Python 依存パッケージ
├── Dockerfile              # Docker イメージ定義
├── docker-compose.yml      # Docker Compose 設定
├── audio/                  # サンプル音声ファイル
│   └── asano.wav
├── tmp_emotion_model/      # モデル キャッシュ（初回生成）
└── README.md              # このファイル
```

---

## ⚙️ 設定・カスタマイズ

### Whisper モデルの変更
`app.py` の以下の行を編集：
```python
whisper_model = whisper.load_model("base")  # "base" の部分を変更
```

可能なモデル： `tiny`, `base`, `small`, `medium`, `large`

### 感情認識ロジック
`app.py` の `analyze_emotion()` 関数を修正  
現在は遅延ロジック（ピッチ・音量ベース）です

---

## 🐛 トラブルシューティング

### Port 8000 がすでに使われている場合

**Docker の場合:**
```bash
docker compose down  # 既存コンテナを停止
docker compose up --build -d
```

**ローカル venv の場合:**
```bash
# 別のポートで起動
uvicorn app:app --port 8001
# http://localhost:8001 にアクセス
```

### Whisper の初回ロード時が遅い
- 初回はモデル（~150MB）をダウンロードしたキャッシュに保存
- 2回目以降は高速化されます

### Docker ビルドに失敗する場合
```bash
# キャッシュをクリアして再ビルド
docker compose down
docker system prune -a
docker compose up --build -d
```

---

## 📚 参考リンク

- [FastAPI 公式ドキュメント](https://fastapi.tiangolo.com/)
- [OpenAI Whisper GitHub](https://github.com/openai/whisper)
- [Librosa ドキュメント](https://librosa.org/)
- [Docker & Docker Compose](https://docs.docker.com/)

---

## 📌 今後の改善予定

- [ ] リアルタイム音声入力対応
- [ ] より精密な感情認識モデル（SpeechBrain 統合）
- [ ] 議事録機能の追加
- [ ] フロントエンドの UI 改善
- [ ] 複数言語対応