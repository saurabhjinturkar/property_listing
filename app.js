/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes'), user = require('./routes/user'), usermysql = require('./routes/user-dao'), http = require('http'), path = require('path'), mysql = require('mysql'),
	bodyParser = require('body-parser')
	,cookieParser = require('cookie-parser');

var cors = require('cors');
var session = require('express-session');

var app = express();
var pages = require('./routes/pages');
var controller = require('./routes/controller');
var connection = require('./routes/mysql')

// all environments
app.set('port', process.env.PORT || 3000);
app.set('ip', process.env.IP || '127.0.0.1');
// app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
// app.set('ip', process.env.OPENSHIFT_NODEJS_IP);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(cors());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(session({
	cookieName: 'session',
	secret: 'random_string_goes_here',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

var conn = connection.getConnection;

conn.connect(function(err) {
	if (err) {
		console.log('Error connecting to Db: ' + err);
		return;
	}
	console.log('Connection established');
});

// GETS
app.get('/user/:userid', user.getUserById);
// app.get('/users', user.getAllUsers);

// POSTS
app.post('/user', user.createUser);
app.post('/doAddProperty', controller.doAddProperty,
		controller.showPropertiesForAgent);
app.post('/submitEditProfile', user.submitEditProfile);
app.post('/addBookmark', user.addBookmark);
app.post('/deleteProperty', user.deleteProperty);
app.post('/createListing', controller.addListing);
app.post('/addListing', controller.showAddListing);
app.post('/deleteListing', controller.deleteListing);

// DELETES
app.post('/userdelete', authenticate, user.deleteUser);
app.post('/login', user.login);
app.post('/adminLogin',user.adminLogin);
app.get('/adminConsole',authenticate,pages.showAdminConsole);
app.get('/allUsers/:count',user.getAllUsers);


app.get('/', pages.signup);
app.get('/adminLoginPage',pages.adminLoginPage);
app.get('/propertydetails', authenticate, pages.propertydetails);
app.get('/listing', authenticate, pages.listing);
app.get('/addproperty', authenticate, pages.addproperty);
app.get('/properties', authenticate, pages.getProperties);
app.get('/editprofile', authenticate, user.editProfile);

// Do not authenitcate the login page
app.get('/', pages.signup);
app.get('/home', pages.getBookmarks, pages.getTopListings,
		pages.getListingsForIds, pages.showHomePage);
app.get('/propertydetails', pages.propertydetails);
app.get('/listing', pages.listing);
app.get('/addproperty', authenticate, pages.addproperty);
app.get('/properties', authenticate, pages.getProperties);
app.get('/editprofile', authenticate, user.editProfile);
app.get('/logout', user.logOut);

app.get('/listings/:id', pages.getPropertyListingById,
		pages.getPropertyFeatures, pages.renderPropertyDetails);
app.get('/search', pages.performSearch);

app.get('/showProperties', controller.showPropertiesForAgent);
// CHANGE THIS TO TRUE WHEN WE DEMO! - This does the authentication
var DEVMODE = false;
function authenticate(req,res,next) {
	if (req.session.user || DEVMODE) {
		res.locals.user = req.session.user;
		next();
	} else {
		res.redirect('/');
	}
};

http.createServer(app).listen(app.get('port'), app.get('ip'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});