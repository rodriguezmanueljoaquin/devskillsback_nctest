DROP TABLE IF EXISTS transactions;

CREATE TABLE IF NOT EXISTS transactions(
    bar_code TEXT NOT NULL PRIMARY KEY,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    due_date DATE NOT NULL,
    payment_date DATE,
    amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
);
