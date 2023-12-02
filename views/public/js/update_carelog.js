// Get the objects we need to modify
let updateCareLogForm = document.getElementById('update-carelog-form-ajax');

// Modify the objects we need
updateCareLogForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputIDCareLog = document.getElementById("idToUpdate");
    let inputPerson = document.getElementById("input_person_update");
    let inputWeight = document.getElementById("input_weight_update");
    let inputFoodType= document.getElementById("input_food_update");  
    let inputmedicalcares = document.getElementById("input_medical_care_update")
    let inputRemark= document.getElementById("input_remark_update");   

    // Get the values from the form fields
    let idCareLogValue = inputIDCareLog.value;
    let personValue = inputPerson.value;
    let weightValue = inputWeight.value;
    let medicalcareValue = inputmedicalcares.value;
    let remarkValue = inputRemark.value;
    let foodTypeValue = inputFoodType.value;

    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    if (isNaN(personValue)) {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        idcarelog: idCareLogValue,
        person: personValue,
        weight: weightValue,
        medical: medicalcareValue,
        remark: remarkValue,
        foodtype: foodTypeValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-carelog-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, idCareLogValue);
            window.location.href = '/carelogs';

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, idCareLog) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("carelogs_table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == idCareLog) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].name;
        }
    }
}