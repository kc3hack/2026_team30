//リクエスト処理
import { Request, Response } from "express";
import multer from "multer";
import { createFromAudio } from "../services/message.service";

const upload = multer({ dest: "uploads/" });

export const uploadMiddleware = upload.single("file");

export async function createAudioMessage(
  req: Request,
  res: Response
) {
    
  try {
    const { senderId, receiverId } = req.body;
    //reqのうけとり->serviceの呼び出し
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