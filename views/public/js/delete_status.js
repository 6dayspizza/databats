   // Citation for the following function: 
    //Date: 10/12/2023
    //Copied from /OR/ Adapted from /OR/ Based on: code from Dr. Curry
    //Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app 

// Delete methods
function deleteStatus(idStatus) {

    var userConfirmed = window.confirm("are you sure you want to delete this status?");

    if (!userConfirmed) {
        return; // Do nothing if the user cancels the deletion
    }

    // Put our data we want to send in a javascript object
    let status = {
        id: idStatus
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-status-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // deleteRow(idBat);

            window.location.href='/status';
        } 
        else if (xhttp.status == 400) {
            // Conflict status (foreign key constraint violation)
            alert("sorry, but this status is in use in another table.");
        } else {
            // Other error status
            console.log("There was an error with the input.");
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(status));
}