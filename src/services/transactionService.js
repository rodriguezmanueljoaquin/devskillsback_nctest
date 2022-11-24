const pqslDB = require("../databases/postgres");


function validateTransaction(body) {
    const { type, description, amount, due_date, bar_code } = body;
    if (!type || !description || !amount || !due_date || !bar_code) {
        return false;
    }
    // check type existence, should have more types
    if(type !== "Luz" && type !== "Gas") {
        return false;
    }
    return true;
}

async function getTransactions() {
    const db = pqslDB.getDB();
    const transactions = await db.query("SELECT * FROM transactions");
    return transactions;
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
        `INSERT INTO transactions (type, description, amount, due_date, bar_code, status) 
            VALUES ('${type}', '${description}', ${amount}, '${due_date_formatted}', '${bar_code}', '${status}') RETURNING *`
    );
    return newTransaction;
}

module.exports = {
    validateTransaction,
    getTransactions,
    createTransaction,
};
