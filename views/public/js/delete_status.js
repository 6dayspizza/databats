// Citation for the following function:
// Date: 10/12/2023
// Partially based on: code from Dr. Curry
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// DELETE METHOD
function deleteStatus(idStatus) {
  // ASK USER FOR CONFIRMATION
  var userConfirmed = window.confirm(
    "are you sure you want to delete this status?",
  );

  if (!userConfirmed) {
    return; // DO NOTHING IF CANCELLED
  }

  // PLACES DATA IN JS OBJECT
  let status = {
    id: idStatus,
  };

  // SETS UP AJAX REQUEST
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/delete-status-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // DEFINES BEHAVIOUR FOR AJAX
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 204) {
      // RETURN TO PAGE
      window.location.href = "/status";
    } else if (xhttp.status == 400) {
      // RESOLVE CONFLICTS IF IN USE
      alert("sorry, but this status is in use in another table.");
    } else {
      // OTHER ERRORS
      console.log("There was an error with the input.");
    }
  };
  // SENDS REQUEST
  xhttp.send(JSON.stringify(status));
}
