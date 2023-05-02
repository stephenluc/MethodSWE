const express = require("express");
const PaymentBatch = require('../models/PaymentBatchModel');
const { Payment } = require('../models/PaymentModel');

const router = express.Router();

const MAX_PAGE_SIZE = 10;

router.get('/', async (req, res) => {
	try {
		// worry about pagination later .limit(MAX_PAGE_SIZE)
		const paymentBatch = await PaymentBatch.find().sort( {createdDate: -1 });
	    return res.status(200).send(paymentBatch);
	} catch (err) {
		console.log(err);
		return res.status(500);
	}
});

router.get('/:id', async (req, res) => {
	try {
		const paymentBatchId = req.params.id
		const payments = await Payment.findByPaymentBatchID(paymentBatchId);
	    return res.status(200).send(payments);
	} catch (err) {
		console.log(err);
		return res.status(500);
	}
});

router.put('/:id/:status', async (req, res) => {
	try {
		const paymentBatchId = req.params.id
		const status = req.params.status
		const convertedStatus = status === 'reject' ? 'rejected' : 'processing';
		Payment.updateStatusByPaymentBatchId(paymentBatchId, convertedStatus);
		const paymentBatch = await PaymentBatch.findById(paymentBatchId);
		paymentBatch.status = convertedStatus;
		paymentBatch.save();
	    return res.status(200).send(paymentBatch)
    } catch (err) {
		console.log(err);
		return res.status(500);
	}
});

module.exports = router;