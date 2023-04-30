const PaymentBatch = require('../models/PaymentBatch');
const { Payment } = require('../models/Payment');

const MAX_PAGE_SIZE = 10;

exports.getPaymentBatch = async (req, res) => {
	try {
		// worry about pagination later .limit(MAX_PAGE_SIZE)
		const paymentBatch = await PaymentBatch.find().sort( {createdDate: -1 });
	    return res.status(200).send(paymentBatch);
	} catch (err) {
		console.log(err);
		return res.status(500);
	}
};

exports.getPayments = async (req, res) => {
	try {
		const paymentBatchId = req.params.id
		const payments = await Payment.findByPaymentBatchID(paymentBatchId);
	    return res.status(200).send(payments);
	} catch (err) {
		console.log(err);
		return res.status(500);
	}
};

exports.updatePendingPaymentBatch = async (req, res) => {
	try {
		const paymentBatchId = req.params.id
		const status = req.params.pending_status
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
};
