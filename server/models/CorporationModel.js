const mongoose = require('mongoose');

const CorporationSchema = new mongoose.Schema({
	entId: String,
    corpId: String
});

module.exports = mongoose.model('Corporation', CorporationSchema);