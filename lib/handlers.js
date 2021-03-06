/*
 * Request handlers
 *
 */

// Dependencies
var _data = require('./data');
var helpers = require('./helpers');

// Define handlers
var handlers = {};

// Users handler
handlers.users = function (data, callback) {
	var acceptableMethods = ['post', 'get', 'put', 'delete'];
	if (acceptableMethods.indexOf(data.method) > -1) {
		handlers._users[data.method](data, callback);
	} else {
		callback(405);
	}
};

// Container for the users submethods
handlers._users = {};

// Users - post
handlers._users.post = function (data, callback) {
	// Check that all required fields are filled up
	var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
	var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
	var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length > 10 ? data.payload.phone.trim() : false;
	var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
	var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

	if (firstName && lastName && phone && password && tosAgreement) {
		// make sure that the user doesnt already exists
		_data.read('users', phone, function (err, data) {
			if (err) {
				// hash the pasword
				var hashedPassword = helpers.hash(password);

				// create the user object
				if (hashedPassword) {
					var userObject = {
						'firstName': firstName,
						'lastName': lastName,
						'phone': phone,
						'hashedPassword': hashedPassword,
						'tosAgreement': true
					};

					// Store the user
					_data.create('users', phone, userObject, function (err) {
						if (!err) {
							callback(200);
						} else {
							console.log(err);
							callback(500, {'Error': 'Could not create a new user'});
						}
					});
				} else {
					callback(500, {'Error':'Could not hash password'});
				}
			} else {
				// user already exists
				callback(400, {'Error': 'User with that phone number already exists'});
			}
		});
	} else {
		callback(400, {'Error':'missing required fields'});
	}
};

// Users - get
handlers._users.get = function (data, callback) {
	var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length > 10 ? data.queryStringObject.phone.trim() : false;
	if (phone) {
		_data.read('users', phone, function (err, data){
			if (!err && data) {
				delete data.hashedPassword;
				callback(200, data);
			} else {
				callback(404);
			}
		});
	} else {
		callback(400, {'Error':'Missing required field'});
	}
};

// Users - put
handlers._users.put = function (data, callback) {
	var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length > 10 ? data.payload.phone.trim() : false;
	var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
	var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
	var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

	if (phone) {
		if (firstName || lastName || password) {
			_data.read('users', phone, function (err, userData){
				if (!err && userData) {
					if (firstName) {
						userData.firstName = firstName;
					}

					if (lastName) {
						userData.lastName = lastName;
					}

					if (password) {
						userData.hashedPassword = helpers.hash(password);
					}

					_data.update('users', phone, userData, function (err) {
						if (!err) {
							callback(200);
						} else {
							console.error(err);
							callback(500, {'Error': 'Could not update user'});
						}
					})
				} else {
					callback(400, {'Error': 'User not found'});
				}
			});
		} else {
			callback(400, {'Error': 'Missing required field'})
		}
	} else {
		callback(400, {'Error': 'Missing required field'})
	}
};

// Users - delete
handlers._users.delete = function (data, callback) {
	var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length > 10 ? data.queryStringObject.phone.trim() : false;
	if (phone) {
		_data.read('users', phone, function (err, data){
			if (!err && data) {
				_data.delete('users', phone, function (err) {
					if (!err) {
						callback(200);
					} else {
						console.error(err);
						callback(500, {'Error': 'Could not delete user'});
					}
				});
			} else {
				callback(400, {'Error': 'Could not find user'});
			}
		});
	} else {
		callback(400, {'Error':'Missing required field'});
	}
};

// Ping handler
handlers.ping = function (data, callback) {
	callback(200);
};

// Define not found handler
handlers.notFound = function (data, callback) {
	callback(404);
};

// Export the module
module.exports = handlers;
