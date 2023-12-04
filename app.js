/*
    Citation for the following function:
    Date: 10/12/2023
    Partially based on: code from Dr. Curry
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/


/*
    SETUP
*/

var express = require("express");
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("views/public"));

PORT = 9751;
const { engine } = require("express-handlebars");
var exphbs = require("express-handlebars");
const hbs = exphbs.create({
  partialsDir: "views/partials",
  extname: ".hbs",
});
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

// DATABASE
var db = require("./database/db-connector");


/*
    ALL GET REQUESTS TO DISPLAY DATA
*/

app.get("/", (req, res, next) => {
  res.redirect(307, "/homepage");
});

app.get("/homepage", function(req, res) {
  res.render("homepage")
})

app.get("/carelogs", function (req, res) {
// DEFINES QUERIES
  let selectCareLogsQuery = `SELECT CareLogs.idCareLog, Bats.idBat, Persons.name, CareLogs.dateTime, CareLogs.weight, CareLogs.foodType, CareLogs.remark, GROUP_CONCAT(MedicalCares.treatment SEPARATOR '; ') AS medicalCares
  FROM CareLogs
  LEFT JOIN Persons ON CareLogs.idPerson = Persons.idPerson
  LEFT JOIN Bats ON CareLogs.idBat = Bats.idBat
  LEFT JOIN CareLogsMedicalCares ON CareLogs.idCareLog = CareLogsMedicalCares.idCareLog
  LEFT JOIN MedicalCares ON MedicalCares.idMedicalCare = CareLogsMedicalCares.idMedicalCare
  GROUP BY CareLogs.idCareLog;`;

  let selectBatsQuery = `SELECT Bats.idBat FROM Bats;`;

  let selectPersonsQuery = `SELECT Persons.name, Persons.idPerson FROM Persons;`;

  let selectMedicalCaresQuery = `SELECT MedicalCares.treatment, MedicalCares.idMedicalCare FROM MedicalCares;`;

    // EXECUTES QUERIES
  db.pool.query(selectCareLogsQuery, function (error, carelogs, fields) {
    db.pool.query(selectBatsQuery, function (error, bats, fields) {
      db.pool.query(selectPersonsQuery, function (error, persons, fields) {
        db.pool.query(selectMedicalCaresQuery, function (error, medicalcares, fields) {
          res.render("carelogs", {
            active: { carelogs: true },
            carelogs: carelogs,
            bats: bats,
            persons: persons,
            medicalcares: medicalcares,
          });
        });
      });
    });
  });
});

app.get("/bats", function (req, res) {
    // DEFINES QUERIES
  let selectBatsQuery = `SELECT Bats.idBat, Species.name AS "species", Bats.sex, Bats.foundDate, Bats.foundSite, Persons.name AS "person", Bats.endDate, Bats.releaseSite, Status.name AS "status", Bats.remark
        FROM Bats
        LEFT JOIN Persons ON Bats.idPerson = Persons.idPerson
        LEFT JOIN Species ON Bats.idSpecies = Species.idSpecies
        LEFT JOIN Status ON Bats.idStatus = Status.idStatus;`;

  let selectPersonsQuery = `SELECT * FROM Persons;`;

  let selectSpeciesQuery = `SELECT * FROM Species;`;

  let selectStatusQuery = `SELECT * FROM Status;`;

    // EXECUTES QUERIES
  db.pool.query(selectBatsQuery, function (error, bats, fields) {
    db.pool.query(selectPersonsQuery, function (error, persons, fields) {
      db.pool.query(selectSpeciesQuery, function (error, species, fields) {
        db.pool.query(selectStatusQuery, function (error, status, fields) {
          res.render("bats", {
            active: { bats: true },
            bats: bats,
            persons: persons,
            species: species,
            status: status,
          });
        });
      });
    });
  });
});

