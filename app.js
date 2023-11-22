/*
    SETUP

    Citation for the following function: 
    Date: 10/12/2023
    Copied from /OR/ Adapted from /OR/ Based on: code from Dr. Curry
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('views/public'))

PORT        = 9751;                 // Set a port number at the top so it's easy to change in the future
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
const hbs = exphbs.create({
    partialsDir: "views/partials",
    extname: ".hbs"
})
app.engine('.hbs', hbs.engine);                 // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.


// DATABASE
var db = require('./database/db-connector')


/*
    ALL GET REQUESTS TO DISPLAY DATA
*/

app.get('/carelogs', function(req, res)
    {  
        let query1 = `SELECT CareLogs.idCareLog, Bats.idBat, Persons.name, CareLogs.dateTime, CareLogs.weight, CareLogs.foodType, CareLogs.remark
        FROM CareLogs
        LEFT JOIN Persons ON CareLogs.idPerson = Persons.idPerson
        LEFT JOIN Bats ON CareLogs.idBat = Bats.idBat;`;       // display CareLogs

        let query2 = `SELECT Bats.idBat FROM Bats;`

        let query3 = `SELECT Persons.name, Persons.idPerson FROM Persons;`

        db.pool.query(query1, function(error, carelogs, fields){    // Execute the query
            db.pool.query(query2, function(error, bats, fields) {
                db.pool.query(query3, function(error, persons, fields){
                    res.render('carelogs', {
                    data: carelogs,
                    bats: bats,
                    persons: persons
                });   
                })
            })
        })                                                      // an object where 'data' is equal to the 'rows' we
    });

app.get('/', (req, res, next) => {
    res.redirect(307, '/bats');
 });

app.get('/bats', function(req, res)
    {  
        let query1 = `SELECT Bats.idBat, Species.name AS "species", Bats.sex, Bats.foundDate, Bats.foundSite, Persons.name AS "person", Bats.endDate, Bats.releaseSite, Status.name AS "status", Bats.remark
        FROM Bats
        LEFT JOIN Persons ON Bats.idPerson = Persons.idPerson
        LEFT JOIN Species ON Bats.idSpecies = Species.idSpecies
        LEFT JOIN Status ON Bats.idStatus = Status.idStatus;`;       // display Bats

        let query2 = `SELECT * FROM Persons;`

        let query3 = `SELECT * FROM Species;`

        let query4 = `SELECT * FROM Status;`

        db.pool.query(query1, function(error, bats, fields){    // Execute the query
            db.pool.query(query2, function(error, persons, fields) {
                db.pool.query(query3, function(error, species, fields){
                    db.pool.query(query4, function(error, status, fields){
                        res.render('bats', {
                            bats: bats,
                            persons: persons,
                            species: species,
                            status: status
                        })
                    })
                });   
                })
            })
    });
        
app.get('/persons', function(req, res)
    {  
        let query1 = `SELECT * FROM Persons;`;       // display Persons

        db.pool.query(query1, function(error, persons, fields){ 
                        res.render('persons', {
                            persons: persons,
                        })
                    })
    });   
        
app.get('/status', function(req, res){  
    let query1 = `SELECT * FROM Status;`;       // display Status

    db.pool.query(query1, function(error, status, fields){ 
                    res.render('status', {
                        status: status,
                    })
                })
    }); 
        
app.get('/species', function(req, res){
    let query1 = `SELECT * FROM Species;`;       // display Status
        db.pool.query(query1, function(error, species, fields){ 
                        res.render('species', {
                            species: species,
                        })
                    })
    });  
        
app.get('/medicalcares', function(req, res)
    {  
        let query1 = `SELECT * FROM MedicalCares;`;       // display MedicalCares

        db.pool.query(query1, function(error, medicalcares, fields){ 
                        res.render('medicalcares', {
                            medicalcares: medicalcares,
                        })
                    })
     });   


/*
    ALL POST REQUESTS TO ADD DATA
*/

app.post('/add_carelog_ajax', function(req, res) {  
    let data = req.body;

    // Capture NULL values
    let person = parseInt(data.person);
    if (isNaN(person))
    {
        person = 'NULL'
    }

    let weight = (Math.round(data.weight * 100) / 100).toFixed(2);

    // Create the query and run it on the database
    query1 = `INSERT INTO CareLogs (idBat, idPerson, weight, foodType, remark)
    VALUES (${data.idBat}, ${data.idPerson}, ${weight}, "${data.food}", "${data.remark}");`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on CareLogs
            query2 = `SELECT CareLogs.idCareLog, Bats.idBat, Persons.name, CareLogs.dateTime, CareLogs.weight, CareLogs.foodType, CareLogs.remark
            FROM CareLogs
            LEFT JOIN Persons ON CareLogs.idPerson = Persons.idPerson
            LEFT JOIN Bats ON CareLogs.idBat = Bats.idBat;`;
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

app.post('/add_bat_ajax', function(req, res) {  
    let data = req.body;

    // Capture NULL values
    let person = parseInt(data.person);
    if (isNaN(person))
    {
        person = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Bats (idPerson, idSpecies, sex, remark, foundDate, foundSite, idStatus)
    VALUES (${data.idPerson}, ${data.idSpecies}, "${data.sex}", "${data.remark}", "${data.foundDate}", ${data.foundSite}, "${data.idStatus}");`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Bats
            query2 = `SELECT Bats.idBat, Species.name AS "species", Bats.sex, Bats.foundDate, Bats.foundSite, Persons.name AS "person", Bats.endDate, Bats.releaseSite, Status.name AS "status", Bats.remark
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

app.post('/add_person_ajax', function(req, res) {  
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Persons (name)
    VALUES ("${data.name}");`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Bats
            query2 = `SELECT * FROM Persons`;
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

app.post('/add_species_ajax', function(req, res) {
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Species (name)
    VALUES ("${data.name}");`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Bats
            query2 = `SELECT * FROM Species`;
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

app.post('/add_status_ajax', function(req, res) {  
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Status (name)
    VALUES ("${data.name}");`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Bats
            query2 = `SELECT * FROM Status`;
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

app.post('/add_medicalcare_ajax', function(req, res) {  
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO MedicalCares (treatment)
    VALUES ("${data.treatment}");`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Bats
            query2 = `SELECT * FROM MedicalCares`;
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
    ALL DELETE REQUESTS TO REMOVE DATA
*/

app.delete('/delete_carelog_ajax/', function(req,res,next){
    let data = req.body;
    let idCareLog = parseInt(data.id);
    let deleteCareLogsMedicalCares = `DELETE FROM CareLogsMedicalCares WHERE idCareLog = ${idCareLog}`;
    let deleteCareLog = `DELETE FROM CareLogs WHERE idCareLog = ${idCareLog}`;
  
  
          // Run the 1st query
          db.pool.query(deleteCareLogsMedicalCares, [idCareLog], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteCareLog, [idCareLog], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                        query2 = `SELECT CareLogs.idCareLog, Bats.idBat, Persons.name, CareLogs.dateTime, CareLogs.weight, CareLogs.foodType, CareLogs.remark
                        FROM CareLogs
                        LEFT JOIN Persons ON CareLogs.idPerson = Persons.idPerson
                        LEFT JOIN Bats ON CareLogs.idBat = Bats.idBat;`;
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
              }
  })});


/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});