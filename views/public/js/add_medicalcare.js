// Citation for the following function:
// Date: 10/12/2023
// Partially based on: code from Dr. Curry
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// GETS OBJECTS TO MODIFY
let addMedicalCareForm = document.getElementById("add_medicalcare_form_ajax");

// MODIFIES THIS OBJECT
addMedicalCareForm.addEventListener("submit", function (e) {
  // PREVENTS DEFAULT BEHAVIOUR ASSOCIATED WITH EVENT
  // DO NOT REMOVE THIS LINE
  e.preventDefault();

  // ASSIGNS FIELDS FROM FORM WE JUST RECEIVED
  let inputTreatment = document.getElementById("input_treatment");

  // EXTRACTS VALUES FROM ASSIGNED FIELDS
  let treatmentValue = inputTreatment.value;

  // PLACES THOSE VALUES IN JS OBJECT
  let data = {
    treatment: treatmentValue,
  };

  // SETS UP AJAX REQUEST
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/add-medicalcare-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // DEFINES BEHAVIOUR FOR AJAX
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // ADDS INSERTED DATA TO EXISTING TABLE
      addRowToTable(xhttp.response);

      // CLEARS FORM FIELDS FOR NEW DATA
      inputTreatment.value = "";

      browseRecords();
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };

  // SENDS REQUEST
  xhttp.send(JSON.stringify(data));
});

// CREATES A NEW ROW
addRowToTable = (data) => {
  // GETS CURRENT TABLE
  let currentTable = document.getElementById("medicalcares_table");

  // GETS LOCATION OF NEW ROW OF CURRENT TABLE
  let newRowIndex = currentTable.rows.length;

  // GETS CURRENT OBJECT
  let parsedData = JSON.parse(data);
  let newRow = parsedData[parsedData.length - 1];

  // CREATES NEW ROW WITH ALL CELLS
  let row = document.createElement("TR");
  let firstCell = document.createElement("TD");
  let idCell = document.createElement("TD");
  let treatmentCell = document.createElement("TD");

  // FILLS THOSE CELLS
  idCell.innerText = newRow.idMedicalCare;
  treatmentCell.innerText = newRow.treatment;

  // MODIFIES EDIT BUTTON SO THAT IT CAN BE CLICKED DIRECTLY WITHOUT REFRESHING PAGE
  row.appendChild(firstCell);
  row.appendChild(idCell);
  row.appendChild(treatmentCell);

  // MODIFIES DELETE BUTTON SO THAT IT CAN BE CLICKED DIRECTLY WITHOUT REFRESHING PAGE
  row.setAttribute("data-value", newRow.id);

  // ADDS CELLS TO NEW ROW
  currentTable.appendChild(row);
};
