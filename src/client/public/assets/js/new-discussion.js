function createDiscussion(){
    superagent
    .post("/newDiscussion")
    .send({topic : document.getElementById("discussionTopic").value, description : document.getElementById("discussionDescription").value})
    .end(function(err,result){
        
    })
}