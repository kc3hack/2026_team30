//=============================
//チャットでテキストを送信したとき
//=============================

import axios from "axios";
import type { ChatMessageResponseAPI } from "./types";

const API_URL = ""

//テキスト送信
export const sendTextMessage = async (
    senderId:string,
    receiverId:string,
    text:string,
    textColor:string,
    textSize:number
):Promise<ChatMessageResponseAPI | null> => {
    try{
        const res = await axios.post<ChatMessageResponseAPI>(API_URL,{
        senderId,
        receiverId,
        text,
        textColor,
        textSize,
        });
        return res.data;
    }catch(err){
        console.error(err);
        return null;
    }
};