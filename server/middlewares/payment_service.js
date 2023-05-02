const Method = require('./method_services');
const Payment = require('../models/PaymentModel');

async function createPayment(batchId, payorId, payeeId, amount) {
    const payment = new Payment({
        batchId,
        source: payorId,
        destination: payeeId,
        amount,
    });
    payment.save();
    return payment;
}

module.exports = { createPayment }