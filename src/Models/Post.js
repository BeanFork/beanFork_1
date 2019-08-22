var createPost = function(user_id, title, description) {
    // Create a post by storing into db- "posts" with a post_id, post title and post description
}
var editPost = function(post_id, newContent) {

    // Edit the post and make the changes in db- "posts" using post_id and update the newContent in the description field alone
} 

var deletePost = function(post_id) {
    
    // Delete the post from the display and also from the db- "posts" using the post_id
}

var userPost = function(user_id) {

    // List out all the discussions made by a particular user with the help of user_id
}

var postTopic = function() {


    // Latest posts on the left side pane by calling the sortPost() with all discussions in an array

}

var sortPost = function() {

    // All discussions are sorted by time to get latest discussions and return the array to postTopic()
}