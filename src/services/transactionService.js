const pqslDB = require("../databases/postgres");

const acceptable_types = ["Luz", "Gas"];
const payment_methods = ["debit_card", "credit_card", "cash"];

function validateTransactionPost(body) {
    const { type, description, amount, due_date, bar_code } = body;
    if (!type || !description || !amount || !due_date || !bar_code) {
        return false;
    }
    // check type existence, should have more types
    if(!acceptable_types.includes(type)) {
        return false;
    }
    return true;
}

function validateTransactionPayment(body) {
    const { amount, payment_method, date, bar_code } = body;
    if (!amount || !payment_method || !date || !bar_code) {
        return false;
    }
    // check type existence, should have more types
    if(!payment_methods.includes(payment_method)) {
        return false;
    }
    //check card number present if necessary
    if(payment_method !== "cash" && body.card_number === undefined) {
        return false;
    }
    return true;
}

async function getTransactions() {
    const db = pqslDB.getDB();
    const transactions = await db.query("SELECT * FROM transactions");
    return transactions.rows;
}

async function getTransaction(bar_code) {
    const db = pqslDB.getDB();
    const transactions = await db.query("SELECT * FROM transactions WHERE bar_code = $1", [bar_code]);
    return transactions.rows;
}

async function payTransaction(bar_code) {
    const db = pqslDB.getDB();
    const transaction = await db.query("UPDATE transactions SET status = 'paid' WHERE bar_code = $1 RETURNING *" , [bar_code]);
    return transaction.rows[0];
}

async function createTransaction(body) {
    const db = pqslDB.getDB();
    const { type, description, amount, due_date, bar_code, status } = body;
    if (status === undefined) {
        status = "pending";
    }
    const due_date_formatted = new Date(due_date).toISOString().split("T")[0];
    // WARNING: SQL INJECTION VULNERABILITY
    const newTransaction = await db.query(
        "INSERT INTO transactions (type, description, amount, due_date, bar_code, status) \
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [type, description, amount, due_date_formatted, bar_code, status]
    );

    return newTransaction;
}

module.exports = {
    validateTransactionPost,
    validateTransactionPayment,
    getTransaction,
    getTransactions,
    createTransaction,
    payTransaction
};
