const transactionsService = require("../services/transactionService");


async function getTransactions(req, res, next) {
    const transactions = await transactionsService.getTransactions();
    res.json(transactions.rows);
}

async function postTransaction(req, res, next) {
    if(!transactionsService.validateTransaction(req.body))
        // possible improvement: specify which field is missing
        return res.status(400).json({message: "Invalid transaction"});
    
    try {
        const newTransaction = await transactionsService.createTransaction(req.body);
        res.json(newTransaction.rows[0]);
    }
    catch (error) {
        // possible improvement: specify error, like if bar_code is already in use
        res.status(500).json({message: "Internal server error when creating transaction, " + error});
    }

}

module.exports = {
    getTransactions,
    postTransaction,
}
