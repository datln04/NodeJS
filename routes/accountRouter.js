const express = require('express');
const router = express.Router();
const accountController = require('../controller/accountController');

// Get all accounts
router.get('/', accountController.getAccounts);

// Get account by ID
router.get('/:id', accountController.getAccountById);

// Create new account
router.post('/', accountController.createAccount);

// Update account
router.put('/:id', accountController.updateAccount);

// Delete account
router.delete('/:id', accountController.deleteAccount);

module.exports = router;