/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 9751;                 // Set a port number at the top so it's easy to change in the future
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// DATABASE
var db = require('./database/db-connector')

/*
    ROUTES
*/
app.get('/', function(req, res)
    {  
        let query1 = `SELECT Bats.idBat, Persons.name AS "person", Species.name AS "species", Bats.sex, Bats.foundDate, Bats.foundSite, Bats.endDate, Bats.releaseSite, Status.name as "status", Bats.remark
        FROM Bats
        LEFT JOIN Persons ON Bats.idPerson = Persons.idPerson
        LEFT JOIN Species ON Bats.idSpecies = Species.idSpecies
        LEFT JOIN Status ON Bats.idStatus = Status.idStatus;`;   // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            console.log(rows)
            res.render('index', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                          // will process this file, before sending the finished HTML to the client.                                        // requesting the web site.

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});