app.get("/persons", function (req, res) {
    // DEFINES QUERIES
  let selectPersonsQuery = `SELECT * FROM Persons;`;

    // EXECUTES QUERIES
  db.pool.query(selectPersonsQuery, function (error, persons, fields) {
    res.render("persons", {
      active: { persons: true },
      persons: persons,
    });
  });
});

app.get("/status", function (req, res) {
    // DEFINES QUERIES
  let selectStatusQuery = `SELECT * FROM Status;`;

    // EXECUTES QUERIES
  db.pool.query(selectStatusQuery, function (error, status, fields) {
    res.render("status", {
      active: { status: true },
      status: status,
    });
  });
});

app.get("/species", function (req, res) {
    // DEFINES QUERIES
  let selectSpeciesQuery = `SELECT * FROM Species;`;

    // EXECUTES QUERIES
  db.pool.query(selectSpeciesQuery, function (error, species, fields) {
    res.render("species", {
      active: { species: true },
      species: species,
    });
  });
});

app.get("/medicalcares", function (req, res) {
    // DEFINES QUERIES
  let selectMedicalCaresQuery = `SELECT * FROM MedicalCares;`;

    // EXECUTES QUERIES
  db.pool.query(selectMedicalCaresQuery, function (error, medicalcares, fields) {
    res.render("medicalcares", {
      active: { medicalcares: true },
      medicalcares: medicalcares,
    });
  });
});

// THIS GET IS JUST FOR INTERNAL CHECKS AND IS NOT DISPLAYED IN THE WEBSITE MENU
app.get("/carelogsmedicalcares", function (req, res) {
    // DEFINES QUERIES
  let selectCareLogsMedicalCaresQuery = `SELECT * FROM CareLogsMedicalCares;`; // display CareLogsMedicalCares

    // EXECUTES QUERIES
  db.pool.query(selectCareLogsMedicalCaresQuery, function (error, carelogsmedicalcares, fields) {
    res.render("carelogsmedicalcares", {
      active: { carelogsmedicalcares: true },
      carelogsmedicalcares: carelogsmedicalcares,
    });
  });
});

/*
    ALL POST REQUESTS TO ADD DATA
*/

app.post("/add-carelog-ajax", function (req, res) {
  let data = req.body;

  let weight = (Math.round(data.weight * 100) / 100).toFixed(2);
  let idPerson = parseInt(data.idPerson);

  // CAPTURES EMPTY VALUES AND SET TO NULL
  if (isNaN(idPerson)) {
    idPerson = null;
  }

  // CREATES QUERIES AND RUNS
  let insertCareLogsQuery = `INSERT INTO CareLogs (idBat, idPerson, weight, foodType, remark)
    VALUES (${data.idBat}, ${idPerson}, ${weight}, "${data.food}", "${data.remark}");`;

  db.pool.query(insertCareLogsQuery, function (error, rows, fields) {
    // CHECKS FOR ERRORS
    if (error) {
      // LOGS ERROR WITH 400 BAD REQUEST
      console.log(error);
      res.sendStatus(400);
    } else {
      let idCareLog = rows.insertId;

      let insertCareLogsMedicalCaresQuery = `INSERT INTO CareLogsMedicalCares (idCareLog, idMedicalCare)
            VALUES ${data.medicalCares.map(function (medicalCare) {
        return "(" + idCareLog + "," + medicalCare + ")";
      })};`;

      db.pool.query(insertCareLogsMedicalCaresQuery, function (error, rows, fields) {
        console.log(rows);
        // IF NO ERROR THEN DISPLAYS DATA
        let selectCareLogsQuery = `SELECT CareLogs.idCareLog, Bats.idBat, Persons.name, CareLogs.dateTime, CareLogs.weight, CareLogs.foodType, CareLogs.remark, GROUP_CONCAT(MedicalCares.treatment SEPARATOR '; ') AS medicalCares
        FROM CareLogs
        LEFT JOIN Persons ON CareLogs.idPerson = Persons.idPerson
        LEFT JOIN Bats ON CareLogs.idBat = Bats.idBat
        LEFT JOIN CareLogsMedicalCares ON CareLogs.idCareLog = CareLogsMedicalCares.idCareLog
        LEFT JOIN MedicalCares ON MedicalCares.idMedicalCare = CareLogsMedicalCares.idMedicalCare
        GROUP BY CareLogs.idCareLog;`;

        db.pool.query(selectCareLogsQuery, function (error, rows, fields) {
          // CHECKS FOR ERRORS
          if (error) {
            // LOGS ERROR WITH 400 BAD REQUEST
            console.log(error);
            res.sendStatus(400);
          }
          // IF NO ERROR SENDS RESULT OF QUERY
          else {
            res.send(rows);
          }
        });
      });
    }
  });
});

