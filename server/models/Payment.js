const mongoose = require('mongoose');
const PaymentBatch = require('./PaymentBatch');

const AddressSchema = new mongoose.Schema({
	line1: String,
	city: String,
	state: String,
	zip: String
});

const PayorSchema = new mongoose.Schema({
	dunkinId: String,
    ABARouting: String,
    accountNumber: String,
    name: String,
    DBA: String,
    EIN: String,
    address: AddressSchema
});

const PayeeSchema = new mongoose.Schema({
	plaidId: String,
    loanAccountNumber: String
});

const EmployeeSchema = new mongoose.Schema({
	dunkinId: String,
    dunkinBranch: String,
    firstName: String,
    lastName: String,
    DOB: Date,
    phoneNumber: String
});

const PaymentSchema = new mongoose.Schema({
	paymentBatchId: mongoose.Schema.Types.ObjectId,
	status: String,
	employee: EmployeeSchema,
	payor: PayorSchema,
	payee: PayeeSchema,
	amount: Number
});

PaymentSchema.statics.findByPaymentBatchID = function(paymentBatchId) {
	return this.where({ paymentBatchId });
}

PaymentSchema.statics.updateStatusByPaymentBatchId = async function(paymentBatchId, status) {
	return await this.updateMany({ paymentBatchId }, { $set: { status } });
};

module.exports = {
	Address: mongoose.model('Address', AddressSchema),
	Employee: mongoose.model('Employee', EmployeeSchema),
	Payor: mongoose.model('Payor', PayorSchema),
	Payee: mongoose.model('Payee', PayeeSchema),
	Payment: mongoose.model('Payment', PaymentSchema)
};
