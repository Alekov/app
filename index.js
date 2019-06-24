/*
 * Primary file for API
 *
 */

// Dependencies
var http = require('http');
var url = require('url');
var stringDecoder = require('string_decoder').StringDecoder;

// Creating server
var server = http.createServer(function(req, res) {

	// Get url and parse it
	var parsedUrl = url.parse(req.url, true);

	// Get the path
	var path = parsedUrl.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g, '');

	// Get the query string as an object
	var queryStringObject = parsedUrl.query;

	// Get http method
	var method = req.method.toLowerCase();

	// Get the headers as an object
	var headers = req.headers;

	// Get the payload, if there is any
	var decoder = new stringDecoder('utf-8');
	var buffer = '';
	
	req.on('data', function(data) {
		buffer += decoder.write(data);
	});
	
	req.on('end', function() {
		buffer += decoder.end();

		// Send the response
		res.end('Hello World\n');

		// Log the request path
		console.log('Request recieved with these payload:', buffer);
	});

	//console.log('Request recieved with these headers', headers);
	//console.log('Request recieved on this path: ' + trimmedPath + ' with this method: ' + method + ' and with these query string parameters ', queryStringObject);
});

// Start the server, and have it listen on port 3000
server.listen(3000, function() {
  console.log('The server is listening on port 3000');
});