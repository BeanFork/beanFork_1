function confirmcode(){
    superagent
    .post("/submit")
    .end(function(err,result){
        $("html").html(result.text);
    })
}