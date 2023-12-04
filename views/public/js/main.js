// Citation for the following function:
// Date: 10/12/2023
// Partially based on: code from Dr. Curry
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// METHOD TO DISPLAY ACTIVE FORMS AND HIDE OTHERS
function showform(dostuff) {
  if (dostuff == "insert") {
    document.getElementById("browse").style.display = "none";
    document.getElementById("insert").style.display = "block";
    document.getElementById("edit").style.display = "none";
    document.getElementById("search").style.display = "none";
  } else if (dostuff == "edit") {
    document.getElementById("browse").style.display = "none";
    document.getElementById("insert").style.display = "none";
    document.getElementById("edit").style.display = "block";
    document.getElementById("search").style.display = "none";
  } else if (dostuff == "browse") {
    // DEFAULT DISPLAY
    document.getElementById("browse").style.display = "block";
    document.getElementById("insert").style.display = "none";
    document.getElementById("edit").style.display = "none";
    document.getElementById("search").style.display = "none";
  } else if (dostuff == "search") {
    document.getElementById("browse").style.display = "block";
    document.getElementById("insert").style.display = "none";
    document.getElementById("edit").style.display = "none";
    document.getElementById("search").style.display = "block";
  }
}

function newRecord() {
  showform("insert");
}

function browseRecords(idCareLog) {
  showform("browse");
}

function searchRecord() {
  showform("search");
}

function editRecord(idCareLog, name, weight, food, remark) {
  // INSERTS VALUES OF EXISTING RECORD TO BE EDITED
  $("#idToUpdate").val(idCareLog);
  $("#input_person_update option").each(function () {
    if ($(this).text() === name) {
      $(this).prop("selected", true);
    } else {
      $(this).prop("selected", false);
    }
  });

  $("#input_weight_update").val(weight);
  $("#input_food_update").val(food);
  $("#input_remark_update").val(remark);

  showform("edit");
}

function editBat(idBat, endDate, releaseSite, status, remark) {
  // INSERTS VALUES OF EXISTING RECORD TO BE EDITED
  $("#idToUpdate").val(idBat);
  $("#input_status_update option").each(function () {
    if ($(this).text() === status) {
      $(this).prop("selected", true);
    } else {
      $(this).prop("selected", false);
    }
  });

  $("#input_enddate_update").val(endDate);
  $("#input_releasesite_update").val(releaseSite);
  $("#input_remark_update").val(remark);

  showform("edit");
}

function enterDatabase() {
  window.location.href = "/bats";
}
