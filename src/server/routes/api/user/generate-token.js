var jwt=require("jsonwebtoken")
module.exports=(req,res,next)=>{
    const token = jwt.sign({
    email: req.body.email,
    userId: req.body._id
    },
    "secretkeys1", {
    expiresIn: "200s"
    });
    res.locals.token=token;
   next();
}