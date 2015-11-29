var connection_mysql = require('./mysql')
function getAllListings(success, failure) {
	var connection = connection_mysql.getConnection;
	var queryString = 'SELECT ListingID, ListingDateTime, Viewcount, Street, City, State, Zip, Description  FROM PropertyListing.Listing, PropertyListing.Property where Listing.PropertyID = Property.PropertyID;';
	connection.query(queryString, function(err, rows, fields) {
		if (err) {
			failure(err);
		} else {
			success(rows);
		}
	});
	connection.end();
}

function getListingById(id, success, failure) {
	var connection = connection_mysql.getConnection;
	var queryString = "SELECT ListingID, ListingDateTime, SalePrice, SoldPrice, Property.PropertyID, Viewcount, SoldDate, Street, City, State, Zip, Description, Property.Name AS 'PropertyName', AgentProfile.FirstName AS 'AgentFName', AgentProfile.LastName AS 'AgentLName', AgentProfile.Email AS 'AgentEmail', AgentProfile.contact AS 'AgentContact', AgentProfile.Photo AS 'AgentPhoto', OwnerProfile.FirstName AS 'OwnerFName', OwnerProfile.LastName AS 'OwnerLName', OwnerProfile.Email AS 'OwnerEmail', OwnerProfile.contact AS 'OwnerContact', OwnerProfile.Photo AS 'OwnerPhoto' FROM PropertyListing.Listing, PropertyListing.Property, PropertyListing.PropertyOwner, PropertyListing.RealEstateAgent, PropertyListing.Profile OwnerProfile, PropertyListing.Profile AgentProfile WHERE ListingID = ? AND Listing.PropertyID = Property.PropertyID AND PropertyOwner.OwnerId = Property.OwnerId AND Property.AgentId = RealEstateAgent.AgentId AND OwnerProfile.ProfileID = PropertyOwner.ProfileID AND AgentProfile.ProfileID = RealEstateAgent.ProfileID; ";
	console.log("====>>>" + id);
	connection.query(queryString, [ id ], function(err, rows, fields) {
		if (err) {
			console.log("error");
			failure(err);
		} else {
			console.log("success");
			success(rows);
		}
	});
}

function deleteProperty(id, success, failure) {
	var connection = connection_mysql.getConnection;
	var queryString = 'DELETE FROM `PropertyListing`.`Property` WHERE PropertyID = ?;';
	connection.query(queryString, [ id ], function(err, rows, fields) {
		if (err) {
			failure(err);
		} else {
			success(rows);
		}
	});
}

function createProperty() {
	"INSERT INTO `PropertyListing`.`Property` (`PropertyID`, `Street`, `City`, `State`,`Zip`, `Description`, `OwnerId`, `AgentId`) VALUES (<{PropertyID: }>, <{Street: }>, <{City: }>, <{State: }>, <{Zip: }>, <{Description: }>, <{OwnerId: }>, <{AgentId: }>);";
}

exports.getAllListings = getAllListings;
exports.getListingById = getListingById;
exports.deleteProperty = deleteProperty;
exports.createProperty = createProperty;