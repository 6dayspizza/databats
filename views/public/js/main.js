   // Citation for the following function: 
    //Date: 10/12/2023
    //Copied from /OR/ Adapted from /OR/ Based on: Module 2 activity 1,2,3 code from Dr. Curry
    //Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app 


function showform(dostuff) {
  /*
  * four DIVS: browse, insert, update, delete
  * this function sets one visible the others not
  */
  if (dostuff == 'insert'){
    document.getElementById('browse').style.display = 'none';
    document.getElementById('insert').style.display = 'block';
    document.getElementById('edit').style.display = 'none';
  }
  else if (dostuff == 'edit') { //by default display browse
    document.getElementById('browse').style.display = 'none';
    document.getElementById('insert').style.display = 'none';
    document.getElementById('edit').style.display = 'block';
  }
  else if (dostuff == 'browse') { //by default display browse
    document.getElementById('browse').style.display = 'block';
    document.getElementById('insert').style.display = 'none';
    document.getElementById('edit').style.display = 'none';
  }
}
function newRecord() { showform('insert'); }
function browseRecords() { showform ('browse'); }
function editRecord() { showform ('edit'); }