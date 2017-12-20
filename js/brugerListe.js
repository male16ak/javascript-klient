$(document).ready(() => {

    SDK.User.loadNav();

    const $brugerListe = $("#brugerListe");
    $brugerListe.html("");


    SDK.User.findAll((err, brugere) => {

        brugere.forEach((bruger) => {

            $brugerListe.append(`
            <tr data-id="${bruger.userId}">
            <td><button id=${bruger.userId} class="remove">Slet bruger</button>
            ${bruger.userId}</td> 
            <td>${bruger.username}</td>
            <td>${bruger.firstName}</td>
            <td>${bruger.lastName}</td>
            </tr>
            
            `
                );
        });
    });


        $("#brugerListe").delegate(".remove", "click", () => {

           SDK.Storage.persist("deleteUserId",event.target.id);

            const deleteUserId = SDK.Storage.load("deleteUserId");

            if (confirm('Are you sure you want to delete user with ID ' + deleteUserId + "?")) {
                SDK.User.delete(deleteUserId, (err) => {

                    if (err) {
                        alert("User was not deleted. Error occurred (" + err + ").");
                    } else {
                        alert("User (ID " + deleteUserId + ") has been deleted!");
                        $("#brugerListe").find('tr[data-id=' + deleteUserId +']').remove();
                    }

                });

            }
            else {
                alert("The user was not deleted.")
            }
            SDK.Storage.remove("deleteUserId");

        });






    });

