function tweetArrays() {
	this.texts = [];
	this.datesFormatted = [];
	this.likes = [];
}

// object that will hold info about all tweets, sorted by year, month, and day
var sortedTweets = {
	all: new tweetArrays()
};

// some useful stuff
var monthStuff = {
	Jan: {
		name: 'January',
		num: '01'
	},
	Feb: {
		name: 'February',
		num: '02'
	},
	Mar: {
		name: 'March',
		num: '03'
	},
	Apr: {
		name: 'April',
		num: '04'
	},
	May: {
		name: 'May',
		num: '05'
	},
	Jun: {
		name: 'June',
		num: '06'
	},
	Jul: {
		name: 'July',
		num: '07'
	},
	Aug: { 
		name: 'August',
		num: '08'
	},
	Sep: {
		name: 'September',
		num: '09'
	},
	Oct: {
		name: 'October',
		num: '10'
	},
	Nov: {
		name: 'November',
		num: '11'
	},
	Dec: {
		name: 'December',
		num: '12'
	}
};

/* 
 	the Twitter API sends the date as a string formatted as 
  		"<weekday> <month name abbr.> <day> <hh>:<mm>:<ss> <???> <yyyy>"
 	parseDate() returns an object with a tweet's date info
*/
function parseDate(date) {
	var dateArr = date.split(' ');
	var timeArr = dateArr[3].split(':');
	var dayArr = dateArr[2].split('');
	var day;
	if (dayArr[0] == 0) {
		day = dayArr[1];
	} else {
		day = dateArr[2];
	}
	return {
		/* 
		 	to plot date on the x-axis with Plotly, it needs to be formatted as
		 	"yyyy-mm-dd hh:mm:ss"
		 */
		formatted: dateArr[5] + '-' + monthStuff[dateArr[1]].num + 
					'-' + dateArr[2] + ' ' + dateArr[3],
		year: dateArr[5],
		month: dateArr[1],
		day: day,
		hour: timeArr[0],
		minute: timeArr[1],
		second: timeArr [2],
	}
}

/*
 	sort the tweets in a way that makes plotting easy:
 	{
		all: tweetArrays object with all tweets,
		2016: {
			all: tweetArrays object with all tweets from 2016,
			Jan: {
				all: tweetArrays object with all tweets from Jan 2016,
				days: [
					index = 0: undefined,
					index = 1: tweetArrays object with all tweets from Jan 1, 2016,
					index = 2: ...,
					.
					.
					. 
				]
			},
			Feb: ...,
			.
			.
			.
		},
		2017: ...,
		.
		.
		.
 	}
 */
function sortTweets(tweets) {
	for (i = 0; i < tweets.length; i++) {

		var dateInfo = parseDate(tweets[i].created_at);

		// if a tweet is the first in its year, month, or day, create the relevant object for storage
		if (!sortedTweets[dateInfo.year]) {
			sortedTweets[dateInfo.year] = {all: new tweetArrays()}
		}
		if (!sortedTweets[dateInfo.year][dateInfo.month]) {
			sortedTweets[dateInfo.year][dateInfo.month] = {
				all: new tweetArrays(),
				days: []
			};
		} 
		if (!sortedTweets[dateInfo.year][dateInfo.month].days[dateInfo.day]) {
			sortedTweets[dateInfo.year][dateInfo.month].days[dateInfo.day] = new tweetArrays();	
		}

		// put the info where it should be
		sortedTweets.all.texts.push(tweets[i].text);
		sortedTweets.all.datesFormatted.push(dateInfo.formatted);
		sortedTweets.all.likes.push(tweets[i].favorite_count);

		sortedTweets[dateInfo.year].all.texts.push(tweets[i].text);
		sortedTweets[dateInfo.year].all.datesFormatted.push(dateInfo.formatted);
		sortedTweets[dateInfo.year].all.likes.push(tweets[i].favorite_count);

		sortedTweets[dateInfo.year][dateInfo.month].all.texts.push(tweets[i].text);
		sortedTweets[dateInfo.year][dateInfo.month].all.datesFormatted.push(dateInfo.formatted);
		sortedTweets[dateInfo.year][dateInfo.month].all.likes.push(tweets[i].favorite_count);

		sortedTweets[dateInfo.year][dateInfo.month].days[dateInfo.day].texts.push(tweets[i].text);
		sortedTweets[dateInfo.year][dateInfo.month].days[dateInfo.day].datesFormatted.push(dateInfo.formatted);
		sortedTweets[dateInfo.year][dateInfo.month].days[dateInfo.day].likes.push(tweets[i].favorite_count);
	}
	console.log(sortedTweets);
}
