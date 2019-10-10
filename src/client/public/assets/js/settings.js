
function settingsPage() {
  var token = localStorage.getItem("token");
  console.log("token in settings is", token);
  superagent.post("/settings").set("token", token).end(function (err, result) {
    if (err) {
      console.log("unauthorized user");
      $("#container1").load("/views/logout.html", function () {
        document.getElementById("welcome").innerHTML = " ";

        document.getElementById("welcome").innerHTML = "session expired";
      });
    } else {
      console.log("Sttings loaded");
      $(document).ready(function () {
        console.log("1st doc");

        $("#container1").load("../../views/settings.html", function () {
          $("#emailSettings").val(localUser.email);
          $("#usernameSettings").val(localUser.username);
          // document.getElementById("settingsMessage").classList.add('alert');
        });
      });
    }
  })

}

function logOut() {
  var token = localStorage.getItem("token");
  superagent.post("/logout").set("token", token).end(function (err, result) {
    if (err) {
      console.log("unauthorized user");
      $("#container1").load("/views/logout.html", function () {
        document.getElementById("welcome").innerHTML = " ";

        document.getElementById("welcome").innerHTML = "session expired";
      });
    } else {
      console.log("Logout successfully");
      $(document).ready(function () {
        $("#container1").load("../../views/logout.html");
      });
    }
  });
}

function restorePage() {
  var token = localStorage.getItem("token");
  superagent.get("/restore").set("token", token).end(function (err, result) {
    if (err) {
      console.log("unauthorized user");
      $("#container1").load("/views/logout.html", function () {
        document.getElementById("welcome").innerHTML = " ";

        document.getElementById("welcome").innerHTML = "session expired";
      });
    } else {
      console.log("Gone to Register page again!");
      $(document).ready(function () {
        $("#container1").load("../../views/register.html");
      });
    }
  });
}


