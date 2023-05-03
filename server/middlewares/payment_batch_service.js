const { processPayment } = require('./payment_service');
const { toDollarNum, toList } = require('../middlewares/convertor_service');
const Payment = require('../models/PaymentModel');
const PaymentBatch = require('../models/PaymentBatchModel');

async function processBatch(batchId) {
	await PaymentBatch.findOneAndUpdate(
		{ _id: batchId },
		{ status: 'processing' }
	);
	const payments = await Payment.find({ batchId });
	let totalPaidAmount = 0;
	for (let payment of payments) {
		try {
			await processPayment(payment);
			totalPaidAmount += payment.amount;
		} catch (error) {
	        console.error(`Failed to process payment ${payment.source} to ${payment.destination} - ${error}`);
	    }
	}
	totalPaidAmount = toDollarNum(totalPaidAmount);
	await PaymentBatch.findOneAndUpdate(
		{ _id: batchId },
		{ status: 'completed',  totalFunds: totalPaidAmount }
	);
}

module.exports = { processBatch } 