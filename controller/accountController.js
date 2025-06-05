const { poolPromise, sql } = require('../config/db');

// Get all accounts
exports.getAccounts = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Account');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get account by ID
exports.getAccountById = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('AccountID', sql.Int, req.params.id)
      .query('SELECT * FROM Account WHERE AccountID = @AccountID');
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new account
exports.createAccount = async (req, res) => {
  const { username, email, password, fullName, dateOfBirth, role } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('Username', sql.VarChar, username)
      .input('Email', sql.VarChar, email)
      .input('Password', sql.VarChar, password)
      .input('FullName', sql.VarChar, fullName)
      .input('DateOfBirth', sql.Date, dateOfBirth)
      .input('Role', sql.VarChar, role)
      .input('CreatedAt', sql.DateTime2, new Date())
      .query(`INSERT INTO Account 
        (Username, Email, Password, FullName, DateOfBirth, Role, CreatedAt) 
        VALUES (@Username, @Email, @Password, @FullName, @DateOfBirth, @Role, @CreatedAt)`);
    res.status(201).json({ message: 'Account created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update account
exports.updateAccount = async (req, res) => {
  const { username, email, password, fullName, dateOfBirth, role, isDisabled } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('AccountID', sql.Int, req.params.id)
      .input('Username', sql.VarChar, username)
      .input('Email', sql.VarChar, email)
      .input('Password', sql.VarChar, password)
      .input('FullName', sql.VarChar, fullName)
      .input('DateOfBirth', sql.Date, dateOfBirth)
      .input('Role', sql.VarChar, role)
      .input('IsDisabled', sql.Bit, isDisabled)
      .query(`UPDATE Account SET 
        Username=@Username, 
        Email=@Email, 
        Password=@Password, 
        FullName=@FullName, 
        DateOfBirth=@DateOfBirth, 
        Role=@Role, 
        IsDisabled=@IsDisabled
        WHERE AccountID=@AccountID`);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.json({ message: 'Account updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('AccountID', sql.Int, req.params.id)
      .query('DELETE FROM Account WHERE AccountID=@AccountID');
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};