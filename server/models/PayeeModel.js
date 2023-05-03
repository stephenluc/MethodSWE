const mongoose = require('mongoose');

const PayeeSchema = new mongoose.Schema({
	accId: String,
    holderId: String,
    merchantId: String,
    loanAccountNumber: String
});

module.exports = mongoose.model('Payee', PayeeSchema);