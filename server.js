/*
 * Imports.
 */
var express = require('express');
var app = express();

/*
 * Serve front-end app.
 */
app.use('/', express.static(__dirname + '/app'));

/*
 * Run server.
 */
var server = app.listen(3000, function() {
    console.log('Linester running on port %d', server.address().port);
});