$(document).ready(() => {

    SDK.User.loadNav();
    const currentUser = SDK.User.current();


    const $takeQuizDropDown  =  $("#takeQuizDropDown");
    const $deleteQuizDropDown = $("#deleteQuizDropDown");
    const $createQuizDropDown = $("#createQuizDropDown");
    const $modalHead = $("#modalHead");
    const $takeQuizModalBody = $("#takeQuizModalBody");
    const $submitAnswer = $("#submitAnswer");

    $("#createAdminButton").hide();
    $("#dropdownMenu2").hide();
    $("#dropdownMenu3").hide();

    if (currentUser.type === 2) {

        $("#createAdminButton").show();
        $("#dropdownMenu2").show();
        $("#dropdownMenu3").show();
    }


    $(".page-header").html(`
    <h1>Hi, ${currentUser.firstName} ${currentUser.lastName}</h1>
  `);


    $(".profile-info").html(`
    <dl>
        <dt>Name</dt>
        <dd>${currentUser.firstName} ${currentUser.lastName}</dd>
        <dt>Username</dt>
        <dd>${currentUser.username}</dd>
        <dt>ID</dt>
        <dd>${currentUser.userId}</dd>
     </dl>
  `);


        SDK.Courses.findAll((err, courses) => {
        if (err) throw err;
        courses.forEach(course => {
            $deleteQuizDropDown.append(`
        
         <button class="btn-success btn-block btn-sm" id= "${course.courseId}" >${course.courseTitel}</button>
         
      `);
            $takeQuizDropDown.append(`
        
        <button class="btn-info btn-block btn-sm" data-toggle="modal" data-target="#takeQuizModal" id= "${course.courseId}" >${course.courseTitel}</button>
         
      `);
            $createQuizDropDown.append(`
        
        <button class="btn-warning btn-block btn-sm" id= "${course.courseId}" >${course.courseTitel}</button>
          
      `);
        });
    });

    $takeQuizDropDown.click(() => {

        SDK.Storage.persist("CourseId",event.target.id);

        const courseId = SDK.Storage.load("CourseId");

        $("#takeQuizModal").toggle();
        $modalHead.empty();
        $modalHead.html("Quiz Titel:");
        SDK.Quiz.findAll(courseId, (err, quiz) => {
            if (err) throw err;
            quiz.forEach(quiz => {

                $modalHead.append(`
            
          
            
            <button class="btn btn-warning btn-xs quiz" id=${quiz.quizId}>${quiz.quizTitle}</button>
        
            `);
            });
        });


    });
    $modalHead.click(() => {
        SDK.Storage.persist("QuizID", event.target.id);

    });

    $("#takeQuizModal").delegate(".quiz", "click", () => {
        $takeQuizModalBody.empty();
        const quizID = SDK.Storage.load("QuizID");

        SDK.Question.findAll(quizID, (err, question) => {
            if (err) throw err;
            question.forEach(question => {
                getChoice(question.questionId);
                console.log("test1");
                $takeQuizModalBody.append(`       
            <form  id=${question.questionId}>${question.questionTitle}
            <br>
            </form> 
      `);
            });
        });

    });

        const getChoice = function(id) {
            SDK.Choice.findAll(id, (err, choice) => {
                if (err) throw err;
                let list = $("#"+id);
                choice.forEach(choice => {
                    list.append(`
            
            <input type="radio" name=${id} id=${choice.choiceId} value=${choice.answer}>${choice.choiceTitle}
            
            `);
                });
            });
        };
    $submitAnswer.click(() => {

        let temp = document.getElementById("takeQuizModalBody").getElementsByTagName("input");
        let count = 0;
        for(let i = 0; i < temp.length; i++) {
            if (temp[i].checked && temp[i].value == 1) {
                count++;
            }
        }
        alert("Du fik "+count+" rigtige svar");
        $modalHead.empty();
        $takeQuizModalBody.empty();
        SDK.Storage.remove("QuizID");
    });

        $("#closeButton").click( () => {
            $modalHead.empty();
            $takeQuizModalBody.empty();
            SDK.Storage.remove("QuizID");
        });



    $deleteQuizDropDown.click(() => {

        SDK.Storage.persist("CourseId",event.target.id);


            window.location.href = "quizListe.html";

    });
    $createQuizDropDown.click(() => {

        SDK.Storage.persist("CourseId",event.target.id);

        window.location.href = "createQuiz.html";
    });

    $("#deleteUserButton").click(() => {

        const deleteUserId = currentUser.userId;

            if (confirm('Are you sure you want to delete your user with ID ' + deleteUserId + "?"))

            {
                SDK.User.delete(deleteUserId, (err) => {

                });
                SDK.User.logOut();
            }
            else {
                alert("The user was not deleted.")
            }

        });

    $("#AdminSignUp-button").click(() => {

        const newAdminUsername = $("#inputNewAdminUsername").val();
        const newAdminPassword = $("#inputNewAdminPassword").val();
        const newAdminFirstName = $("#inputNewAdminFirstName").val();
        const newAdminLastName = $("#inputNewAdminLastName").val();

        SDK.User.createAdmin(newAdminUsername, newAdminPassword, newAdminFirstName, newAdminLastName, (err, data) => {
            if  (!newAdminUsername || !newAdminPassword || !newAdminFirstName || !newAdminLastName){
                alert("You must enter valid admin information");
                $("#inputNewAdminUsername").val("");
                $("#inputNewAdminPassword").val("") ;
                $("#inputNewAdminFirstName").val("") ;
                $("#inputNewAdminLastName").val("");

            }
            else if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            }
            else if (err) {
                console.log("Bad stuff happened")
            } else {
             //   window.location.href = "my-page.html";

                alert("Den nye Admin bruger er nu oprettet i systemet");

            }
        });


    });

});