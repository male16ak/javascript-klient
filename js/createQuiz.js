$(document).ready(() => {

    SDK.User.loadNav();

    const $coursesButtons = $("#courses-buttons");
    const $addQuestion = $("#addQuestion");
    const $questionTitles = $("#questionTitles");
    const $choiceTitles = $("#choiceTitles");

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



    $addQuestion.click(function () {

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