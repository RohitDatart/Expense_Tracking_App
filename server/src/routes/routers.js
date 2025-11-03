const express = require('express');
const router = express.Router();

const {create_user, getUser, updateUser, deleteUser, userLogin} = require("../controllers/user_controller");
const {addTransaction, getTransactions, getSingleTransaction, updateTransaction, deleteTransaction, getTransactionGraphData} = require("../controllers/transaction_controller")

//User
router.post('/crate_user', create_user);
router.get('/user/:userId', getUser);
router.put('/updateUser/:userId', updateUser);
router.delete('/deleteUser/:userId', deleteUser);
router.post('/userLogin', userLogin);



// Trasaction 
router.post('/addTransaction/:userId',addTransaction);
router.get('/allTransactions/:userId', getTransactions );
router.get('/transaction/:transactionId',getSingleTransaction);
router.put('/updateTransaction/:transactionId', updateTransaction);
router.delete('/deleteTransaction/:transactionId', deleteTransaction);
router.get('/getTransactionGraphData/:userId', getTransactionGraphData);

module.exports = router;