app.post("/add-bat-ajax", function (req, res) {
  let data = req.body;

  // CAPTURES EMPTY VALUES AND SET TO NULL
  let person = parseInt(data.person);
  if (isNaN(person)) {
    idPerson = null;
  }

  // CREATES QUERIES AND RUNS
  insertBatsQuery = `INSERT INTO Bats (idPerson, idSpecies, sex, remark, foundDate, foundSite, idStatus)
    VALUES (${data.idPerson}, ${data.idSpecies}, "${data.sex}", "${data.remark}", "${data.foundDate}", ${data.foundSite}, "${data.idStatus}");`;
  db.pool.query(insertBatsQuery, function (error, rows, fields) {
    // CHECKS FOR ERRORS
    if (error) {
      // LOGS ERROR WITH 400 BAD REQUEST
      console.log(error);
      res.sendStatus(400);
    } else {
      // IF NO ERROR THEN DISPLAYS DATA
      let selectBatsQuery  = `SELECT Bats.idBat, Species.name AS "species", Bats.sex, Bats.foundDate, Bats.foundSite, Persons.name AS "person", Bats.endDate, Bats.releaseSite, Status.name AS "status", Bats.remark
            FROM Bats
            LEFT JOIN Persons ON Bats.idPerson = Persons.idPerson
            LEFT JOIN Species ON Bats.idSpecies = Species.idSpecies
            LEFT JOIN Status ON Bats.idStatus = Status.idStatus;`;
      db.pool.query(selectBatsQuery, function (error, rows, fields) {
        // CHECKS FOR ERRORS
        if (error) {
          // LOGS ERROR WITH 400 BAD REQUEST
          console.log(error);
          res.sendStatus(400);
        }
        // IF NO ERROR SENDS RESULT OF QUERY
        else {
          res.send(rows);
        }
      });
    }
  });
});

app.post("/add-person-ajax", function (req, res) {
  let data = req.body;

  // CREATES QUERIES AND RUNS
  let insertPersonsQuery  = `INSERT INTO Persons (name)
    VALUES ("${data.name}");`;
  db.pool.query(insertPersonsQuery, function (error, rows, fields) {
   // CHECKS FOR ERRORS
    if (error) {
      // LOGS ERROR WITH 400 BAD REQUEST
      console.log(error);
      res.sendStatus(400);
    } else {
      // // IF NO ERROR THEN DISPLAYS DATA
      let selectPersonsQuery= `SELECT * FROM Persons`;
      db.pool.query(selectPersonsQuery, function (error, rows, fields) {
        // CHECKS FOR ERRORS
        if (error) {
          // LOGS ERROR WITH 400 BAD REQUEST
          console.log(error);
          res.sendStatus(400);
        }
        // IF NO ERROR SENDS RESULT OF QUERY
        else {
          res.send(rows);
        }
      });
    }
  });
});

