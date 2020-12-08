/*
 * Create and export configuration variables
 *
 */

// Container for all the environments
var environments = {};

// Staging {default} environment
environments.staging = {
 	'httpPort': 3000,
 	'httpsPort': 3001,
 	'envName': 'staging',
 	'hashingSecret': 'secret'
};

// Production environment
environments.production = {
	'httpPort': 5000,
	'httpsPort': 5001,
 	'envName': 'production',
 	'hashingSecret': 'alsosecret'
};

// Determine which environment was passed a command-line arg
var currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the
// environments above, if not, default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;