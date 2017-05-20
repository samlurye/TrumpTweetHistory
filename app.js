const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
console.log(process.env.HELLO);

/************************* 
Configure the twitter API
*************************/

var Twitter = require('twitter');

var client = new Twitter({
	consumer_key: 'JKB5XexbOEucGAM1DqfbNaCz1',
  	consumer_secret: 'OH3oLQwG5C9usgxKZig2uftr2pi2loQozOgoSIDSJB4bMPCzFr',
  	access_token_key: '791320431307452416-2asevnJNILCF3Xwb0oTSEPLyv6AaRom',
  	access_token_secret: 'IeRdnqX4jdScWK9Fyj8brvMaGDNJCoDrvPb4Wo55X44pU'
});

//************************

// allow html files to access external scripts from directory 'statics'
app.use(express.static('statics'));
// set templating engine to pug
app.set('view engine', 'pug');

var searchRateLimitExceeded = false;

// load the homepage
app.get('/', function(req, res) {
 	res.render('index');
});

// check to see if the program has exceeded the allotted number of requests to the API
function checkRateLimit() {
	client.get('application/rate_limit_status', function(error, data, misc) {
		var usersExceeded = (data.resources.users['/users/search'].remaining > 0);
		var timelineExceeded = (data.resources.statuses['/statuses/user_timeline'].remaining > 0);
		if (usersExceeded && timelineExceeded) {
			console.log('Search Enabled');
			searchRateLimitExceeded = false;
		} else {
			console.log('Search Disabled');
		}
	});
}

// check every minute
setInterval(checkRateLimit, 60000);

app.get('/load', function(req, res) {
	var tweets = [];
	var apiCalls = 0;
	function getTweets(max_id, isFirstCall) {
		var params;
		if (isFirstCall) {
			params = {
				screen_name : req.query.q,
				count : 200,
				// don't include retweets
				include_rts : false
			};
		} else {
			params = {
				screen_name : req.query.q,
				count : 200,
				max_id : max_id,
				include_rts : false
			};
		}
		if (searchRateLimitExceeded) {
			return res.json({tweets: [], disableSearch: true});
		} else {
			// query the Twitter API
			client.get('statuses/user_timeline', params, function(error, data, misc) {
				// error: rate limit exceeded, disable search
				if (data.errors) {
					searchRateLimitExceeded = true;
					return res.json({tweets: [], disableSearch: true});
				// otherwise keep going
				} else {
					tweets = tweets.concat(data);
					// keep getting tweets until there are at least 3000 or until 15 calls have been made
					console.log(req.query.q + ' ' + tweets.length);
					if (tweets.length < 3000 && apiCalls < 15) {
						apiCalls++;
						getTweets(tweets[tweets.length - 1].id, searchRateLimitExceeded);
					} else {
						console.log("done");
						res.json({tweets: tweets, disableSearch: searchRateLimitExceeded});
					}
				}
			});
		}
	}	
	getTweets(0, true);
});

app.get('/search', function(req, res) {
	if (searchRateLimitExceeded) {
		return res.json({accounts: [], disableSearch: true});
	} else {
		// if no query was entered, display 'No Results', don't bother searching the API
		if (!req.query.search) {
			res.json({accounts: ['No Results']});
		} else {
			// search the API
			client.get('users/search', {'q': req.query.search,'count': 20}, function(error, data, misc) {
				// error: rate limit exceeded, disable search
				if (data.errors) {
					console.log("Rate Limit Exceeded");
					searchRateLimitExceeded = true;
					return res.json({accounts: [], disableSearch: searchRateLimitExceeded});
				// otherwise send results to page
				} else {
					if (data.length == 0) {
						res.json({accounts: ['No Results'], disableSearch: searchRateLimitExceeded});
					} else {
						var accounts = [];
						for (i = 0; i < Math.min(data.length, 10); i++) {
							accounts[i] = data[i].screen_name;
						}
						res.json({accounts: accounts, disableSearch: searchRateLimitExceeded});
					}
				}
			});
		}
	}
});

// set up server to listen to specified port
app.listen(port, function() {
  console.log(`listening on port ${ port }`);
});



