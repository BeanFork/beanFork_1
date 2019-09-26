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
                   
                    $("#divcontainer").load("../../views/settings.html");
                });
            
            }
            });
}

function logOut(){
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
            }
            else {
                console.log("Gone to Register page again!");
                $(document).ready(function (){
                    $("#container1").load("../../views/register.html");
                });
            
            }
                
        });

    
    
}

/*
Go to Main Page 
*/
function homePage() {
    superagent
    .post('/homePage')
    .end(function( err, result) {
        var res = JSON.parse(result.text);
        if(err){
            console.log(err);
        }
        $(document).ready(function() {
        
         $("#divcontainer").load("../../views/home.html");
        });
      });
  
 }
  
  