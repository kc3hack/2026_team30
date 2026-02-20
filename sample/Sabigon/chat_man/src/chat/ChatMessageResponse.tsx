//===============================
//バックエンドからの返答を貰う処理
//===============================

import axios from "axios";
import type { ChatMessageResponseAPI } from "./types";

//APIからの返答をもらうURL
const Respomse_URL = "http://localhost:3001/api/messages"; 

    //メッセージを取ってくる
    export const fetchMessages = async () => {
        try{
            //URLを指定
            const res = await axios.get<ChatMessageResponseAPI[]>(Respomse_URL);
            return res.data;
        }catch(err){
            console.error(err);
        }
    };