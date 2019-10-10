var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/userprofile");


var postSchema = new mongoose.Schema({
  username: String,
  topic: String,
  description: String,
  postTime: Number,
  userid: String,
  postid: String,
  comments: [
    {
      userId: String,
      comment: String
    }
  ]
});



module.exports = mongoose.model("Post", postSchema);