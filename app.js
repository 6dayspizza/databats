/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

PORT        = 9751;                 // Set a port number at the top so it's easy to change in the future
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
const hbs = exphbs.create({
    partialsDir: "views/partials",
    extname: ".hbs"
})
app.engine('.hbs', hbs.engine);                 // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.
app.use(express.static('assets'));

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

// app.js - ROUTES section

app.post('/add_bat_ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let homeworld = parseInt(data.homeworld);
    if (isNaN(homeworld))
    {
        homeworld = 'NULL'
    }

    let age = parseInt(data.age);
    if (isNaN(age))
    {
        age = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Bats (idPerson, idSpecies, sex, remark, foundDate, foundSite, idStatus) VALUES ('${data.idPerson}', '${data.idSpecies}', ${sex}, ${remark},  ${foundDate},  ${foundSite})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT Bats.idBat, Persons.name AS "person", Species.name AS "species", Bats.sex, Bats.foundDate, Bats.foundSite, Bats.endDate, Bats.releaseSite, Status.name as "status", Bats.remark
            FROM Bats
            LEFT JOIN Persons ON Bats.idPerson = Persons.idPerson
            LEFT JOIN Species ON Bats.idSpecies = Species.idSpecies
            LEFT JOIN Status ON Bats.idStatus = Status.idStatus;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});