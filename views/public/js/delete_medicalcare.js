// Citation for the following function:
// Date: 10/12/2023
// Partially based on: code from Dr. Curry
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// DELETE METHOD
function deleteMedicalCare(idMedicalCare) {
  // ASK USER FOR CONFIRMATION
  var userConfirmed = window.confirm(
    "are you sure you want to delete this medical care treatment?",
  );

  if (!userConfirmed) {
    return; // DO NOTHING IF CANCELLED
  }

  // PLACES DATA IN JS OBJECT
  let medicalcare = {
    id: idMedicalCare,
  };

  // SETS UP AJAX REQUEST
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/delete-medicalcare-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  let alertShown = false;

  // DEFINES BEHAVIOUR FOR AJAX
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 204) {
      // RETURN TO PAGE
      window.location.href = "/medicalcares";
    } else if (xhttp.status == 400 && !alertShown) {
      // RESOLVE CONFLICTS IF IN USE
      alert("sorry, but this medical care treatment is in use in another table.");
      alertShown = true;
    } else {
      // OTHER ERRORS
      console.log("There was an error with the input.");
    }
  };
  // SENDS REQUEST
  xhttp.send(JSON.stringify(medicalcare));
}
