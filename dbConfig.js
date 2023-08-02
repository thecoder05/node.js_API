// MSSQL database configuration
const config = {
    user: 'test12_db',
    password: 'DFG#$%7fs&*$d',
    server: '192.168.11.90\\MSSQL2019',
    database: 'test12_db',
    instanceName: 'MSSQL2019',
    options: {
        encrypt: false, // Use this if you're on Windows Azure
        enableArithAbort: true // Use this to avoid SQL Server errors
    }
};

module.exports = config;