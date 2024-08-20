const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
	name: { type: String, required: true },
	country: { type: String, required: true },
	description: String,
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Site', siteSchema);
