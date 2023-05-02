const mongoose = require('mongoose');

const MerchantSchema = new mongoose.Schema({
	mchId: String,
    plaidId: String
});

module.exports = mongoose.model('Merchant', MerchantSchema);