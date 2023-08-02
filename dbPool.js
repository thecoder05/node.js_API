const mssql = require('mssql');
const config = require('./dbConfig');

// Create the connection pool
const poolPromise = new mssql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log('Connected to the database!');
    return pool;
  })
  .catch((err) => {
    console.log('Error connecting to the database: ', err);
    throw err;
  });

module.exports = poolPromise;

