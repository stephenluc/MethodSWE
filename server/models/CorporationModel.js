const mongoose = require('mongoose');

const CorporationSchema = new mongoose.Schema({
	entId: String,
    corpId: String,
    corporation: {
    	name: String,
    	dba: String,
    	ein: String
    },
    address: {
    	line1: String,
    	city: String,
    	state: String,
    	zip: String,
    },
});

module.exports = mongoose.model('Corporation', CorporationSchema);