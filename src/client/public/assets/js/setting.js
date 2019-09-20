
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

function logout(){
    superagent.post("/logout").end(
        function(err,result){
            if(err){
                console.log(err);
            }else{
                console.log("Logout successfully");
                $(document).ready(function (){
                    $("#divcontainer").load("../../views/logout.html");
                });

            }
        }
    )
}

function restorePage(){
    superagent.get("/restore").end(
        function (err,result){
            if(err){
                console.log(err);
                 $(document).ready(function (){
                    $("#divcontainer").load("../../views/register.html");
                });g
            }

        }
    );
}