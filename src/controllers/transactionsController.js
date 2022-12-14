const transactionsService = require("../services/transactionService");


async function getTransactions(req, res, next) {
    const status = req.query.status;
    const type = req.query.type;

    const transactions = await transactionsService.getTransactions(status, type);
    res.json(transactions);
}

async function getTransactionsAccumulatedBetweenDates(req, res, next) {
    const start_date = req.query.start_date;
    const end_date = req.query.end_date;

    if(!start_date || !end_date) 
        return res.status(400).json({message: "start_date and end_date are required"});
    if(new Date(start_date) > new Date(end_date))
        return res.status(400).json({message: "start_date must be before end_date"});

    const transactions = await transactionsService.getTransactionsAccumulatedBetweenDates(start_date, end_date);
    res.json(transactions);
}

async function payTransaction(req, res, next) {
    const body = req.body;
    if(!transactionsService.validateTransactionPayment(body))
        // possible improvement: specify which field is missing or incorrect
        return res.status(400).json({message: "Invalid transaction"});

    const transactions = await transactionsService.getTransaction(body.bar_code);
    if(transactions.length == 0)
        return res.status(400).json({message: "Transaction does not exist"});

    const transaction = transactions[0];

    if(transaction.status == "paid") // possible improvement: string "paid" should be a constant or enum
        return res.status(400).json({message: "Transaction already paid"});
    if(transaction.amount != body.amount)
        return res.status(400).json({message: "Invalid amount"});
    if(new Date(transaction.due_date) < new Date(body.pay_date))
        return res.status(400).json({message: "Payment date is after due date"});

    try {
        const newTransaction = await transactionsService.payTransaction(body.bar_code, body.pay_date);
        res.json(newTransaction);
    }
    catch (error) {
        return res.status(500).json({message: "Internal server error when editing transaction, " + error});
    }
}

async function postTransaction(req, res, next) {
    const body = req.body;
    if(!transactionsService.validateTransactionPost(body))
        // possible improvement: specify which field is missing or incorrect
        return res.status(400).json({message: "Invalid transaction"});

    const transactions = await transactionsService.getTransaction(body.bar_code);
    if(transactions.length > 0)
        return res.status(400).json({message:  "Transaction already exists"});

    try {
        const newTransaction = await transactionsService.createTransaction(body);
        res.json(newTransaction[0]);
    }
    catch (error) {
        return res.status(500).json({message: "Internal server error when creating transaction, " + error});
    }

}

module.exports = {
    getTransactions,
    getTransactionsAccumulatedBetweenDates,
    postTransaction,
    payTransaction
}
