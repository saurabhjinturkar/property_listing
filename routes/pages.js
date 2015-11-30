/**
 * http://usejsdoc.org/
 */

var propertyDAO = require('./property_dao');
var propertyListingDAO = require('./property_listing_dao');
exports.signup = function(req, res) {
	if (req.session.user) {
		res.redirect("/home");
	} else {
		res.render('signup', {
			title : 'Express'
		});
	}
};

exports.propertydetails = function(req, res) {
	res.render('propertydetail.html', {
		title : 'Express'
	});
};

exports.listing = function(req, res) {

	res.render('listing.html', {
		title : 'Express'
	});
};

exports.addproperty = function(req, res) {
	res.render('addproperty.html', {
		title : 'Express'
	});
};

exports.getProperties = function(req, res) {
	propertyDAO.getAllProperties(function(rows) {
		for ( var i in rows) {
			console.log(rows[i]);
		}
	}, function(error) {
		throw error;
	});
}

exports.getPropertiesById = function(req, res) {
	propertyDAO.getPropertyById(100, function(rows) {
		console.log(rows[0]);
		res.render('propertydetail.html', {
			title : 'Express'
		});
	}, function(error) {
		throw error;
	});
}

exports.showHomePage = function(req, res) {
	if (!req.session.user) {
		res.locals.user = {};
		res.locals.user.Username = "Guest";
		res.locals.user.guest = true;
	} else {
		res.locals.user = req.session.user;
		res.locals.user.guest = false;
	}
	res.render("index");
}

// ====================FUNCTIONS TO SHOW PROPERTY DETAILS PAGE

function getPropertyListingById(req, res, next) {
	propertyListingDAO.getListingById(req.params.id, function(rows) {
		for ( var i in rows) {
			console.log(rows[i]);
		}
		req.property = rows[0];
		console.log(req.property);
		return next();
	}, function(error) {
		console.log(error);
	});
}

function getPropertyFeatures(req, res, next) {
	propertyDAO.getFeaturesForProperty(req.params.id, function(rows) {
		console.log("setting features.. ", rows);
		req.features = rows;
		return next();
	}, function(error) {
		console.log(error);
	});
}

function renderPropertyDetails(req, res) {
	res.render('propertydetail', {
		title : 'Express',
		property : req.property,
		features : req.features,
		user : req.session.user
	});
}

exports.getPropertyListingById = getPropertyListingById;
exports.getPropertyFeatures = getPropertyFeatures;
exports.renderPropertyDetails = renderPropertyDetails;

// ====================END OF FUNCTIONS TO SHOW PROPERTY DETAILS PAGE

// ===================SEARCH========================
function performSearch(req, res) {
	var q = req.query.q;
	propertyListingDAO.getListingByCity(q, function(rows) {
		res.render('search_result', {
			results : rows
		});
	}, function(error) {
		console.log(error);
	});
}
exports.performSearch = performSearch;

// ===================END OF SEARCH========================