app.post("/add-species-ajax", function (req, res) {
  let data = req.body;

  // CREATES QUERIES AND RUNS
  let insertSpeciesQuery = `INSERT INTO Species (name)
    VALUES ("${data.name}");`;
    
  db.pool.query(insertSpeciesQuery, function (error, rows, fields) {
    // CHECKS FOR ERRORS
    if (error) {
      // LOGS ERROR WITH 400 BAD REQUEST
      console.log(error);
      res.sendStatus(400);
    } else {
      // IF NO ERROR THEN DISPLAYS DATA
      let selectSpeciesQuery = `SELECT * FROM Species`;
      db.pool.query(selectSpeciesQuery, function (error, rows, fields) {
        // CHECKS FOR ERRORS
        if (error) {
          // LOGS ERROR WITH 400 BAD REQUEST
          console.log(error);
          res.sendStatus(400);
        }
        // IF NO ERROR SENT RESULT OF QUERY
        else {
          res.send(rows);
        }
      });
    }
  });
});

app.post("/add-status-ajax", function (req, res) {
  let data = req.body;

  // CREATES QUERIES AND RUN
  let insertStatusQuery = `INSERT INTO Status (name)
    VALUES ("${data.name}");`;
    
  db.pool.query(insertStatusQuery, function (error, rows, fields) {
    // CHECKS FOR ERRORS
    if (error) {
      // LOGS ERROR WITH 400 BAD REQUEST
      console.log(error);
      res.sendStatus(400);
    } else {
      // IF NO ERROR THEN DISPLAYS DATA
      let selectStatusQuery = `SELECT * FROM Status`;
      db.pool.query(selectStatusQuery, function (error, rows, fields) {
        // CHECKS FOR ERRORS
        if (error) {
          // LOGS ERROR WITH 400 BAD REQUEST
          console.log(error);
          res.sendStatus(400);
        }
        // IF NO ERROR SENDS RESULT OF QUERY
        else {
          res.send(rows);
        }
      });
    }
  });
});

app.post("/add-medicalcare-ajax", function (req, res) {
  let data = req.body;

  // CREATES QUERIES AND RUNS
  let insertMedicalCaresQuery = `INSERT INTO MedicalCares (treatment)
    VALUES ("${data.treatment}");`;
    
  db.pool.query(insertMedicalCaresQuery, function (error, rows, fields) {
    // CHECKS FOR ERRORS
    if (error) {
      // LOGS ERROR WITH 400 BAD REQUEST
      console.log(error);
      res.sendStatus(400);
    } else {
      // IF NO ERROR THEN DISPLAYS DATA
      let selectMedicalCaresQuery = `SELECT * FROM MedicalCares`;
        
      db.pool.query(selectMedicalCaresQuery, function (error, rows, fields) {
        // CHECKS FOR ERRORS
        if (error) {
          // LOGS ERROR WITH 400 BAD REQUEST
          console.log(error);
          res.sendStatus(400);
        }
        // IF NO ERROR SENDS RESULT OF QUERY
        else {
          res.send(rows);
        }
      });
    }
  });
});

/*
    ALL DELETE REQUESTS TO REMOVE DATA
*/

app.delete("/delete-carelog-ajax/", function (req, res, next) {
  let data = req.body;
  let idCareLog = parseInt(data.id);

    // DEFINES QUERIES
  let deleteCareLogMedicalCareQuery = `DELETE FROM CareLogsMedicalCares WHERE idCareLog = ${idCareLog}`;
  let deleteCareLogQuery = `DELETE FROM CareLogs WHERE idCareLog = ${idCareLog}`;

  // RUNS FIRST QUERY
  db.pool.query(
    deleteCareLogMedicalCareQuery,
    [idCareLog],
    function (error, rows, fields) {
      if (error) {
        // LOGS ERROR WITH 400 BAD REQUEST
        console.log(error);
        res.sendStatus(400);
      } else {
        // RUNS SECOND QUERY
        db.pool.query(
          deleteCareLogQuery,
          [idCareLog],
          function (error, rows, fields) {
            if (error) {
            // LOGS ERROR WITH 400 BAD REQUEST
              console.log(error);
              res.sendStatus(400);
            } else {
                // IF NO ERROR THEN DISPLAYS DATA
              let selectCareLogsQuery = `SELECT CareLogs.idCareLog, Bats.idBat, Persons.name, CareLogs.dateTime, CareLogs.weight, CareLogs.foodType, CareLogs.remark
                        FROM CareLogs
                        LEFT JOIN Persons ON CareLogs.idPerson = Persons.idPerson
                        LEFT JOIN Bats ON CareLogs.idBat = Bats.idBat;`;
              db.pool.query(selectCareLogsQuery, function (error, rows, fields) {
                // If there was an error on the second query, send a 400
                if (error) {
                  // LOGS ERROR WITH 400 BAD REQUEST
                  console.log(error);
                  res.sendStatus(400);
                }
                // IF NO ERROR SENDS RESULT OF QUERY
                else {
                  res.sendStatus(204);
                }
              });
            }
          }
        );
      }
    }
  );
});

