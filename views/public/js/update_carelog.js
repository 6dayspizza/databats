   // Citation for the following function: 
    //Date: 10/12/2023
    //Copied from /OR/ Adapted from /OR/ Based on: code from Dr. Curry
    //Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app 


document.addEventListener("DOMContentLoaded", function(){
    
    let updateForm = document.getElementById('update_carelog_form_ajax');

    updateForm.addEventListener("submit", function (e) {
        e. preventDefault();

        weightUpdate = document.getElementById("update_weight");

        let newWeight = weightUpdate.value;

        let data ={
            weight: newWeight
        }        

        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/update_carelog_ajax", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {

                location.reload(true);

            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }

        xhttp.send(JSON.stringify(data));
    })

});

/*
// Get the objects we need to modify
    let updatePersonForm = document.getElementById('update_ CareLog_form_ajax');

    // Modify the objects we need
    updatePersonForm.addEventListener("submit", function (e) {
    
        // Prevent the form from submitting
        e.preventDefault();

        // Get form fields we need to get data from
        let inputID = document.getElementById("mySelect");
        let inputRemark = document.getElementById("input-remark-update");

        // Get the values from the form fields
        let idValue = inputID.value;
        let remarkValue = inputRemark.value;
        
        // currently the database table for bsg_people does not allow updating values to NULL
        // so we must abort if being bassed NULL for homeworld

        // if (isNaN(homeworldValue)) 
        // {
        //     return;
        // }


        // Put our data we want to send in a javascript object
        let data = {
            id: idValue,
            remark: remarkValue,
        }
        
        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("PUT", "/put_CareLog_ajax", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {

                // Add the new data to the table
                updateRow(xhttp.response, fullNameValue);

            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }

        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));

    })


    function updateRow(data, idCareLog){
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
*/