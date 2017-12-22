$(document).ready(() => {

    SDK.User.loadNav();

    const $courseID = SDK.Storage.load("CourseId");
    const $newQuestionButton = $("#NewQuestionButton");
    const $newChoiceButton = $("#NewChoiceButton");
    const $addQuizButton = $("#addQuizButton");




    $addQuizButton.click(() => {
        let quizTitel = $("#quizTitel").val();

        SDK.Quiz.create(quizTitel,$courseID, (err) => {

            if  (!quizTitel){
                alert("You must enter valid quiz titel");
                $("#quizTitel").val("");


            }

            else if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            }
            else if (err) {
                console.log("Bad stuff happened")
            }
            alert("Din quiz er nu gemt");
            $("#quizTitel").val("");
        })
    });

    $newQuestionButton.click(() => {
        let questionTitle = $("#NewQuestionText").val();
        let quizId = SDK.Storage.load("quizID");
        if (quizId == null){
            alert("You must choose a quiz titel first");
            $("#NewQuestionText").val("");
        }
        SDK.Question.create(questionTitle,quizId, (err) => {

            if  (!questionTitle) {
                alert("You must enter valid question title");
                $("#NewQuestionTitle").val("");
            }

            else if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            }
            else if (err) {
                console.log("Bad stuff happened")
            }
            alert("Dit question er gemt");
            $("#NewQuestionText").val("");
        })
    });

    $newChoiceButton.click(() => {
        let choiceTitle = $("#NewChoice").val();


        if  (!choiceTitle) {
            alert("You must enter valid choice title");
            $("#NewChoice").val("");
        }
        else if(!$('#radioTrue').is(':checked') && !$('#radioFalse').is(':checked') ) {
            alert("you must choose true or false");
        }
        else if($('#radioTrue').is(':checked')){
            var answer = 1;
        }
        else if($('#radioFalse').is(':checked')){
            var answer = 0;
        }


        SDK.Choice.create(choiceTitle,answer,SDK.Storage.load("questionId"), (err) => {

            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            }
            else if (err) {
                console.log("Bad stuff happened")
            }

            alert("Dit choice er gemt");
            $("#NewChoice").val("");
        })
    });


});