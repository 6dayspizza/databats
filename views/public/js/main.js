// Citation for the following function: 
//Date: 10/12/2023
//Copied from /OR/ Adapted from /OR/ Based on:  code from Dr. Curry
//Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app 


function showform(dostuff) {
  /*
  * four DIVS: browse, insert, update, delete
  * this function sets one visible the others not
  */
  if (dostuff == 'insert') {
    document.getElementById('browse').style.display = 'none';
    document.getElementById('insert').style.display = 'block';
    document.getElementById('edit').style.display = 'none';
    document.getElementById('search').style.display = 'none';
  } else if (dostuff == 'edit') { //by default display browse
    document.getElementById('browse').style.display = 'none';
    document.getElementById('insert').style.display = 'none';
    document.getElementById('edit').style.display = 'block';
    document.getElementById('search').style.display = 'none';
  } else if (dostuff == 'browse') { //by default display browse
    document.getElementById('browse').style.display = 'block';
    document.getElementById('insert').style.display = 'none';
    document.getElementById('edit').style.display = 'none';
    document.getElementById('search').style.display = 'none';
  } else if (dostuff == 'search') { //by default display browse
    document.getElementById('browse').style.display = 'block';
    document.getElementById('insert').style.display = 'none';
    document.getElementById('edit').style.display = 'none';
    document.getElementById('search').style.display = 'block';
  }
}

function newRecord() { showform('insert'); }
function browseRecords(idCareLog) { showform('browse'); }
function editRecord(idCareLog, name, weight, food, remark) {
  $("#idToUpdate").val(idCareLog);
  $("#input_person_update option").each(function() {
    if ($(this).text() === name) {
      $(this).prop('selected', true);
    } else {
      $(this).prop('selected', false);
    }
  });

  $("#input_weight_update").val(weight);
  $("#input_food_update").val(food);
  $("#input_remark_update").val(remark);

  showform('edit');
}
function searchRecord() { showform('search'); }