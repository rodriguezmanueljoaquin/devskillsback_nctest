const queriesController = require("../controllers/queriesController");

module.exports = app => {
	app.get("/transactions", queriesController.getTransactions);
}
