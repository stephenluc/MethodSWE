const mongoose = require('mongoose');

const PayeeSchema = new mongoose.Schema({
	entId: String,
    holderId: String,
    merchantId: String,
    loanAccountNumber: String
});

module.exports = mongoose.model('Payee', PayeeSchema);