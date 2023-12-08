// Citation for the following function:
// Date: 10/12/2023
// Partially based on: code from Dr. Curry
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// GETS OBJECTS TO MODIFY
let updateCareLogForm = document.getElementById("update-carelog-form-ajax");

// MODIFIES THIS OBJECT
updateCareLogForm.addEventListener("submit", function (e) {
  // PREVENTS DEFAULT BEHAVIOUR ASSOCIATED WITH EVENT
  // DO NOT REMOVE THIS LINE
  e.preventDefault();

  // ASSIGNS FIELDS FROM FORM WE JUST RECEIVED
  let inputIDCareLog = document.getElementById("id_to_update");
  let inputPerson = document.getElementById("input_person_update");
  let inputWeight = document.getElementById("input_weight_update");
  let inputNutrition = document.getElementById("input_nutrition_update");
  let inputsMedicalCare = Array.from(
    document.getElementsByClassName("input_medical_care"),
  );
  let inputRemark = document.getElementById("input_remark_update");

  // EXTRACTS VALUES FROM ASSIGNED FIELDS
  let idCareLogValue = inputIDCareLog.value;
  let personValue = inputPerson.value;
  let weightValue = inputWeight.value;
  let medicalCareValues = inputsMedicalCare
    .filter(function (input) {
      return input.checked === true;
    })
    .map(function (input) {
      return input.value;
    });
  let remarkValue = inputRemark.value;
  let nutritionValue = inputNutrition.value;

  // HANDLES CASE WHERE PERSON IS NOT AN INTEGER/EMPTY WHICH IS NOT ALLOWED FOR NEW ENTRIES
  if (isNaN(personValue)) {
    return;
  }

  // PLACES THOSE VALUES IN JS OBJECT
  let data = {
    idcarelog: idCareLogValue,
    person: personValue,
    weight: weightValue,
    medicalcares: medicalCareValues,
    remark: remarkValue,
    nutrition: nutritionValue,
  };

  // SETS UP AJAX REQUEST
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put-carelog-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // DEFINES BEHAVIOUR FOR AJAX
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // ADDS DATA TO TABLE
      updateRow(xhttp.response, idCareLogValue);

      // RETURNS TO PAGE
      window.location.href = "/carelogs";
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };

  // SENDS REQUEST
  xhttp.send(JSON.stringify(data));
});

// UPDATE METHOD
function updateRow(data, idCareLog) {
  // GETS CURRENT OBJECT
  let parsedData = JSON.parse(data);

  // GETS CURRENT TABLE
  let table = document.getElementById("carelogs_table");

  for (let i = 0, row; (row = table.rows[i]); i++) {
    // ITERATES THROUGH ROWS
    if (table.rows[i].getAttribute("data-value") == idCareLog) {
      // GETS LOCATION OF ROW WITH MATCHING ID
      let updateRowIndex = table.getElementsByTagName("tr")[i];

      // GETS TD VALUE
      let td = updateRowIndex.getElementsByTagName("td")[3];

      // REASSIGNS VALUE
      td.innerHTML = parsedData[0].name;
    }
  }
}
