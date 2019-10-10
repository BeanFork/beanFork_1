var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/userprofile");


var nameSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  code: String,
  post: [
    {
      topic: String,
      description: String,
      postTime: Number,
      comments: [
        {
          userId: String,
          comment: String,
          username: String,
          postTime: String
        }
      ]
    }
  ]
});

module.exports=mongoose.model("User", nameSchema);