app.delete("/delete-bat-ajax/", function (req, res, next) {

    // DEFINES QUERIES
  let data = req.body;
  let idBat = parseInt(data.id);
  let deleteCareLogMedicalCareQuery = `DELETE clmc FROM CareLogsMedicalCares clmc JOIN CareLogs cl ON clmc.idCareLog = cl.idCareLog WHERE cl.idBat = ${idBat}`;
  let deleteCareLogQuery = `DELETE FROM CareLogs WHERE idBat = ${idBat}`;
  let deleteBatQuery = `DELETE FROM Bats WHERE idBat = ${idBat}`;

    // EXECUTES QUERIES
  db.pool.query(
    deleteCareLogMedicalCareQuery, [idBat],
    function (error, rows, fields) {
      if (error) {
        // LOGS ERROR WITH 400 BAD REQUEST
        console.log(error);
        res.sendStatus(400);
      } else {
        db.pool.query(deleteCareLogQuery,
          [idBat],
          function (error, rows, fields) {
            if (error) {
              // LOGS ERROR WITH 400 BAD REQUEST
              console.log(error);
              res.sendStatus(400);
            } else {
              // RUNS SECOND QUERY
              db.pool.query(
                deleteBatQuery,
                [idBat],
                function (error, rows, fields) {
                  if (error) {
                      // LOGS ERROR WITH 400 BAD REQUEST
                    console.log(error);
                    res.sendStatus(400);
                  } else {
                    let selectBatsQuery = `SELECT Bats.idBat, Species.name AS "species", Bats.sex, Bats.foundDate, Bats.foundSite, Persons.name AS "person", Bats.endDate, Bats.releaseSite, Status.name AS "status", Bats.remark
              FROM Bats
              LEFT JOIN Persons ON Bats.idPerson = Persons.idPerson
              LEFT JOIN Species ON Bats.idSpecies = Species.idSpecies
              LEFT JOIN Status ON Bats.idStatus = Status.idStatus;`;
                    db.pool.query(selectBatsQuery, function (error, rows, fields) {
                      // CHECKS FOR ERRORS
                      if (error) {
                        // LOGS ERROR WITH 400 BAD REQUEST
                        console.log(error);
                        res.sendStatus(400);
                      }
                      // IF NO ERROR SENDS RESULT OF QUERY
                      else {
                        res.sendStatus(204);
                      }
                    });
                  }
                }
              );
            }
          }
        );
      };
    });
});


app.delete("/delete-person-ajax/", function (req, res, next) {
  let person = req.body;
  let idPerson = parseInt(person.id);

    // DEFINES QUERIES
  let deletePersonQuery = `DELETE FROM Persons WHERE idPerson = ${idPerson}`;

    // EXECUTES QUERIES
  db.pool.query(
    deletePersonQuery,
    [idPerson],
    function (error, rows, fields) {
        // CHECK FOR ERRORS
      if (error) {
          // LOG ERROR WITH 400 BAD REQUEST
        console.log(error);
        res.sendStatus(400);
      } else {
        let selectPersonQuery = `SELECT * from Persons`;
        db.pool.query(selectPersonQuery, function (error, rows, fields) {
          // CHECK FOR ERRORS
          if (error) {
            // LOG ERROR WITH 400 BAD REQUEST
            console.log(error);
            res.sendStatus(400);
          }
          // IF NO ERROR SENDS RESULT OF QUERY
          else {
            res.sendStatus(204);
          }
        });
      }
    }
  );
});

