$(document).ready(() => {

    SDK.User.loadNav();

   const $loginModal = $("#loginModal");

    $("#login-button").click(() => {

        const username = $("#inputUsername").val();
        const password = $("#inputPassword").val();

        SDK.User.login(username, password, (err, data) => {


            if  (!username || !password) {
                alert("You must enter valid user information");
            }

            else if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            }
            else if (err) {
                console.log("Bad stuff happened");
                alert("You have entered a wrong username or password. Please try again");
                $("#inputUsername").val("");
                $("#inputPassword").val("");

            }  else {

                window.location.href = "my-page.html";
            }

        });

    });

});


