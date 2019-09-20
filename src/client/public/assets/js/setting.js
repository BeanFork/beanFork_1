
function settingsPage(){
    superagent
    .post("/settings")
    .end(
        function(err,result){
            if(err){
                console.log(err);
            }else{
                 console.log("Sttings loaded")
                 $(document).ready(function () {
                    console.log("1st doc"); 
                   
                    $("#divcontainer").load("../../views/setting.html");
                });
            
            }
            });

            
        
      
}