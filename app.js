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


/*
	The Twitter API limits you to 900 requests/15 minutes, to the last 3200 tweets/user,
	and to 200 tweets/request. Getting 3000 tweets, then, requires 15 separate requests
	to Twitter's servers, and therefore takes a substantial amount of time. My solution
	is to 'cache' the most recent 3000 tweets every 15 minutes. This dramatically improves
	client-side loading times and ensures that the site never exceeds the 900 request limit.

	Note: I tried using a dedicated NodeJS caching module, but it was still really slow.
*/

// the 'cache'
var tweets = []
// whether or not there are tweets in the cache
var tweetsCached = false;
// temporary storage for new tweets, so the old ones can still be accessed while being updated
var newTweets = [];

// for testing
var apiCalls = 1;

// put tweets into the cache 
function cacheTweets() {
	/* 
		Recursively request 200 tweets at a time from the Twitter API
		The max_id parameter allows you to set the most recent tweet you get,
		so after the first call (which returns the most recent 200 tweets),
		set the max_id to the earliest tweet of the last 200 returned. This allows
		the application to go further and further back in time.
	*/
	function getTweets(max_id, isFirstCall) {
		var params;
		if (isFirstCall) {
			params = {
				screen_name : 'realDonaldTrump',
				count : 200,
				// don't include retweets
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
		// query the Twitter API
		twitter.getUserTimeline(params, error, function(data) {
			console.log(apiCalls);
			newTweets = newTweets.concat(JSON.parse(data));
			// keep getting tweets until there are at least 3000
			if (newTweets.length < 3000) {
				apiCalls++;
				getTweets(newTweets[newTweets.length - 1].id, false);
			} else {
				// put the tweets in the 'cache'
				tweetsCached = true;
				tweets = newTweets;
				newTweets = [];
				apiCalls = 1;
				console.log("done");
			}
		});
	}
	getTweets(0, true);
}

// cache tweets immediately once the server starts up
cacheTweets();
// update tweets every 15 minutes (900000 ms)
setInterval(cacheTweets, 900000);

// load the homepage
app.get('/', function(req, res) {
 	res.render('index');
});

// this route is called once the page is loaded, and returns the tweets in the cache
app.get('/load', function(req, res) {
	// if there are tweets in the cache, send them to the client
	// if not, try again in 100 ms
	function loadTweets() {
		if (tweetsCached) {
			res.json({tweets: tweets});
		} else {
			setTimeout(loadTweets, 100);
		}
	}
	loadTweets();
});

// set up server to listen to specified port
app.listen(port, function() {
  console.log(`listening on port ${ port }`);
});