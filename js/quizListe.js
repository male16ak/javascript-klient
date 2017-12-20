$(document).ready(() => {

    SDK.User.loadNav();

    const deleteQuizCourseButton = SDK.Storage.load("CourseId");
    const $quizListe = $("#quizListe");
    $quizListe.html("");

    SDK.Quiz.findAll(deleteQuizCourseButton, (err, quiz) => {
        if (err) throw err;
        $("#tableHead").html("Quiz:");
        quiz.forEach(quiz => {

            $quizListe.append(`
            <tr data-id="${quiz.quizId}">
            <td><button id=${quiz.quizId} class="remove">Slet Quiz</button>
            ${quiz.quizId}</td> 
            <td>${quiz.quizTitle}</td>
            </tr>
            `);
        });
    });
    $("#quizListe").delegate(".remove", "click", () => {


        SDK.Storage.persist("deleteQuizId",event.target.id);

        const deleteQuizId = SDK.Storage.load("deleteQuizId");

        if (confirm('Are you sure you want to delete quiz with ID ' + deleteQuizId + "?")) {
            SDK.Quiz.delete(deleteQuizId, (err) => {

                if (err) {
                    alert("Quiz was not deleted. Error occurred (" + err + ").");
                } else {
                    alert("Quiz (ID " + deleteQuizId + ") has been deleted!");
                    $("#quizListe").find('tr[data-id=' + deleteQuizId +']').remove();
                }

            });

        }
        else {
            alert("The quiz was not deleted.")
        }
        SDK.Storage.remove("deleteQuizId");
    });


    });


