// Citation for the following function:
// Date: 10/12/2023
// Partially based on: code from Dr. Curry
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// GETS OBJECTS TO MODIFY
let addCareLogForm = document.getElementById("add_carelog_form_ajax");

// MODIFIES THIS OBJECT
addCareLogForm.addEventListener("submit", function (e) {
  // PREVENTS DEFAULT BEHAVIOUR ASSOCIATED WITH EVENT
  // DO NOT REMOVE THIS LINE
  e.preventDefault();

  // ASSIGNS FIELDS FROM FORM WE JUST RECEIVED
  let inputBat = document.getElementById("input_bat");
  let inputPerson = document.getElementById("input_person");
  let inputWeight = document.getElementById("input_weight");
  let inputNutrition = document.getElementById("input_nutrition");
  let inputsMedicalCare = Array.from(
    document.getElementsByClassName("input_medical_care"),
  );
  let inputRemark = document.getElementById("input_remark");

  // EXTRACTS VALUES FROM ASSIGNED FIELDS
  let batValue = inputBat.value;
  let personValue = inputPerson.value;
  let weightValue = inputWeight.value;
  let nutritionValue = inputNutrition.value;
  let medicalCareValues = inputsMedicalCare
    .filter(function (input) {
      return input.checked === true;
    })
    .map(function (input) {
      return input.value;
    });
  let remarkValue = inputRemark.value;

  // PLACES THOSE VALUES IN JS OBJECT
  let data = {
    idBat: batValue,
    idPerson: personValue,
    weight: weightValue,
    nutrition: nutritionValue,
    medicalCares: medicalCareValues,
    remark: remarkValue,
  };

  // SETS UP AJAX REQUEST
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/add-carelog-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // DEFINES BEHAVIOUR FOR AJAX
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // ADDS INSERTED DATA TO EXISTING TABLE
      addRowToTable(xhttp.response);

      // CLEARS FORM FIELDS FOR NEW DATA
      inputBat.value = "";
      inputPerson.value = "";
      inputWeight.value = "";
      inputNutrition.value = "";
      inputsMedicalCare.forEach((input) => (input.checked = false));
      inputRemark.value = "";

      browseRecords();
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the form.");
    }
  };

  // SENDS REQUEST
  xhttp.send(JSON.stringify(data));
});

// CREATES A NEW ROW
addRowToTable = (data) => {
  // GETS CURRENT TABLE
  let currentTable = document.getElementById("carelogs_table");

  // GETS LOCATION OF NEW ROW OF CURRENT TABLE
  let newRowIndex = currentTable.rows.length;

  // GETS CURRENT OBJECT
  let parsedData = JSON.parse(data);
  let newRow = parsedData[parsedData.length - 1];

  // CREATES NEW ROW WITH ALL CELLS
  let row = document.createElement("TR");
  let firstCell = document.createElement("TD");
  let idCell = document.createElement("TD");
  let batCell = document.createElement("TD");
  let personCell = document.createElement("TD");
  let dateTimeCell = document.createElement("TD");
  let weightCell = document.createElement("TD");
  let nutritionCell = document.createElement("TD");
  let medicalCareCell = document.createElement("TD");
  let remarkCell = document.createElement("TD");
  let editCell = document.createElement("TD");
  let deleteCell = document.createElement("TD");

  // FILLS THOSE CELLS
  idCell.innerText = newRow.idCareLog;
  idCell.classList = ["id"];

  // FORMAT BAT IDs CELL TO DIRECTLY BE ABLE TO FILTER  
  let batButton = document.createElement("button");
  batButton.classList = ["filter"];
  batButton.innerHTML = newRow.idBat;
  batButton.addEventListener("click", function (event) {
    filterByBat(newRow.idBat);
  });
  batCell.appendChild(batButton);

  personCell.innerText = newRow.name;
  dateTimeCell.innerText = newRow.dateTime;
  weightCell.innerText = newRow.weight;
  nutritionCell.innerText = newRow.nutrition;
  medicalCareCell.innerText = newRow.medicalCares || "";
  remarkCell.innerText = newRow.remark;

  // MODIFIES EDIT BUTTON SO THAT IT CAN BE CLICKED DIRECTLY WITHOUT REFRESHING PAGE
  let editButton = document.createElement("button");
  editButton.classList = ["modify"];
  editButton.innerHTML = "edit";
  editButton.addEventListener("click", function (event) {
    editRecord(
      newRow.idCareLog,
      newRow.name,
      newRow.weight,
      newRow.nutrition,
      newRow.remark,
    );
  });
  editCell.appendChild(editButton);

  // MODIFIES DELETE BUTTON SO THAT IT CAN BE CLICKED DIRECTLY WITHOUT REFRESHING PAGE
  let deleteButton = document.createElement("button");
  deleteButton.classList = ["modify cancel"];
  deleteButton.innerHTML = "delete";
  deleteButton.addEventListener("click", function (event) {
    deleteCareLog(newRow.idCareLog);
  });
  deleteCell.appendChild(deleteButton);

  // ADDS CELLS TO NEW ROW
  row.appendChild(firstCell);
  row.appendChild(idCell);
  row.appendChild(batCell);
  row.appendChild(personCell);
  row.appendChild(dateTimeCell);
  row.appendChild(weightCell);
  row.appendChild(nutritionCell);
  row.appendChild(medicalCareCell);
  row.appendChild(remarkCell);
  row.appendChild(editCell);
  row.appendChild(deleteCell);

  // ADDS A ROW ATTRIBUTE FOR deleteRow FUNCTION
  // DOUBLE CHECK IF THIS IS ACTUALLY IN USE
  row.setAttribute("data-value", newRow.id);

  // APPENDS NEW ROW TO TABLE
  currentTable.appendChild(row);
};
