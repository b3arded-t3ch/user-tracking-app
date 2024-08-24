const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
	action: { type: String, enum: ['view', 'edit'], required: true },
	date: { type: Date, default: Date.now }
});

const getLastSitesForUser = async (userId, action, limit = 10) => {
	return ActivityLog.find({ userId, action })
		.sort({ timestamp: -1 })
		.limit(limit)
		.populate('siteId');
};

module.exports = mongoose.model('ActivityLog', activityLogSchema);
