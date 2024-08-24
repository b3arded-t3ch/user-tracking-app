const express = require('express');
const ActivityLog = require('../models/activityLog');
const User = require('../models/user');
const Site = require('../models/sites');
const router = express.Router();


function isAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	return redirect('/login');
}

router.get('/users', isAuthenticated, async (req, res, next) => {
	try {
		const { search, sort, order, page = 1 } = req.query;
		const limit = 10;
		const skip = (page - 1) * limit;

		let query = {};
		if (search) {
			query = { $or: [
				{ username: new RegExp(search, 'i') },
				{ firstName: new RegExp(search, 'i') },
				{ lastName: new RegExp(search, 'i') }
			]};
		}

		let sortOption = {};
		if (sort && order) {
			sortOption[sort] = order === 'asc' ? 1 : -1;
		}

		const users = await User.find(query)
			.sort(sortOption)
			.skip(skip)
			.limit(limit);

		const total = await User.countDocuments(query);
		const pages = Math.ceil(total / limit);

		res.render('users', {
			title: 'Users',
			users,
			user: req.user,
			search,
			currentPage: page,
			pages
		});
	} catch (error) {
		next(error);
	}
});

//router.get('/users', isAuthenticated, async (req, res) => {
//	try {
//		const sortField = req.query.sort || 'username';
//		const sortOrder = req.query.order === 'desc' ? -1 : 1;
//		const users = await User.find()
//			.select('-password')
//			.sort({ [sortField]: sortOrder });
//		res.render('users', { title: 'User List',
//			user: req.user,
//			users, 
//			currentSort: sortField,
//			currentOrder: sortOrder });
//	} catch (error) {
//		console.error('Error fetching users:', error);
//		next(error);
//	}
//});

router.get('/users/:id', isAuthenticated, async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select('-password');
		if (!user) {
			return res.status(404).send('User not found');
		}
		const recentViews = await ActivityLog.find({ userId: user._id, action: 'view' })
			.sort('-date')
			.limit(10)
			.populate('siteId');

		const recentEdits = await ActivityLog.find({ userId: user._id, action: 'edit' })
			.sort('-date')
			.limit(10)
			.populate('siteId');
		res.render('userDetail', { title: 'User Detail', 
			user: req.user,
			targetUser: user,
			recentViews,
			recentEdits });
	} catch (error) {
		console.error('Error fetching user details:', error);
		next(error);
	}
});

//router.get('/dashboard', isAuthenticated, async (req, res) => {
//	try {
//		const user = await User.findById(req.user.id).select('-password');
//		const recentViews = await ActivityLog.find({ userId: user.id, action: 'view' })
//			.sort('-date')
//			.limit(10)
//			.populate('siteId');
//		const recentEdits = await ActivityLog.find({ userId: user.id, action: 'edit' })
//			.sort('-date')
//			.limit(10)
//			.populate('siteId');
//		res.render('dashboard', {
//			title: 'Dashboard',
//			user,
//			recentViews,
//			recentEdits,
//			body: null
//		});
//	} catch (error) {
//		console.error('Error fetching dashboard data:', error);
//		res.status(500).send('Error fetching dashboard data');
//}
//});

router.get('/dashboard', isAuthenticated, async (req, res, next) => {
	try {
		const totalUsers = await User.countDocuments();
		const totalSites = await Site.countDocuments();
		const recentActivity = await ActivityLog.find()
			.sort('-date')
			.limit(10)
			.populate('userId', 'username')
			.populate('siteId', 'name');
		const sortField = req.query.sort || 'username';
		const sortOrder = req.query.order === 'desc' ? -1 : 1;
		const users = await User.find()
			.select('-password')
			.sort({ [sortField]: sortOrder });
		res.render('dashboard', {
			title: 'Dashboard', 
			user: req.user,
			users,
			currentSort: sortField, 
			currentOrder: sortOrder,
			stats: {
				totalUsers,
				totalSites,
				recentActivity
			}
		});
	} catch (error) {
		console.error('Error fetching dashboard data:', error);
		next(error);
	}
});

module.exports = router;
