module.exports=(req,res,next)=>{
console.log("header",req.headers.token)
  jwt.verify(req.headers.token,'secretkey',(err,authData)=>{
    if(err){
         
        console.log("time exceeded")
        next({status:403});
    }

})
}
