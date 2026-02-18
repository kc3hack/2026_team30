//Python APIの呼び出し
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import type {PythonMessageDTO} from "../dto/python.dto";


export async function callPython(
  filePath: string
): Promise<PythonMessageDTO> {
    const formData = new FormData();
    //ファイルをフォームデータに追加
    formData.append("file", fs.createReadStream(filePath));

    //Python APIにPOSTリクエストを送信
    const response = await axios.post(
        "http://127.0.0.1:8000/analyze/",
        formData,
        { headers: formData.getHeaders() }
    );

    //レスポンスをDTOに変換して返す
    return response.data;
}