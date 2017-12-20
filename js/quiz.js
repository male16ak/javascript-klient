$(document).ready(() => {

    SDK.User.loadNav();

    const courseID = SDK.Storage.load("CourseId");
    console.log(courseID);

    const $quizButtons = $("#quiz-buttons");

    SDK.Quiz.findAll(courseID, (err, quiz) => {
        if (err) throw err;
        $("#tableHead").html("Quiz:");
        quiz.forEach(quiz => {

            $quizButtons.append(`
            
            <dd>
            
            <button class="btn btn-info btn-block" id=${quiz.quizId}>${quiz.quizTitle}</button>
        
            </dd>`);
        });
    });


    $quizButtons.click(() => {
        console.log(event.target.id);
        SDK.Storage.persist("QuizID",event.target.id);
        window.location.href = "question.html";

    });
});