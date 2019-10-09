require('dotenv').config();
var jwt=require("jsonwebtoken")

module.exports=(req,res,next)=>{
    const token = jwt.sign({
    username: req.body.username,
    },
    process.env.SECRET_KEY, {
    expiresIn: "200s"
    });
    console.log("tokens gen ",token)
    res.locals.token=token;
   next();
}