const sql = require('mssql');

// SQL Server configuration
const config = {
  user: 'SA',       // e.g., sa
  password: 'YourStrongPassword123!',   // e.g., strongpassword123
  server: 'localhost',         // or your remote server address
  database: 'DrugUsePreventionDB',   // e.g., TestDB
  options: {
    encrypt: false, // Use true if you're on Azure or need encryption
    trustServerCertificate: true // For development only
  }
};

// Create and export a pool connection
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('Database Connection Failed!', err);
    throw err;
  });

module.exports = {
  sql,
  poolPromise
};