app.delete("/delete-species-ajax/", function (req, res, next) {
  let species = req.body;
  let idSpecies = parseInt(species.id);

    // DEFINES QUERIES
  let deleteSpecies = `DELETE FROM Species WHERE idSpecies = ${idSpecies}`;

    // EXECUTES QUERIES
  db.pool.query(
    deleteSpecies,
    [idSpecies],
    function (error, rows, fields) {
        // CHECKS FOR ERRORS
      if (error) {
          // LOGS ERROR WITH 400 BAD REQUEST
        console.log(error);
        res.sendStatus(400);
      } else {
        let selectSpeciesQuery = `SELECT * from Species`;
        db.pool.query(selectSpeciesQuery, function (error, rows, fields) {
          // CHECKS FOR ERRORS
          if (error) {
            // LOGS ERROR WITH 400 BAD REQUEST
            console.log(error);
            res.sendStatus(400);
          }
          // IF NO ERROR SENDS RESULT OF QUERY
          else {
            res.sendStatus(204);
          }
        });
      }
    }
  );
});

app.delete("/delete-status-ajax/", function (req, res, next) {
  let status = req.body;
  let idStatus = parseInt(status.id);

    // DEFINES QUERIES
  let deleteStatus = `DELETE FROM Status WHERE idStatus = ${idStatus}`;

    // EXECUTES QUERIES
  db.pool.query(
    deleteStatus,
    [idStatus],
    function (error, rows, fields) {
        // CHECKS FOR ERRORS
      if (error) {
          // LOGS ERROR WITH 400 BAD REQUEST
        console.log(error);
        res.sendStatus(400);
      } else {
        let selectStatusQuery = `SELECT * from Status`;
        db.pool.query(selectStatusQuery, function (error, rows, fields) {
          // CHECKS FOR ERRORS
          if (error) {
            // LOGs ERROR WITH 400 BAD REQUEST
            console.log(error);
            res.sendStatus(400);
          }
          // IF NO ERROR SENDS RESULT OF QUERY
          else {
            res.sendStatus(204);
          }
        });
      }
    }
  );
});

/*
    ALL UPDATE REQUESTS TO EDIT DATA
*/

