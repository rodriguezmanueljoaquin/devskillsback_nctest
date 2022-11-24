

async function getTransactions(req, res, next) {
	try {
		res.json("TODO getStats");
	} catch (error) {
		console.error("getStats: " + error);
		next(error);
	}
}

module.exports = {
    getTransactions,
}
