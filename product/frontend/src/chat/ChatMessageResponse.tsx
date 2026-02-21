//===============================
//データベースから履歴を取得する
//===============================

import axios from "axios";
import type { ChatMessageResponseAPI, Message } from "./types";

//APIからの返答をもらうURL

    //メッセージを取ってくる
    export const fetchMessages = async (receiverId: string) => {
        try{
            const senderId = localStorage.getItem("userId");
            if(!senderId) throw new Error("ログイン情報がありません");
            //URLを指定
            const response = await fetch("http://localhost:3001/chat/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            senderId: senderId,
            receiverId: receiverId
        }),
      });
            return await response.json() as Message[];
        }catch(err){
            console.error(err);
        }
    };