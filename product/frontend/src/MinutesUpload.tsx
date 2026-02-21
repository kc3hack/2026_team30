//===================================
//音声データをバックエンドへアップロード
//===================================
import { useState } from "react";

interface MinutesUploadProps{
}

function MinutesUpload({}:MinutesUploadProps){
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = async () => {
        if(!file) return;

        const formData = new FormData();
        formData.append("audio",file);

        try{
            const response = await fetch("http://localhost:3001/あとで指定",{
                method:"POST",
                body:formData
            });

            const result = await response.json();
            console.log("アップロード成功:",result);
        }catch(error){
            console.error("アップロード失敗:",error);
        }
    };

    return(
        <div>
            <input
                type="file"
                accept=".wav,audio/wav"
                onChange={(e) => {
                    if(!e.target.files)return;
                    setFile(e.target.files[0]);
                }}
            />
            <button onClick={handleUpload}>アップロード</button>
        </div>
    );
}

export default MinutesUpload;