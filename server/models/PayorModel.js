const mongoose = require('mongoose');

const PayorSchema = new mongoose.Schema({
	entId: String,
    holderId: String,
    routingNumber: String,
    accountNumber: String
});

module.exports = mongoose.model('Payor', PayorSchema);