const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
	batchId: mongoose.Schema.Types.ObjectId,
	paymentId: String,
	amount: Number,
	source: String,
	destination: String,
	status: {
		type: String,
		default: 'created',
	}
});

module.exports = mongoose.model('Payment', PaymentSchema);
