// Citation for the following function:
//Date: 10/12/2023
//Copied from /OR/ Adapted from /OR/ Based on: code from Dr. Curry
//Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addBatForm = document.getElementById("add_bat_form_ajax");

// Modify the objects we need
addBatForm.addEventListener("submit", function (e) {
  // Prevent the form from sumbitting a default http request
  // DO NOT REMOVE THIS LINE
  e.preventDefault();

  // Get form fields we need to get data from
  let inputPerson = document.getElementById("input_person");
  let inputSpecies = document.getElementById("input_species");
  let inputSex = document.getElementById("input_sex");
  let inputFoundDate = document.getElementById("input_found_date");
  let inputFoundSite = document.getElementById("input_found_site");
  let inputStatus = document.getElementById("input_status");
  let inputRemark = document.getElementById("input_remark");

  // Get the values from the form fields
  let personValue = inputPerson.value;
  let speciesValue = inputSpecies.value;
  let sexValue = inputSex.value;
  let foundDateValue = inputFoundDate.value;
  let foundSiteValue = inputFoundSite.value;
  let statusValue = inputStatus.value;
  let remarkValue = inputRemark.value;

  // Put our data we want to send in a javascript object
  let data = {
    idPerson: personValue,
    idSpecies: speciesValue,
    sex: sexValue,
    foundDate: foundDateValue,
    foundSite: foundSiteValue,
    idStatus: statusValue,
    remark: remarkValue,
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/add-bat-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // Add the new data to the table
      addRowToTable(xhttp.response);

      // Clear the input fields for another transaction
      inputPerson.value = "";
      inputSpecies.value = "";
      inputSex.value = "";
      inputFoundDate.value = "";
      inputFoundSite.value = "";
      inputStatus.value = "";
      inputRemark.value = "";

      browseRecords();
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };

  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
});

// Creates a single row from an Object representing a single record from
// bsg_people
addRowToTable = (data) => {
  // debugger;

  // Get a reference to the current table on the page and clear it out.
  let currentTable = document.getElementById("bats_table");

  // Get the location where we should insert the new row (end of table)
  let newRowIndex = currentTable.rows.length;

  // Get a reference to the new row from the database query (last object)
  let parsedData = JSON.parse(data);
  let newRow = parsedData[parsedData.length - 1];

  // Create a row and 4 cells
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

  // Fill the cells with correct data
  idCell.innerText = newRow.idBat;
  personCell.innerText = newRow.person;
  speciesCell.innerText = newRow.species;
  sexCell.innerText = newRow.sex;
  foundDateCell.innerText = newRow.foundDate;
  foundSiteCell.innerText = newRow.foundSite;
  dateEndCell.innerText = newRow.dateEnd;
  siteEndCell.innerText = newRow.siteEnd;
  statusCell.innerText = newRow.status;
  remarkCell.innerText = newRow.remark;

  // Add the cells to the row
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

  // Add a row attribute so the deleteRow function can find a newly added row
  row.setAttribute("data-value", newRow.id);

  // Add the row to the table
  currentTable.appendChild(row);
};
