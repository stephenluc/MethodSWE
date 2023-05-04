const express = require("express");
const { generateReport } = require('../middlewares/report_service');

const router = express.Router();

router.get('/:id/:report_name', async (req, res) => {
	try {
		const batchId = req.params.id
		const report_name = req.params.report_name
		const report = await generateReport(batchId, report_name);
		return res.status(200).send(report);
    } catch (err) {
		console.error(`Error generating report ${err}`);
		return res.status(500);
	}
});

module.exports = router;