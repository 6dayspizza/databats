// Get the objects we need to modify
let updateBatForm = document.getElementById('update-bat-form-ajax');

// Modify the objects we need
updateBatForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputIDBat = document.getElementById("idToUpdate");
    let inputEndDate = document.getElementById("input_enddate_update");
    let inputReleaseSite = document.getElementById("input_releasesite_update");
    let inputStatus= document.getElementById("input_status_update");  
    let inputRemark= document.getElementById("input_remark_update");   

    // Get the values from the form fields
    let idBatValue = inputIDBat.value;
    let endDateValue = inputEndDate.value;
    let releaseSiteValue = inputReleaseSite.value;
    let statusValue = inputStatus.value;
    let remarkValue = inputRemark.value;

    // Put our data we want to send in a javascript object
    let bat = {
        idbat: idBatValue,
        enddate: endDateValue,
        releasesite: releaseSiteValue,
        status: statusValue,
        remark: remarkValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-bat-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // refresh page
            window.location.href = '/bats';

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(bat));

})


function updateRow(bat, idBat) {
    let parsedData = JSON.parse(bat);

    let table = document.getElementById("bats_table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == idBat) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].name;
        }
    }
}