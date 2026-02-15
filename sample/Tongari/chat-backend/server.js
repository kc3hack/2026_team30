const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat",async(req,res) =>{
    try{
        const response = await axios.post("http://localhost:8000/chat",{
            message:req.body.message
        });

        res.json(response.data);
    }catch(error){
        res.status(500).json({error:"Python API error"});
    }
});

app.listen(3001,() => {
    console.log("Server running on port 3001");
});