var apiai = require('apiai');
 
 /*
//var app = apiai("e160365bc139484988bbf506b43eb43b");
var app = apiai("e386478be5674dcba273af18da045c2b");

var options = {
    sessionId: 'nodered_' + (1+Math.random()*4294967295).toString(16),
    timezone: '2016-10-09T20:02:16+0200'
}
 
var request = app.textRequest('Come again', options);


 
request.on('response', function(response) {
        console.log('response: <' + JSON.stringify(response) + '>');
});
 
request.on('error', function(error) {
        console.log('error: <' + JSON.stringify(error) + '>');
});
 
request.end()
*/

var app = apiai("e160365bc139484988bbf506b43eb43b");

msg = {payload: 'hello'};

var options = msg.options || {};
options.sessionId = options.sessionId || 'nodered_' + (1+Math.random()*4294967295).toString(16);
var request = app.textRequest(msg.payload, options);

console.log('requesting with query:<' + msg.payload + '> and options: <' + JSON.stringify(options) + '>');

request.on('response', function(response){
  console.log('response: <' + JSON.stringify(response) + '>');

});

request.on('error', function(error){
  console.log('error: <' + JSON.stringify(error) + '>');
});

request.end();


/** VOICE REQUEST EXAMPLE

var request = app.voiceRequest();

request.on('response', function(response) {
    console.log(response);
});

request.on('error', function(error) {
    console.log(error);
});

fs.readFile("rus_example.wav", function(error, buffer) {
    if (error) {
        console.log(error);
    } else {
        request.write(buffer);
    }

    request.end();
});

*/

