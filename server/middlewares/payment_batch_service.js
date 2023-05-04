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
	Promise.all(payments.map(async (payment) => {
		try {
			await processPayment(payment);
		} catch (error) {
	        console.error(`Failed to process payment ${payment.source} to ${payment.destination} - ${error}`);
	    }
	})).then(async (res) => {
		await PaymentBatch.findOneAndUpdate(
			{ _id: batchId },
			{ status: 'completed' }
		);
		console.debug("All payments have been submitted successfully.");
	}).catch((error) => {
      console.log(`Error submitting payments: ${error}`);
    });
}

module.exports = { processBatch } 