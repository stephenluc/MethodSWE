const mongoose = require('mongoose');

const PaymentBatchSchema = new mongoose.Schema({
	fileName: String,
	status: String,
	totalFunds: Number,
	fundsPerBranch: { type: Map, of: Number },
	fundsPerSource: { type: Map, of: Number },
	numOfPayments: Number,
	createdDate: {
		type: Date,
		default: () => Date.now(),
	}
});

module.exports = mongoose.model('PaymentBatch', PaymentBatchSchema);
