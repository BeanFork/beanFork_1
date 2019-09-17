
var localdata;
function sendcode() {

    superagent
        .post("/sendcode")
        .send({
            email: document.getElementById("input-email").value,
            // code: verificationCode
        })
        .end(function (err, result) {

            var res = JSON.parse(result.text)

            if (err) {
                console.log(err);
            } if (res.status) {

                document.getElementById("Emailspan").innerHTML = "<p>verification code is sent to email </p>";

            }
            else
                document.getElementById("Emailspan").innerHTML = '<p>email doesnt exist</p>';
        });
}



function confirmcode() {
    //localStorage.setItem('localemail', document.getElementById("input-email").value);

    superagent
        .post("/submitcode")
        .send({
            code: document.getElementById("input-code").value,
            email: document.getElementById("input-email").value,
        })
        .end(function (err, result) {

            var res = JSON.parse(result.text)
            localUser = res.userdata;
            if (res.status) {
                console.log(res.status)
                // $("html").html(res.html);
                $(document).ready(function () {

                    $("#divcontainer").load("../../views/change-password.html #container2", function () {

                        console.log("load is performed")
                        document.getElementById("welcomeuser").innerHTML = `<p> Welcome ${localUser.username}</p>`
                    });
                });
            }
            else

                document.getElementById("Emailspan").innerHTML = "<p>Verification code is incorrect</p>"
        });


}

function changepassword() {

    localemail = localStorage.getItem('localemail');

    console.log(localemail);
    superagent
        .post("/changepassword")
        .send({
            password: document.getElementById("password").value,
            email: localemail
        })
        .end(function (err, result) {
            var res = JSON.parse(result.text)

            if (res.status) {
                console.log("password updated in db")
                $(document).ready(function () {

                    $("#container2").load("../../views/home.html", function () {

                        console.log("load is performed")
                        document.getElementById("welcomeuser").innerHTML = `<p> Welcome ${localUser.username}</p>
                        <h5> your password is updated</h5>`
                        yourDiscussion(res.userData);
                        middleRenderPost(res.userData);
                    });
                });

            }
            else
                console.log("not updated")
        })
}



