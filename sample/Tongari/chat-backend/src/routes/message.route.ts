//ルーティング定義
import { Router } from "express";
import {
  createAudioMessage,
  uploadMiddleware
} from "../controllers/message.controller";

const router = Router();

//POST/audioが来たらcontllerのcreateAudioMessageを呼び出す
router.post("/audio", uploadMiddleware, createAudioMessage);

export default router;