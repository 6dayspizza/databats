// Citation for the following function:
// Date: 10/12/2023
// Partially based on: code from Dr. Curry
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// GETS OBJECTS TO MODIFY
let addPersonForm = document.getElementById("add_person_form_ajax");

// MODIFIES THIS OBJECT
addPersonForm.addEventListener("submit", function (e) {
  // PREVENTS DEFAULT BEHAVIOUR ASSOCIATED WITH EVENT
  // DO NOT REMOVE THIS LINE
  e.preventDefault();

  // ASSIGNS FIELDS FROM FORM WE JUST RECEIVED
  let inputName = document.getElementById("input_name");

  // EXTRACTS VALUES FROM ASSIGNED FIELDS
  let nameValue = inputName.value;

  // EXTRACTS VALUES FROM ASSIGNED FIELDS
  let data = {
    name: nameValue,
  };

  // SETS UP AJAX REQUEST
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/add-person-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // DEFINES BEHAVIOUR FOR AJAX
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // ADDS INSERTED DATA TO EXISTING TABLE
      addRowToTable(xhttp.response);

      // CLEARS FORM FIELDS FOR NEW DATA
      inputName.value = "";

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
  let currentTable = document.getElementById("persons_table");

  // GETS LOCATION OF NEW ROW OF CURRENT TABLE
  let newRowIndex = currentTable.rows.length;

  // GETS CURRENT OBJECT
  let parsedData = JSON.parse(data);
  let newRow = parsedData[parsedData.length - 1];

  // CREATES NEW ROW WITH ALL CELLS
  let row = document.createElement("TR");
  let firstCell = document.createElement("TD");
  let idCell = document.createElement("TD");
  let nameCell = document.createElement("TD");
  let deleteCell = document.createElement("TD");

  // MODIFIES DELETE BUTTON SO THAT IT CAN BE CLICKED DIRECTLY WITHOUT REFRESHING PAGE
  let deleteButton = document.createElement("button");
  deleteButton.classList = ["modify cancel"];
  deleteButton.innerHTML = "delete";
  deleteButton.addEventListener("click", function (event) {
    deletePerson(newRow.idPerson);
  });
  deleteCell.appendChild(deleteButton);

  // FILLS THOSE CELLS
  idCell.innerText = newRow.idPerson;
  idCell.classList = ["id"];
  nameCell.innerText = newRow.name;

  // ADDS CELLS TO NEW ROW
  row.appendChild(firstCell);
  row.appendChild(idCell);
  row.appendChild(nameCell);
  row.appendChild(deleteCell);

  // ADDS A ROW ATTRIBUTE FOR deleteRow FUNCTION
  // DOUBLE CHECK IF THIS IS ACTUALLY IN USE
  row.setAttribute("data-value", newRow.id);

  // APPENDS NEW ROW TO TABLE
  currentTable.appendChild(row);
};
