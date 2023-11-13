// Get the objects we need to modify
let addCareLogForm = document.getElementById('add_carelog_form_ajax');

// Modify the objects we need
addCareLogForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputBat = document.getElementById("input_bat");
    let inputPerson = document.getElementById("input_person");
    let inputWeight = document.getElementById("input_weight");
    let inputFood = document.getElementById("input_food");
    let inputMedicalCare = document.getElementById("input_medical_care");
    let inputRemark = document.getElementById("input_remark");

    // Get the values from the form fields
    let batValue = inputBat.value;
    let personValue = inputPerson.value;
    let weightValue = inputWeight.value;
    let foodValue = inputFood.value;
    let medicalCareValue = inputMedicalCare.value;
    let remarkValue = inputRemark.value;


    // Put our data we want to send in a javascript object
    let data = {
        idBat: batValue,
        idPerson: personValue,
        weight: weightValue,
        food: foodValue,
        medicalCare: medicalCareValue,
        remark: remarkValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_carelog_ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputBat.value = '';
            inputPersom.value = '';
            inputWeight.value = '';
            inputFood.value = '';
            inputMedicalCare.value = '';
            inputRemark.value = '';
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

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let batCell = document.createElement("TD");
    let personCell = document.createElement("TD");
    let weightCell = document.createElement("TD");
    let foodCell = document.createElement("TD");
    let medicalCareCell = document.createElement("TD");
    let remarkCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    batCell.innerText = newRow.idBat;
    personCell.innerText = newRow.idPerson;
    weightCell.innerText = newRow.weight;
    foodCell.innerText = newRow.food;
    medicalCareCell.innerText = newRow.medicalCare;
    remarkCell.innerText = newRow.remark;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(batCell);
    row.appendChild(lastNameCell);
    row.appendChild(personCell);
    row.appendChild(weightCell);
    row.appendChild(foodCell);
    row.appendChild(medicalCareCell);
    row.appendChild(remarkCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}