app.put('/put-carelog-ajax', function (req, res, next) {
  let data = req.body;

    // ASSIGNS EACH DATA
  let person = parseInt(data.person);
  let idcarelog = parseInt(data.idcarelog);
  let weight = parseFloat(data.weight);
  let foodtype = data.foodtype;
  let medicalcares = data.medicalcares;
  let remark = data.remark;

    // DEFINES QUERIES
  let previousMedicalCaresQuery = `SELECT idMedicalCare From CareLogsMedicalCares where idCarelog = ${idcarelog}`
  let queryUpdatePerson = `UPDATE CareLogs SET idPerson = ?, weight = ?, foodType = ?, remark = ? WHERE CareLogs.idCareLog = ?`;
  let selectPerson = `SELECT * FROM Persons WHERE idPerson = ?`

  // EXECUTES FIRST QUERY
  db.pool.query(queryUpdatePerson, [person, weight, foodtype, remark, idcarelog], function (error, rows, fields) {
    // CHECKS FOR ERRORS
      if (error) {
      // LOGS ERROR WITH 400 BAD REQUEST
      console.log(error);
      res.sendStatus(400);
    }

       // IF NO ERROR THEN RUNS NEXT QUERY
    else {
      db.pool.query(previousMedicalCaresQuery, [idcarelog], function (erorr, rows, fields) {

          // THIS IS FOR THE INTERSECION TABLE
          // DEFINES EMPTY ARRAYS TO DISTINGUISH BETWEEN PREVIOUS MEDICAL CARE IDS AND NEW MEDICAL CARE IDS
        let medicalCaresToAdd = [];
        let medicalCaresToDelete = [];
        let oldMedicalCares = rows.map(RowDataPacket => RowDataPacket.idMedicalCare);
        let newMedicalCaresStrings = medicalcares;
        let newMedicalCares = [];

          // CREATES STRING ARRAY WITH NEW MEDICAL CARES IDS
        newMedicalCaresStrings.forEach(ele => newMedicalCares.push(+ele));

          // FUNCTION TO COMPARE OLD AND NOW OBSOLETE AND NEW MEDICAL CARE TREATMENTS
        function compareMedicalCares(oldMedicalCares, newMedicalCares) {
          // STORES MEDICAL CARE IDS THAT HAVE TO BE DELETED
          let medicalCaresToDelete = oldMedicalCares.filter(oldCare => !newMedicalCares.includes(oldCare));

          // STORES MEDICAL CARE IDS THAT HAVE TO BE CREATED
          let medicalCaresToAdd = newMedicalCares.filter(newCare => !oldMedicalCares.includes(newCare));

          return {
            medicalCaresToDelete,
            medicalCaresToAdd
          };
        }

          // STORES RESULTS
        let result = compareMedicalCares(oldMedicalCares, newMedicalCares);
        medicalCaresToDelete = result.medicalCaresToDelete.map(number => number.toString());
        medicalCaresToAdd = result.medicalCaresToAdd.map(number => number.toString());

          // NOW CREATES NEW CARELOGSMEDICALCARES RECORDS
        let addMedicalCaresQuery = `INSERT INTO CareLogsMedicalCares (idCareLog, idMedicalCare)
        VALUES ${medicalCaresToAdd.map(function (medicalCare) {
          return "(" + idcarelog + "," + medicalCare + ")";
        })};`;

          // NOW DELETES OBSOLETE CARELOGSMEDICALCARES RECORDS
        let deleteMedicalCaresQuery = `DELETE FROM CareLogsMedicalCares 
        WHERE idCareLog = ${idcarelog} 
          AND idMedicalCare IN (${medicalCaresToDelete.join(',')});`;

        db.pool.query(deleteMedicalCaresQuery, function (erorr, rows, fields) {
          db.pool.query(addMedicalCaresQuery, function (error, rows, fields) {
            db.pool.query(selectPerson, [person], function (error, rows, fields) {
        // CHECKS FOR ERRORS
              if (error) {
                  // LOGS ERROR WITH 400 BAD REQUEST
                console.log(error);
                res.sendStatus(400);
              } else {
                res.send(rows);
              }
            })
          })
        }
        )
      })
    }
  })
});

app.put('/put-bat-ajax', function (req, res, next) {
  let bat = req.body;

        // ASSIGNS EACH DATA
  let idbat = parseInt(bat.idbat);
  let enddate = bat.enddate;
  let releasesite = parseInt(bat.releasesite);
  let status = bat.status;
  let remark = bat.remark;

  // CAPTURES EMPTY STRING VALUES AND SET TO NULL
  enddate = enddate.trim() === "" ? null : enddate;
  remark = remark.trim() === "" ? null : remark;

  // CAPTURES EMPPY INT VALUES AND SET TO NULL
  if (isNaN(releasesite)) {
    releasesite = null;
  }

    // DEFINES QUERIES
  let updateBatQuery = `UPDATE Bats SET endDate = ?, releaseSite = ?, idStatus = ?, remark = ? WHERE Bats.idBat = ?`;
  let selectStatusQuery = `SELECT * FROM Status WHERE idStatus = ?`

  // RUNS FIRST QUERY
  db.pool.query(updateBatQuery, [enddate, releasesite, status, remark, idbat], function (error, rows, fields) {
      // CHECK FOR ERRORS
    if (error) {
      // LOG ERROR WITH 400 BAD REQUEST
      console.log(error);
      res.sendStatus(400);
    }
    // IF NO ERROR THEN RUNS NEXT QUERY
    else {
      db.pool.query(selectStatusQuery, [status], function (error, rows, fields) {
// CHECK FOR ERRORS
        if (error) {
            // LOG ERROR WITH 400 BAD REQUEST
          console.log(error);
          res.sendStatus(400);
        } else {
          res.send(rows);
        }
      })
    }
  })
});


