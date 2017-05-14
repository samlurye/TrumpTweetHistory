const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

/************************* 
Configure the twitter API
*************************/

module.exports = require('twitter-js-client/lib/Twitter');

//Callback functions
var error = function(err, response, body) {
	console.log('ERROR [%s]', body);
};

var Twitter = require('twitter-node-client').Twitter;

var config = {
	"consumerKey": "JKB5XexbOEucGAM1DqfbNaCz1",
	"consumerSecret": "OH3oLQwG5C9usgxKZig2uftr2pi2loQozOgoSIDSJB4bMPCzFr",
	"accessToken": "791320431307452416-2asevnJNILCF3Xwb0oTSEPLyv6AaRom",
	"accessTokenSecret": "IeRdnqX4jdScWK9Fyj8brvMaGDNJCoDrvPb4Wo55X44pU",
	"callBackUrl": "None"
};

var twitter = new module.exports.Twitter(config);

//************************

// allow html files to access external scripts from directory 'statics'
app.use(express.static('statics'));
// set templating engine to pug
app.set('view engine', 'pug');

// load the homepage
app.get('/', function(req, res) {
 	res.render('index');
});

app.get('/load', function(req, res) {
	var tweets = [];
	function getTweets(max_id, isFirstCall) {
		var params;
		if (isFirstCall) {
			params = {
				screen_name : 'realDonaldTrump',
				count : 200,
				include_rts : false
			};
		} else {
			params = {
				screen_name : 'realDonaldTrump',
				count : 200,
				max_id : max_id,
				include_rts : false
			};
		}
		twitter.getUserTimeline(params, error, function(data) {
			tweets = tweets.concat(JSON.parse(data));
			if (tweets.length < 3000) {
				getTweets(tweets[tweets.length - 1].id, false);
			} else {
				res.json({tweets : tweets});
			}
		});
	}
	getTweets(0, true);
});

// set up server to listen to specified port
app.listen(port, function() {
  console.log(`listening on port ${ port }`);
});