// Citation for the following function:
// Date: 10/12/2023
// Partially based on: code from Dr. Curry
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// GETS OBJECTS TO MODIFY
let addBatForm = document.getElementById("add_bat_form_ajax");

// MODIFIES THIS OBJECT
addBatForm.addEventListener("submit", function (e) {
  // PREVENTS DEFAULT BEHAVIOUR ASSOCIATED WITH EVENT
  // DO NOT REMOVE THIS LINE
  e.preventDefault();

  // ASSIGNS FIELDS FROM FORM WE JUST RECEIVED
  let inputPerson = document.getElementById("input_person");
  let inputSpecies = document.getElementById("input_species");
  let inputSex = document.getElementById("input_sex");
  let inputFoundDate = document.getElementById("input_found_date");
  let inputFoundSite = document.getElementById("input_found_site");
  let inputStatus = document.getElementById("input_status");
  let inputRemark = document.getElementById("input_remark");

  // EXTRACTS VALUES FROM ASSIGNED FIELDS
  let personValue = inputPerson.value;
  let speciesValue = inputSpecies.value;
  let sexValue = inputSex.value;
  let foundDateValue = inputFoundDate.value;
  let foundSiteValue = inputFoundSite.value;
  let statusValue = inputStatus.value;
  let remarkValue = inputRemark.value;

  // PLACES THOSE VALUES IN JS OBJECT
  let data = {
    idPerson: personValue,
    idSpecies: speciesValue,
    sex: sexValue,
    foundDate: foundDateValue,
    foundSite: foundSiteValue,
    idStatus: statusValue,
    remark: remarkValue,
  };

  // SETS UP AJAX REQUEST
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/add-bat-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // DEFINES BEHAVIOUR FOR AJAX
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // ADDS INSERTED DATA TO EXISTING TABLE
      addRowToTable(xhttp.response);

      // CLEARS FORM FIELDS FOR NEW DATA
      inputPerson.value = "";
      inputSpecies.value = "";
      inputSex.value = "";
      inputFoundDate.value = "";
      inputFoundSite.value = "";
      inputStatus.value = "";
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
  let currentTable = document.getElementById("bats_table");

  // GETS LOCATION OF NEW ROW OF CURRENT TABLE
  let newRowIndex = currentTable.rows.length;

  // GETS CURRENT OBJECT
  let parsedData = JSON.parse(data);
  let newRow = parsedData[parsedData.length - 1];

  // CREATES NEW ROW WITH ALL CELLS
  let row = document.createElement("TR");
  let firstCell = document.createElement("TD");
  let idCell = document.createElement("TD");
  let personCell = document.createElement("TD");
  let speciesCell = document.createElement("TD");
  let sexCell = document.createElement("TD");
  let foundDateCell = document.createElement("TD");
  let foundSiteCell = document.createElement("TD");
  let dateEndCell = document.createElement("TD");
  let siteEndCell = document.createElement("TD");
  let statusCell = document.createElement("TD");
  let remarkCell = document.createElement("TD");
  let editCell = document.createElement("TD");
  let deleteCell = document.createElement("TD");

  // FILLS THOSE CELLS
  idCell.innerText = newRow.idBat;
  idCell.classList=["id"]
  personCell.innerText = newRow.person;
  speciesCell.innerText = newRow.species;
  sexCell.innerText = newRow.sex;
  foundDateCell.innerText = newRow.foundDate;
  foundSiteCell.innerText = newRow.foundSite;
  dateEndCell.innerText = newRow.dateEnd || "";
  siteEndCell.innerText = newRow.siteEnd || "";
  statusCell.innerText = newRow.status;
  remarkCell.innerText = newRow.remark;

  // MODIFIES EDIT BUTTON SO THAT IT CAN BE CLICKED DIRECTLY WITHOUT REFRESHING PAGE
  let editButton = document.createElement("button");
    editButton.classList=["modify"];
    editButton.innerHTML = "edit";
    editButton.addEventListener("click", function(event){
        editRecord(newRow.idBat, newRow.endDate, newRow.releaseSite, newRow.status, newRow.remark);
    })
    editCell.appendChild(editButton);

  // MODIFIES DELETE BUTTON SO THAT IT CAN BE CLICKED DIRECTLY WITHOUT REFRESHING PAGE
    let deleteButton = document.createElement("button");
    deleteButton.classList=["modify cancel"];
    deleteButton.innerHTML = "delete";
    deleteButton.addEventListener("click", function(event){
        deleteBat(newRow.idBat);
    })
    deleteCell.appendChild(deleteButton);

  // ADDS CELLS TO NEW ROW
  row.appendChild(firstCell);
  row.appendChild(idCell);
  row.appendChild(personCell);
  row.appendChild(speciesCell);
  row.appendChild(sexCell);
  row.appendChild(foundDateCell);
  row.appendChild(foundSiteCell);
  row.appendChild(dateEndCell);
  row.appendChild(siteEndCell);
  row.appendChild(statusCell);
  row.appendChild(remarkCell);
  row.appendChild(editCell);
  row.appendChild(deleteCell);

  // ADDS A ROW ATTRIBUTE FOR deleteRow FUNCTION
  // DOUBLE CHECK IF THIS IS ACTUALLY IN USE
  row.setAttribute("data-value", newRow.id);

  // APPENDS NEW ROW TO TABLE
  currentTable.appendChild(row);
};
