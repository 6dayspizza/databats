-- databats
-- Brett Dixon
-- Ruth Kistler
-- CS 340

-- It should be possible to INSERT entries into every table individually.
-- Every table should be used in at least one SELECT query.
-- For the SELECT queries, it is fine to just display the content of the tables. 
-- It is generally not appropriate to have only a single query that joins all tables and displays them.
-- You need to include one DELETE and one UPDATE function in your website, for any one of the entities. 
-- In addition, it should be possible to add and remove things from at least one many-to-many relationship and it should be possible to add things to all relationships. 
-- This means you need SELECT & INSERT functionalities for all relationships as well as entities. And DELETE & UPDATE for least one m:m relationship.
-- Note that it's not acceptable to require the user to enter IDs for foreign keys. 
-- Instead your website needs to use a dynamically populated drop-down list or have the ability to search using text instead of entering in the ID. 
-- This Dynamic drop-down/Search functionality should be present for at least one entity. 
-- In one relationship, you should be able to set the foreign key value to NULL using UPDATE, that removes the relationship. 
-- In case none of the one-to-many relationships in your database has optional participation, you would need to change that to make sure one can have NULL values. 
-- For example, in the table Orders, there may be two FKs: the employeeID and the customerID which create relations to the Employees and Customers tables. 
-- It may not be sensible for the Customer to be optional. But the Employee could be optional. 
-- Thus, we would expect that in the Orders INSERT and UPDATE pages it is possible to set the employeeID to a value or else to NULL. 
-- You should be able to DELETE a record from a M:M relationship without creating a data anomaly in the related tables. 
-- For example, DELETEing a Customer should handle any Orders that were made by the Customer. 
-- This can be done by either by setting the CustomerID to NULL, or else by DELETEing any Order(s) associated with that Customer. 
-- More on how this can be done in Week 5 when we cover MySQL CASCADELinks to an external site.. 
-- To continue the example from above, if you have 5 tables in your schema, then at a minimum, 
-- we expect you to implement 5 SELECTs, 5 INSERTs, 1 UPDATE (1 NULLable relationship), 1 DELETE (M:M), and 1 Dynamic drop-down/Search for a total of 14 functions. 



--------------------SELECT - Browse queries---------------------------
-- Select Bats
SELECT Bats.idBat, Species.name, Bats.sex, Bats.foundDate, Bats.foundSite, Persons.name, Bats.endDate, Bats.releaseSite, Status.name, Bats.remark
FROM Bats
LEFT JOIN Persons ON Bats.idPerson = Persons.idPerson
LEFT JOIN Species ON Bats.idSpecies = Species.idSpecies
LEFT JOIN Status ON Bats.idStatus = Status.idStatus;
-- Select Species
SELECT * FROM Species;
-- Select Status
SELECT * FROM Status;
-- Select MedicalCares
SELECT * FROM MedicalCares;
-- Select CareLogs
SELECT CareLogs.idCareLog, Bats.idBat, Persons.name, CareLogs.dateTime, CareLogs.weight, CareLogs.foodType, CareLogs.remark
FROM CareLogs
LEFT JOIN Persons ON CareLogs.idPerson = Persons.idPerson
LEFT JOIN Bats ON CareLogs.idBat = Bats.idBat;
-- Select CareLogsMedicalCares (Intersection Table)
SELECT * FROM CareLogsMedicalCares;



--------------------INSERT queries----------------------------------------
-- Insert Bats
INSERT INTO Bats (idPerson, idSpecies, sex, remark, foundDate, foundSite, idStatus)
VALUES (:idPersonInput, :idSpeciesInput, :sexInput, :remarkInput, :foundDateInput, :foundSiteInput, :idStatusInput);
-- Insert Species
INSERT INTO Species(name)
VALUES (:nameInput);
-- Insert Status
INSERT INTO Status(name)
VALUES (:nameInput);
-- Insert MedicalCares
INSERT INTO MedicalCares(treatment)
VALUES (:treatmentInput);
-- Insert MedicalCares
INSERT INTO MedicalCares(name)
VALUES (:nameInput);
-- Insert CareLogs
INSERT INTO CareLogs (idBat, idPerson, weight, foodType, remark) /*dateTime is automatically created*/
VALUES (:idBatInput, :idPersonInput, :weightInput, :foodTypeInput, :remarkInput);
/* SET @idCareLog = LAST_INSERT_ID(); */

-- Insert CareLogsMedicalCares (Intersection Table) (M-to-M relationship addition)
INSERT INTO CareLogsMedicalCares (idCareLog, idMedicalCare)
VALUES (:idCareLogInput, :idMedicalCareInput);


------------------------UPDATE queries-------------------------------------------
-- Update Bats
UPDATE Bats
SET endDate = :endDateUpdate, releaseSite = :releaseSiteUpdate, status = :idStatusUpdate, remark = CONCAT(remark, '; ', :remarkUpdate)
WHERE idBat = :idBatToUpdate;
-- update CareLogs
UPDATE CareLogs
SET person = :idPersonUpdate, weight = :weightUpdate, food = :foodTypeUpdate, remark = CONCAT(remark, '; ', :remarkUpdate)
WHERE idCareLog = :idCareLogToUpdate;


------------------------DELETE queries-------------------------------------------
-- Delete CareLogs
DELETE FROM CareLogs WHERE idCareLog = :idCareLogToDelete;
-- Delete MedicalCares
DELETE FROM MedicalCares WHERE idMedicalCare = :idMedicalCareToDelete;
-- Delete CareLogsMedicalCares (M-to-M relationship deletion)
DELETE FROM CareLogsMedicalCares WHERE idCareLog = :idCareLogs_selected AND idMedicalCare = :idMedicalCare_selected;


----------------------Dynamic drop-down/Search--------------------------------------
-- PK SELECT queries 
-- Bats
SELECT idBat FROM Bats;
-- Species
SELECT idSpecies FROM Species;
-- Status
SELECT idStatus FROM Status;
-- MedicalCares
SELECT idMedicalCare FROM MedicalCares;
-- CareLogs
SELECT idCareLog FROM CareLogs;
-- CareLogsMedicalCares (Intersection Table)
SELECT idCareLogMedicalCare FROM CareLogsMedicalCares;