$(document).ready(() => {

    SDK.User.loadNav();

    const $takeQuizModalBody = $("#takeQuizModalBody");

    console.log("vores quizID er: "+quizID);

    const $submit = $("#submitanswers");


    SDK.Question.findAll(quizID, (err, question) => {
        if (err) throw err;
        question.forEach(question => {
           getChoice(question.questionId);
           console.log("test1");
            $takeQuizModalBody.append(`       
            <form id=${question.questionId}>${question.questionTitle}
            <br>
            </form> 
      `);
        });
    });

    const getChoice = function(id){
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

    $submit.click(function() {
       let temp = document.getElementById("question-tbody").getElementsByTagName("input");
        let count = 0;
        for(let i = 0; i < temp.length; i++) {
            if (temp[i].checked && temp[i].value == 1) {
                count++;
            }
        }
        alert("Du fik "+count+" rigtige svar");
    });

});