const express =require("express");
const router = express.Router();
const path = require("path");

router.post("/", (req, res,next) => {
    userprofile.findOne({ username: req.body.username }, function(err, result) {
      console.log("findone", result);
      if (result) {
        console.log("username exist");
        console.log(req.body.password);
        var password = bcrypt.compareSync(req.body.password, result.password)
        if (password) {
          console.log("password exists");
          //res.send({state:false,content:res.sendFile(path.join(__dirname, "../client/views/home.html"))});
          res.json({html:html.toString(),state:false})
          res.sendFile(path.join(__dirname, "../../../../../client/views/home.html"));
  
        } else {
          next({status : 404,message :"username or password not found"})
         // res.send({state: true});
          //console.log("password not exist");
        }
      } else {
        next({status : 404,message :"username or password not found"})
        //res.send({state: true});
      }
    });
  });

  module.exports =router;