const queriesController = require("../controllers/transactionsController");

module.exports = app => {
	app.get("/transactions", queriesController.getTransactions);
    app.post("/transactions", queriesController.postTransaction);
}
