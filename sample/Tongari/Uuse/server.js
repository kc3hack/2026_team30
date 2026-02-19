const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const app = express();
app.use(cors());

const upload = multer({dest:"uploads/"});

app.post("/api/analyze",upload.single("file"),async (req,res) => {
    try{
        const formData = new FormData();
        formData.append("file",fs.createReadStream(req.file.path));

        const response = await axios.post(
            "http://127.0.0.1:8000/analyze/",
            formData,
            {headers: formData.getHeaders()}
        );

        //整形
        const formatted = response.data.transcription.map(seg => ({
            text: seg.text,
            emotion: seg.emotion,
            style:convertEmotionToStyle(seg.emotion)
        }));
        
        res.json({message:formatted});

    }catch(error){
        console.error("error:",error);
        res.status(500).json({error:"Python API error"});
    }
});

function convertEmotionToStyle(emotion){
    const maxEmotion = Object.keys(emotion).reduce((a,b) => emotion[a] > emotion[b] ? a : b);

    const colorMap = {
        joy:"#FFD700",
        anger:"#FF4500",
        sadness:"#4A90E2",
        surprise:"#9B59B6"
    };

    return{
        color: colorMap[maxEmotion] || "#000",
        fontSize:`${16 + emotion[maxEmotion] * 20}px`
    };
}

app.listen(3001,() => {
    console.log("Server running on port 3001");
});