const mongoose = require('mongoose');

const IndividualSchema = new mongoose.Schema({
	entId: String,
	individual: {
		firstName: String,
		lastName: String,
		phone: String,
		dob: String,
	},
    dunkinId: String,
    branchId: String
});

module.exports = mongoose.model('Individual', IndividualSchema);