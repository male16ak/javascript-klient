$(document).ready(() => {

    SDK.User.loadNav();

    $("#UserSignUp-Button").click(() => {

        const newUsername = $("#inputNewUsername").val();
        const newPassword = $("#inputNewPassword").val();
        const firstName = $("#inputNewFirstName").val();
        const lastName = $("#inputNewLastName").val();

        SDK.User.createUser(newUsername, newPassword, firstName, lastName, (err) => {

            if  (!newUsername || !newPassword || !firstName || !lastName){
                alert("You must enter valid user information");
                $("#inputNewUsername").val("");
                $("#inputNewPassword").val("") ;
                $("#inputNewFirstName").val("") ;
                $("#inputNewLastName").val("");


            }
            else if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            }
            else if (err) {
                console.log("Bad stuff happened")
            } else {
                window.location.href = "my-page.html";
            }
        });


    });
});


