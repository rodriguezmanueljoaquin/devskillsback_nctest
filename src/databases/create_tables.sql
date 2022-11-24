CREATE TABLE IF NOT EXISTS transactions(
    barcode TEXT NOT NULL PRIMARY KEY,
    service_type TEXT NOT NULL,
    service_description TEXT NOT NULL,
    due_date DATE NOT NULL,
    payment_date DATE,
    amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
);
