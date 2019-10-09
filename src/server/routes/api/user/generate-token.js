var jwt=require("jsonwebtoken")
module.exports=(req,res,next)=>{
    const token = jwt.sign({
    username: req.body.username,
    },
    "secretkeys1", {
    expiresIn: "100s"
    });
    console.log("username checkng jwt ",req.body.username)
    res.locals.token=token;
   next();
}