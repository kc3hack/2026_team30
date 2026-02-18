# Nodejsによるバックエンドです

## レイヤードアーキテクチャとして実装しています

- Route  
    URLと処理を結びつける  
    post/audioが来たら、controllerを呼ぶ

- Controller  
    req/resを触る  
    serviceを呼ぶ

- Service  
    Pythonを呼ぶ  
    Entityの組み立て  
    Repositoryに値を渡す

- DTO  
    外部APIの型定義

- Entity  
    DBに保存されるデータ構造

- Repository  
    DB操作(SQL)

## 使用方法

sample\Tongari\chat-backend\srcでnpx nodemon index.tsと打ったらサーバが起動します。

## パッケージ

- express

- nodemon

- axios

- cors

- uuid

- dotenv
