//ルーティング定義
import { Router } from "express";
import {
  createAudioMessage,
  uploadMiddleware
} from "../controllers/message.controller";
import {getMessages} from "../controllers/message.controller";

const router = Router();

//POST/audioが来たらcontllerのcreateAudioMessageを呼び出す
router.post("/audio", uploadMiddleware, createAudioMessage);

//GET/messagesが来たらcontrollerのgetMessagesを呼び出す
router.get("/messages", getMessages);

export default router;