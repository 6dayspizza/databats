# databats
OSU CS340 group project
Fall term 2023

### DESCRIPTION
In this project, we created a simple database for a bat rescue shelter. The shelter’s purpose is to help injured and distressed bats, providing medical care (medication, surgery) and fostering. Each year, approximately 300 bats are admitted. About 70% survive and can be rehabilitated into the wild. A bat can stay anything between 1 and 90 days. There are no long-term patients. Each bat receives their own record with their basic information, as well as the circumstances and details of the person that found and submitted them. A daily care log per bat tracks their medical treatments and the name of the person that took care of them on the respective day. 

***TLDR***: This database system aims to provide a reliable and structured platform for recording, monitoring, and managing the rehabilitation process of stranded bats. 🧡

### FEATURES
- View and manage the following tables: Bats, CareLogs, Persons, Species, Status and MedicalCares.
- Add new records (possible in all tables)
- Edit existing records (possible in Bats- and CareLogs-table).
- Delete records (possible in Bats-, CareLogs, Persons, Species and Status-tables).
- Search for Persons in CareLogs.

### SETUP
1. Clone the repository: git clone https://github.com/your-username/your-repository.git
2. Navigate to the project directory: cd your-repository
3. Install dependencies: npm install
4. Set up the SQL database using the scripts in the database directory.
5. Update the database connection details in database/db-connector.js.
6. Run the application: node app.js or nodemon app.js
7. Open browser and visit http://localhost:9751 to access the application.

### DEPENDENCIES
Node.js  
Express  
Handlebars  
MySQL

### ROUTES
Homepage: /  
Care Logs: /carelogs  
Bats: /bats  
Persons: /persons  
Species: /species  
Status: /status
Medical Cares: /medicalcares  
Care Logs//Medical Cares [INTERSECTION TABLE, NOT VISIBLE IN MENU]: /carelogsmedicalcares

### CONTRIBUTORS
Brett Dixon / Ruth Kistler
