function newDiscussion(){
    superagent
    .post("/newdiscussion")
    .end(function(err,result){
        $("html").html(result.text)
    })
}