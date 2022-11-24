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
    const { amount, payment_method, pay_date, bar_code } = body;
    if (!amount || !payment_method || !pay_date || !bar_code) {
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

async function getTransactions(status, type) {
    const db = pqslDB.getDB();

    let answer = "due_date, amount, bar_code";

    let restriction = "";
    if (status || type) {
        restriction += " WHERE";
        if (status) {
            restriction += ` status = '${status}'`;
            if (type) {
                restriction += ` AND `;
            }
        } 
        if (type) {
            answer += ",type "
            restriction += ` type = '${type}'`;
        }
    }
    const transactions = await db.query(`SELECT ${answer} FROM transactions ${restriction}`);
    return transactions.rows;
}

async function getTransactionsAccumulatedBetweenDates(start_date, end_date) {
    let start_date_formatted = new Date(start_date).toISOString().split("T")[0];
    let end_date_formatted = new Date(end_date).toISOString().split("T")[0];
    const db = pqslDB.getDB();
    const transactionsAccumulated = await db.query(
        "SELECT pay_date, SUM(amount) AS accumulated_amount, COUNT(*) AS quantity FROM transactions \
        WHERE due_date BETWEEN $1 AND $2 GROUP BY pay_date",
        [start_date_formatted, end_date_formatted]
    );
    return transactionsAccumulated.rows;
}

async function getTransaction(bar_code) {
    const db = pqslDB.getDB();
    const transactions = await db.query("SELECT * FROM transactions WHERE bar_code = $1", [bar_code]);
    return transactions.rows;
}

async function payTransaction(bar_code, pay_date) {
    const db = pqslDB.getDB();
    const transaction = await db.query("UPDATE transactions SET status = 'paid', pay_date = $1 \
                WHERE bar_code = $2 RETURNING *" , [new Date(pay_date).toISOString(), bar_code]);
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
    getTransactionsAccumulatedBetweenDates,
    payTransaction
};
