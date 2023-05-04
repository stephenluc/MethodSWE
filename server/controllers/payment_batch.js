const express = require("express");
const { processBatch } = require('../middlewares/payment_batch_service');
const PaymentBatch = require('../models/PaymentBatchModel');
const Payment = require('../models/PaymentModel');

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const paymentBatch = await PaymentBatch.find().sort( {createdDate: -1 });
	    return res.status(200).send(paymentBatch);
	} catch (err) {
		console.error(err);
		return res.status(500);
	}
});

router.put('/:id/:status', async (req, res) => {
	try {
		const batchId = req.params.id
		const status = req.params.status
		if (status === 'reject') {
			await PaymentBatch.findOneAndUpdate(
				{ _id: batchId },
				{ status: 'rejected' }
			);
			await Payment.updateMany({ batchId }, { status: 'canceled' });
		    return res.status(200).send('Rejected payment batch');
		} else {
			processBatch(batchId);
			return res.status(200).send('Processing payment batch');
		}
    } catch (err) {
		console.error(err);
		return res.status(500);
	}
});

module.exports = router;