-- databats
-- Brett Dixon
-- Ruth Kistler
-- CS 340

-- disable foreign key checks and auto-commit
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;


--
-- replace/create table 'Status'
--

CREATE OR REPLACE TABLE Status (
  idStatus INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (idStatus)
);


--
-- replace/create table 'Species'
--

CREATE OR REPLACE TABLE Species (
  idSpecies INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (idSpecies)
);




--
-- replace/create table 'CareLogsMedicalCares'
--

CREATE OR REPLACE TABLE CareLogsMedicalCares (
  idCareLogMedicalCare INT NOT NULL AUTO_INCREMENT,
  idCareLog INT,
  idMedicalCare INT,
  PRIMARY KEY (idCareLogMedicalCare),
  FOREIGN KEY (idCareLog) REFERENCES CareLogs (idCareLog) ON DELETE RESTRICT,
  FOREIGN KEY (idMedicalCare) REFERENCES MedicalCares (idMedicalCare) ON DELETE RESTRICT
);


--
-- replace/create table 'Persons'
--

CREATE OR REPLACE TABLE Persons (
  idPerson INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (idPerson)
);

--
-- replace/create table 'MedicalCares'
--

CREATE OR REPLACE TABLE MedicalCares (
  idMedicalCare INT NOT NULL AUTO_INCREMENT,
  treatment VARCHAR(30),
  PRIMARY KEY (idMedicalCare)
);


--
-- replace/create table 'Bats'
--

CREATE OR REPLACE TABLE Bats (
  idBat INT NOT NULL AUTO_INCREMENT,
  idPerson INT,
  idSpecies INT,
  idStatus INT,
  sex TINYINT,
  remark VARCHAR(255),
  foundDate DATE NOT NULL,
  foundSite INT,
  endDate DATE,
  releaseSite INT,
  PRIMARY KEY (idBat),
  FOREIGN KEY (idPerson) REFERENCES Persons (idPerson) ON DELETE SET NULL,
  FOREIGN KEY (idSpecies) REFERENCES Species (idSpecies) ON DELETE SET NULL,
  FOREIGN KEY (idStatus) REFERENCES Status (idStatus) ON DELETE SET NULL
);

--
-- replace/create table 'CareLogs'
--

CREATE OR REPLACE TABLE CareLogs (
  idCareLog INT NOT NULL AUTO_INCREMENT,
  idPerson INT,
  idBat INT NOT NULL,
  dateTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  weight DECIMAL(3,2),
  foodType VARCHAR(20),
  remark VARCHAR(255),
  PRIMARY KEY (idCareLog),
  FOREIGN KEY (idPerson) REFERENCES Persons (idPerson) ON DELETE SET NULL,
  FOREIGN KEY (idBat) REFERENCES Bats (idBat) ON DELETE CASCADE
);


--
-- insert data into 'Species'
--
INSERT INTO Species
  (name)
VALUES
  ('Pipistrellus pipistrellus'),
  ('Pipistrellus kuhlii'),
  ('Nyctalus noctula'),
  ('Myotis myotis'),
  ('Myotis crypticus');


--
-- insert data into 'Status'
--
INSERT INTO Status
  (name)
VALUES
  ('on hold'),
  ('quarantined'),
  ('scheduled for release'),
  ('released'),
  ('dead'),
  ('unknown');


--
-- insert data into 'MedicalCares'
--
INSERT INTO MedicalCares
  (treatment)
VALUES
  ('Metacam'),
  ('Baytril'),
  ('surgery'),
  ('Betadine (diluted) on wings');


--
-- insert data into 'Persons'
--
INSERT INTO Persons
  (name)
VALUES
  ('Brett Dixon'),
  ('Ruth Kistler'),
  ('Some Body');


--
-- insert data into 'Bats'
--
INSERT INTO Bats
  (idPerson, idSpecies, sex, remark, foundDate, foundSite, endDate, releaseSite, idStatus)
VALUES
  ((SELECT idPerson FROM Persons WHERE idPerson = 3), (SELECT idSpecies FROM Species WHERE idSpecies = 4), 0, 'cat victim; euthanized', '2023-10-24', 8003, '2023-10-25', null, (SELECT idStatus FROM Status WHERE idStatus = 5)),
  ((SELECT idPerson FROM Persons WHERE idPerson = 2), (SELECT idSpecies FROM Species WHERE idSpecies = 5), 1, null, '2023-10-24', 8000, null, null, (SELECT idStatus FROM Status WHERE idStatus = 3)),
  ((SELECT idPerson FROM Persons WHERE idPerson = 2), (SELECT idSpecies FROM Species WHERE idSpecies = 1), 0, null, '2023-09-20', 8004, '2023-10-21', 8004, (SELECT idStatus FROM Status WHERE idStatus = 4));
;

--
-- insert data into 'CareLogs'
--
INSERT INTO CareLogs
  (idBat, idPerson, weight, foodType, remark)
VALUES
  ((SELECT idBat FROM Bats WHERE idbat = 1), (SELECT idPerson FROM Persons WHERE idPerson = 1), 
  4.5, '15 mw', 'underweight'),
  ((SELECT idBat FROM Bats WHERE idbat = 2), (SELECT idPerson FROM Persons WHERE idPerson = 1),
  3.9, '10 mw', null),
  ((SELECT idBat FROM Bats WHERE idbat = 1), (SELECT idPerson FROM Persons WHERE idPerson = 2),
  4.2, null, "didn't eat"),
  ((SELECT idBat FROM Bats WHERE idbat = 2), (SELECT idPerson FROM Persons WHERE idPerson = 3),
  4.0, '15 mw', null),
  ((SELECT idBat FROM Bats WHERE idbat = 2), (SELECT idPerson FROM Persons WHERE idPerson = 2),
  4.2, '12 mw', 'ready to be released');


INSERT INTO CareLogsMedicalCares
  (idCareLog, idMedicalCare)
VALUES
	((SELECT idCareLog FROM CareLogs WHERE idCareLog = 1), (SELECT idMedicalCare FROM MedicalCares WHERE idMedicalCare = 3)),
    ((SELECT idCareLog FROM CareLogs WHERE idCareLog = 1), (SELECT idMedicalCare FROM MedicalCares WHERE idMedicalCare = 1)),
    ((SELECT idCareLog FROM CareLogs WHERE idCareLog = 2), (SELECT idMedicalCare FROM MedicalCares WHERE idMedicalCare = 1)),
    ((SELECT idCareLog FROM CareLogs WHERE idCareLog = 3), (SELECT idMedicalCare FROM MedicalCares WHERE idMedicalCare = 1));


-- enable foreign key checks and commit
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;


SELECT CareLogs.idCareLog, Bats.idBat, Persons.name, CareLogs.dateTime, CareLogs.weight, CareLogs.foodType, CareLogs.remark, GROUP_CONCAT(CareLogsMedicalCares.idMedicalCare SEPARATOR ', ') AS MedicalCares
        FROM CareLogs
        LEFT JOIN Persons ON CareLogs.idPerson = Persons.idPerson
        LEFT JOIN Bats ON CareLogs.idBat = Bats.idBat
        LEFT JOIN CareLogsMedicalCares ON CareLogs.idCareLog = CareLogsMedicalCares.idCareLog
        GROUP BY CareLogs.idCareLog;