const ActivityLog = require('../models/activityLog');

module.exports = async (req, res, next) => {
	if (req.user && req.params.siteId) {
		const action = req.method === 'GET' ? 'view' : 'edit';
		try {
			await ActivityLog.create({
				userId: req.user._id,
				siteId: req.params.siteId,
				action: action
			});
		} catch (error) {
			console.error('Error logging activity:', error);
		}
	}
	next();
};
