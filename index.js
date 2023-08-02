const express = require('express');
const mssql = require('mssql');
const bodyParser = require('body-parser');
const poolPromise = require('./dbPool');



const app = express();
app.use(bodyParser.json());

//this is changes for test
app.post('/post', async (req, res) => {
    try {
        const { name, age, email } = req.body;
        const pool = await poolPromise;
      
        const result = await pool
            .request()
            .input('Name', mssql.NVarChar(50), name)
            .input('Age', mssql.Int, age)
            .input('Email', mssql.NVarChar(100), email)
            .execute('sp_InsertUser_NJS');
      
        if (result && result.rowsAffected[0] === 1) {
            res.status(201).send("Record created successfully!");
        } else {
            res.status(500).send("Error in saving new user");
        }
    } catch (err) {
        console.log("Error in saving new user:", err);
        res.status(500).send("Error in saving new user");
    }
});

app.get('/users', async (req, res) => {
    try {
      const pool = await poolPromise;
  
      // Assuming your stored procedure is called 'sp_GetAllUsers_NJS'
      const result = await pool
        .request()
        .execute('sp_GetUsers_NJS');
  
      if (result && result.recordset.length > 0) {
        // Assuming your stored procedure returns an array of user records
        const users = result.recordset;
        res.send(users);
      } else {
        res.status(404).send("No users found");
      }
    } catch (err) {
      console.log("Error fetching users data:", err);
      res.status(500).send("Error fetching users data", err);
    }
  });


  app.get('/user/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const pool = await poolPromise;
  
      // Assuming your stored procedure is called 'sp_GetUserById_NJS'
      const result = await pool
        .request()
        .input('Id', mssql.Int, id)
        .execute('sp_GetUserById_NJS');
  
      if (result && result.recordset.length > 0) {
        // Assuming your stored procedure returns a single user record
        const user = result.recordset[0];
        res.send(user);
      } else {
        res.status(404).send("User not found");
      }
    } catch (err) {
      console.log("Error fetching user data:", err);
      res.status(500).send("Error fetching user data");
    }
  });
  

app.put('/update/:id', async (req, res) => {
    try {
        const { name, age, email } = req.body;
        const { id } = req.params;

        // Create a connection pool
        //const pool = await mssql.connect(config);
        const pool = await poolPromise;

        // Call the stored procedure with input parameters
        const result = await pool
            .request()
            .input('Id', mssql.Int, id)
            .input('Name', mssql.NVarChar(50), name)
            .input('Age', mssql.Int, age)
            .input('Email', mssql.NVarChar(100), email)
            .execute('sp_UpdateUser_NJS');

        if (result.rowsAffected[0] > 0) {
            console.log("Record updated successfully!");
            res.send("Record updated successfully!");
        } else {
            console.log("Record not found or not updated!");
            res.status(404).send("Record not found or not updated!");
        }
    } catch (err) {
        console.log("Error updating a record:", err);
        res.status(500).send("Error updating a record");
    }
});

app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Connect to the database
      const pool = await poolPromise;
  
      // Creating a new request
      const result = await pool
        .request()
        .input('Id', mssql.Int, id)
        .execute('sp_DeleteUser_NJS');
  
  
      // Calling the stored procedure
      if (result.rowsAffected[0] > 0) {
        console.log("Record deleted successfully!");
        return res.send("Record deleted successfully!");
      } else {
        console.log("Something Went Wrong while deleting the Record !");
        return res.send("Something Went Wrong while deleting the Record !");
      }
    } catch (err) {
      console.log("Error deleting a record:", err);
      res.status(500).send("Error deleting a record");
    }
  });

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
