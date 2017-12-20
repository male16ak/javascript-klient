$(document).ready(() => {

    SDK.User.loadNav();

    const $coursesButtons = $("#courses-buttons");
    const $addQuestion = $("#addQuestion");
    const $questionTitles = $("#questionTitles");
    const $choiceTitles = $("#choiceTitles");
    const $courseID = SDK.Storage.load("CourseId");
    const $newQuestionButton = $("#NewQuestionButton");
    const $newChoiceButton = $("#NewChoiceButton");
    const $addQuizButton = $("#addQuizButton");
    const $questionTitle = $("#questionTitle");


    /*  $("#QuizHead").append(`
     <p>${}</p>
     `);
 */


    $addQuizButton.click(() => {
        let quizTitel = $("#quizTitel").val();
        console.log(quizTitel);
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
            alert("Din quiz er nu gemt")
            $("#quizTitel").val("");
        })
    });

    $newQuestionButton.click(() => {
        let questionTitle = $("#NewQuestionText").val();
        console.log();
        SDK.Question.create(questionTitle,SDK.Storage.load("quizID"), (err) => {

            if  (!questionTitle){
                alert("You must enter valid question title");
                $("#NewQuestionTitle").val("");


            }
            else if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            }
            else if (err) {
                console.log("Bad stuff happened")
            }
            alert("Dit question er gemt")
            $("#NewQuestionTitle").val("");
        })
    });

    $newChoiceButton.click(() => {
        let choiceTitle = $("#NewChoice").val();
        console.log(choiceTitle);

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

            alert("Dit choice er gemt")
            $("#NewChoice").val("");
        })
    });

    var count = 1;
    var countChoice = 1;
    SDK.Courses.findAll((err, courses) => {
        if (err) throw err;
        courses.forEach(course => {
            $coursesButtons.append(`
       
       <dd>
            <button class="btn-info btn-block btn-lg" id=${course.courseId}>${course.courseTitel}</button>
        
            </dd>
            
      `
            );
        });
    });



    $addQuestion.click(() => {

        $questionTitles.append(`
       <li id="questionList">
            <input type="text" placeholder="Question Title" id=${count}>
          
               
             <input type="button" value="Add Choice" class="create" id="choiceTitles">
            
       </li>  
       
          
      `);
        count++;
        countChoice++;
    });
    $("#createQuizForm").delegate(".create", "click", () => {

        console.log("tillykke");
        $("#questionList").append(`
            
            <input type="text" placeholder="Choice Title">
         
      `);

    });



});