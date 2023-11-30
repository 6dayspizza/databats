    
   // Citation for the following function: 
    //Date: 10/12/2023
    //Copied from /OR/ Adapted from /OR/ Based on: code from Dr. Curry
    //Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app 



// Get the objects we need to modify
let addCareLogForm = document.getElementById('add_carelog_form_ajax');

// Modify the objects we need
addCareLogForm.addEventListener("submit", function (e) {
    // Prevent the form from sumbitting a default http request
    // DO NOT REMOVE THIS LINE
    e.preventDefault();

    // Get form fields we need to get data from
    let inputBat = document.getElementById("input_bat");
    let inputPerson = document.getElementById("input_person");
    let inputWeight = document.getElementById("input_weight");
    let inputFood = document.getElementById("input_food");
    let inputsMedicalCare = Array.from(document.getElementsByClassName("input_medical_care"));
    let inputRemark = document.getElementById("input_remark");

    // Get the values from the form fields
    let batValue = inputBat.value;
    let personValue = inputPerson.value;
    let weightValue = inputWeight.value;
    let foodValue = inputFood.value;
    let medicalCareValues = inputsMedicalCare.filter(function(input){return input.checked === true}).map(function(input){return input.value});
    let remarkValue = inputRemark.value;


    // Put our data we want to send in a javascript object
    let data = {
        idBat: batValue,
        idPerson: personValue,
        weight: weightValue,
        food: foodValue,
        medicalCares: medicalCareValues,
        remark: remarkValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-carelog-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputBat.value = '';
            inputPerson.value = '';
            inputWeight.value = '';
            inputFood.value = '';
            inputsMedicalCare.forEach(input => input.checked = false);
            inputRemark.value = '';

            browseRecords();
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

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("carelogs_table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let firstCell = document.createElement("TD");
    let idCell = document.createElement("TD");
    let batCell = document.createElement("TD");
    let personCell = document.createElement("TD");
    let dateTimeCell = document.createElement("TD");
    let weightCell = document.createElement("TD");
    let foodCell = document.createElement("TD");
    let medicalCareCell = document.createElement("TD");
    let remarkCell = document.createElement("TD");
    let editCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.idCareLog;
    idCell.classList=["id"]
    batCell.innerText = newRow.idBat;
    personCell.innerText = newRow.name;
    dateTimeCell.innerText = newRow.dateTime;
    weightCell.innerText = newRow.weight;
    foodCell.innerText = newRow.foodType;
    medicalCareCell.innerText = newRow.medicalCares || "";
    remarkCell.innerText = newRow.remark;

    let editButton = document.createElement("button");
    editButton.classList=["modify"];
    editButton.innerHTML = "edit";
    editButton.addEventListener("click", function(event){
        editRecord(newRow.idCareLog, newRow.name, newRow.weight, newRow.foodType, newRow.remark);
    })
    editCell.appendChild(editButton);

    let deleteButton = document.createElement("button");
    deleteButton.classList=["modify accent"];
    deleteButton.innerHTML = "delete";
    deleteButton.addEventListener("click", function(event){
        deleteCareLog(newRow.idCareLog);
    })
    deleteCell.appendChild(deleteButton);



    // Add the cells to the row
    row.appendChild(firstCell);
    row.appendChild(idCell);
    row.appendChild(batCell);
    row.appendChild(personCell);
    row.appendChild(dateTimeCell);
    row.appendChild(weightCell);
    row.appendChild(foodCell);
    row.appendChild(medicalCareCell);
    row.appendChild(remarkCell);
    row.appendChild(editCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    
    // Add the row to the table
    currentTable.appendChild(row);


}