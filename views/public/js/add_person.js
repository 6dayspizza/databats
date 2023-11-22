    
   // Citation for the following function: 
    //Date: 10/12/2023
    //Copied from /OR/ Adapted from /OR/ Based on: code from Dr. Curry
    //Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app 



// Get the objects we need to modify
let addPersonForm = document.getElementById('add_person_form_ajax');

// Modify the objects we need
addPersonForm.addEventListener("submit", function (e) {
    // Prevent the form from sumbitting a default http request
    // DO NOT REMOVE THIS LINE
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("input_name");

    // Get the values from the form fields
    let nameValue = inputName.value;


    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_person_ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';

            browseRecords()
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // debugger;

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("persons_table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let firstCell = document.createElement("TD");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.idPerson;
    nameCell.innerText = newRow.name;



    // Add the cells to the row
    row.appendChild(firstCell);
    row.appendChild(idCell);
    row.appendChild(nameCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    
    // Add the row to the table
    currentTable.appendChild(row);
}