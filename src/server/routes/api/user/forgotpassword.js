const express =require("express");
const router = express.Router();
const path = require("path");


router.post("/",(req,res)=>{
    res.sendFile(path.join(__dirname, "../../../../client/views/forgot-password.html"))
  })
  
module.exports =router;