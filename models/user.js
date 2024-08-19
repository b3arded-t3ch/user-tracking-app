const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	organization: String,
	country: String,
	permissionlevel: { type: String, default: 'user' },
	registrationDate: { type: Date, default: Date.now },
	lastLoginDate: Date
});

module.exports = mongoose.model('User', userSchema);
