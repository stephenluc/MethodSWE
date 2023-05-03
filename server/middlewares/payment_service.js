const Method = require('./method_services');
const Payment = require('../models/PaymentModel');

const TERMINAL_STATES = ['sent', 'canceled', 'reversed'];

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

async function processPayment(payment) {
    try {
	    const paymentResponse = await Method.createPayment({
    		amount: payment.amount,
            source: payment.source,
            destination: payment.destination,
            description: 'Loan Pmt'
        });
		payment.paymentId = paymentResponse.id;
		payment.status = paymentResponse.status;
		payment.save();
		return payment;
	} catch (error) {
        console.error(`Failed to process payment ${error}`);
    }
} 

async function updatePaymentsStatus(batchId) {
    const payments = await Payment.find({ batchId });

    for (let payment of payments) {
        const { paymentId, status } = payment;
        try {
            if (!TERMINAL_STATES.includes(status)) {
                const methodPayment = await Method.getPayment(paymentId);
                if (methodPayment.status !== status) {
                    await Payment.findOneAndUpdate(
                        { paymentId },
                        { status: methodPayment.status }
                    );
                }
            }
        } catch (error) {
            console.error(`Unable to update payment ${paymentId}: ${error}`);
        }
    }
}

module.exports = { createPayment, processPayment, updatePaymentsStatus }