/*
    SEARCH
*/

app.get("/carelogssearch", function (req, res) {

    // DEFINES QUERIES
  let selectCareLogsQuery;
  let selectBatsQuery;
  let selectPersonsQuery;
  let selectMedicalCaresQuery;

  if (req.query.inputid === undefined) {
    selectCareLogsQuery = `SELECT CareLogs.idCareLog, Bats.idBat, Persons.name, CareLogs.dateTime, CareLogs.weight, CareLogs.foodType, CareLogs.remark, GROUP_CONCAT(MedicalCares.treatment SEPARATOR '; ') AS medicalCares
    FROM CareLogs
    LEFT JOIN Persons ON CareLogs.idPerson = Persons.idPerson
    LEFT JOIN Bats ON CareLogs.idBat = Bats.idBat
    LEFT JOIN CareLogsMedicalCares ON CareLogs.idCareLog = CareLogsMedicalCares.idCareLog
    LEFT JOIN MedicalCares ON MedicalCares.idMedicalCare = CareLogsMedicalCares.idMedicalCare
    GROUP BY CareLogs.idCareLog;`;

    selectBatsQuery = `SELECT Bats.idBat FROM Bats;`;

    selectPersonsQuery = `SELECT Persons.name, Persons.idPerson FROM Persons;`;

    selectMedicalCaresQuery = `SELECT MedicalCares.treatment, MedicalCares.idMedicalCare FROM MedicalCares;`;
  }
  else {
    selectCareLogsQuery = `SELECT CareLogs.idCareLog, Bats.idBat, Persons.name, CareLogs.dateTime, CareLogs.weight, CareLogs.foodType, CareLogs.remark, GROUP_CONCAT(MedicalCares.treatment SEPARATOR '; ') AS medicalCares
      FROM CareLogs
      LEFT JOIN Persons ON CareLogs.idPerson = Persons.idPerson
      LEFT JOIN Bats ON CareLogs.idBat = Bats.idBat
      LEFT JOIN CareLogsMedicalCares ON CareLogs.idCareLog = CareLogsMedicalCares.idCareLog
      LEFT JOIN MedicalCares ON MedicalCares.idMedicalCare = CareLogsMedicalCares.idMedicalCare
      WHERE Persons.name = '${req.query.inputid}'
      GROUP BY CareLogs.idCareLog;`;

    selectBatsQuery = `SELECT Bats.idBat FROM Bats;`;

    selectPersonsQuery = `SELECT Persons.name, Persons.idPerson FROM Persons;`;

    selectMedicalCaresQuery = `SELECT MedicalCares.treatment, MedicalCares.idMedicalCare FROM MedicalCares;`;

  }

    // EXECUTES ALL QUERIES
  db.pool.query(selectCareLogsQuery, function (error, carelogs, fields) {
    db.pool.query(selectBatsQuery, function (error, bats, fields) {
      db.pool.query(selectPersonsQuery, function (error, persons, fields) {
        db.pool.query(selectMedicalCaresQuery, function (error, medicalcares, fields) {
          res.render("carelogs", {
            carelogs: carelogs,
            bats: bats,
            persons: persons,
            medicalcares: medicalcares,
          });
        });
      });
    });
  });
});


/*
    LISTENER
*/

app.listen(PORT, function () {
  console.log(
    "Express started on http://localhost:" +
    PORT +
    "; press Ctrl-C to terminate."
  );
});
