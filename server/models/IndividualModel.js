const mongoose = require('mongoose');

const IndividualSchema = new mongoose.Schema({
	entId: String,
    dunkinId: String,
    branchId: String
});

module.exports = mongoose.model('Individual', IndividualSchema);