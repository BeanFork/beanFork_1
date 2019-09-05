function createDiscussion(){
    superagent
    .post("/newDiscussion")
    .send({topic : document.getElementById("discussionTopic").nodeValue, description : document.getElementById("discussionDescription").value})
    .end(function(err,result){
        
    })
}