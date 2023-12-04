// Citation for the following function:
// Date: 10/12/2023
// Partially based on: code from Dr. Curry
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// GETS OBJECTS TO MODIFY
let updateBatForm = document.getElementById("update-bat-form-ajax");

// MODIFIES THIS OBJECT
updateBatForm.addEventListener("submit", function (e) {
  // PREVENTS DEFAULT BEHAVIOUR ASSOCIATED WITH EVENT
  // DO NOT REMOVE THIS LINE
  e.preventDefault();

  // ASSIGNS FIELDS FROM FORM WE JUST RECEIVED
  let inputIDBat = document.getElementById("idToUpdate");
  let inputEndDate = document.getElementById("input_enddate_update");
  let inputReleaseSite = document.getElementById("input_releasesite_update");
  let inputStatus = document.getElementById("input_status_update");
  let inputRemark = document.getElementById("input_remark_update");

  // EXTRACTS VALUES FROM ASSIGNED FIELDS
  let idBatValue = inputIDBat.value;
  let endDateValue = inputEndDate.value;
  let releaseSiteValue = inputReleaseSite.value;
  let statusValue = inputStatus.value;
  let remarkValue = inputRemark.value;

  // PLACES THOSE VALUES IN JS OBJECT
  let bat = {
    idbat: idBatValue,
    enddate: endDateValue,
    releasesite: releaseSiteValue,
    status: statusValue,
    remark: remarkValue,
  };

  // SETS UP AJAX REQUEST
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put-bat-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // DEFINES BEHAVIOUR FOR AJAX
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // RETURNS TO PAGE
      window.location.href = "/bats";
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };

  // SENDS REQUEST
  xhttp.send(JSON.stringify(bat));
});

// UPDATE METHOD
function updateRow(bat, idBat) {
  // GETS CURRENT OBJECT
  let parsedData = JSON.parse(bat);

  // GETS CURRENT TABLE
  let table = document.getElementById("bats_table");

  for (let i = 0, row; (row = table.rows[i]); i++) {
    // ITERATES THROUGH ROWS
    if (table.rows[i].getAttribute("data-value") == idBat) {
      // GETS LOCATION OF ROW WITH MATCHING ID
      let updateRowIndex = table.getElementsByTagName("tr")[i];

      // GETS TD VALUE
      let td = updateRowIndex.getElementsByTagName("td")[3];

      // REASSIGNS VALUE
      td.innerHTML = parsedData[0].name;
    }
  }
}
