//リクエスト処理
import { Request, Response } from "express";
import multer from "multer";
import { createFromAudio } from "../services/message.service";
import {getChatHistory} from "../services/message.service";

import { ReactResponseAudioDTO } from "../dto/react.dto";

//UUID生成
const upload = multer({ dest: "uploads/" });

//ファイルアップロードのミドルウェア
export const uploadMiddleware = upload.single("file");

//音声ファイルからメッセージを作成するコントローラー
export async function createAudioMessage(
  req: Request,
  res: Response
) {
  try {
    const { senderId, receiverId } = req.body;
    //reqのうけとり->service(createFromAudio)の呼び出し
    const result = await createFromAudio(
      senderId,
      receiverId,
      req.file!.path
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Audio processing failed" });
  }
}

//ユーザー間のメッセージを取得するコントローラー
export async function getMessages(
  req: Request,
  res: Response){
    //クエリパラメータからユーザーIDを取得
    try{
      const{userId1,userId2} = req.query;

      if(!userId1 || !userId2){
        return res.status(400).json({error:"Missing userId1 or userId2"});
      }

      //service(getChatHistory)の呼び出し
      const messages = await getChatHistory(userId1 as string, userId2 as string);
      res.json(messages);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to retrieve messages" });
    }
  }

  //オーディオのメッセージが入力された場合
  export async function sendAudioMessage(req:Request,res:Response){
    try{
      const body:ReactResponseAudioDTO = req.body;

      if(!req.file){
        return res.status(400).json({error:"Audio file required"});
      }

      const message = await createFromAudio(
        body.senderId,
        body.receiverId,
        req.file.path
      );

      res.json(message);

    }catch(err){
      console.error(err);
      res.status(500).json({error:"Internal error"});
    }
  }