/**************************************************************************************

Trump Tweet History
By: Sam Lurye
Created: May 2017

Most Recent Update: May 17, 2017

This file contains a majority of the client-side code for trump-tweet-history-appspot.com.
It handles all of the graphing etc.

**************************************************************************************/

/* 
	Separates each tweet into three separate pieces of info:
		-the text of the tweet
		-the date of the tweet, formatted in a way that Plotly.js can understand
		-the number of likes the tweet has
	So texts[i], datesFormatted[i], likes[i] represents the info for the i'th tweet stored
	The Plotly.js documentation makes it clear why I use this structure
*/
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

// makes the plot, using Plotly.js
function makePlot(data, name, xaxis, yaxis, rangeManual) {
	// set the title of the graph
	$('#header').html(name);
	// remove the loading animation
	$('#loading').remove();
	// set axis titles, and make sure it always displays y = 0
	var layout = {
		xaxis: {
			title: xaxis
		},
		yaxis: {
			title: yaxis,
			rangemode: 'tozero'
		}
	}
	// allow for y-axis range to be set manually
	if (rangeManual) {
		layout.yaxis['range'] = rangeManual.yrange; 
	}
	// make the plot
	Plotly.newPlot('plot', data, layout);
}

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

// ****************************** 
// Functions for plotting likes
// ******************************

function plotAllLikes() {
	var data = [{
		x: sortedTweets.all.datesFormatted,
		y: sortedTweets.all.likes,
		hovertext: sortedTweets.all.texts,
		mode: 'markers',
		type: 'scatter'
	}];
	makePlot(data, "Likes Per Tweet Over Time: 2016 and 2017", "Date and Time of Tweet", "Likes");
}

function plotLikesByYear(year) {
	var data = [{
		x: sortedTweets[year].all.datesFormatted,
		y: sortedTweets[year].all.likes,
		hovertext: sortedTweets[year].all.texts,
		mode: 'markers',
		type: 'scatter'
	}];
	makePlot(data, "Likes Per Tweet Over Time: " + year, "Date and Time of Tweet", "Likes");
}

function plotLikesByMonth(month, year) {
	var data = [{
		x: sortedTweets[year][month].all.datesFormatted,
		y: sortedTweets[year][month].all.likes,
		hovertext: sortedTweets[year][month].all.texts,
		mode: 'markers',
		type: 'scatter'
	}];
	makePlot(data, "Likes Per Tweet Over Time: " + month + " " + year, "Date and Time of Tweet", "Likes");
}
// ******************************

// ******************************
// Add the different options for plotting likes
// ******************************
function addEventToMonthButton(monthID) {
	$('#' + monthID).click(function() {
		var month = monthID.substring(0, 3);
		var year = monthID.substring(3, 7);
		plotLikesByMonth(month, year);
	});
}

function addEventToYearButton(year) {
	$('#' + year).click(function() {
		plotLikesByYear(year);
	});
}

function configureOptionsForOverTime() {
	for (var year in sortedTweets) {
		if (year != 'all') {
		    $('#graphOptionsDiv').prepend(
		        '<div class="container graph-select-bar">' +
		        	'<div class="graph-select-bar-inner" id="' + year + 'Options">' +
		        		'<div class="graph-select" id="' + year + '">' +
		        			year +
		        		'</div>' +
		        	'</div>' +
		        '</div>' +
		        '<hr>'
		    );
		    addEventToYearButton(year);
		    for (var month in sortedTweets[year]) {
		    	if (month != 'all') {
			        $('#' + year + 'Options').append(
			            '<div class="graph-select" id="' + month + year + '">' +
			            	monthStuff[month].name +
			            '</div>'
			        );
			        addEventToMonthButton(month + year);
			    }
		    }
		}
	}
	$('#graphOptionsDiv').prepend(
		'<div class="container graph-select-bar">' +
        	'<div class="graph-select-bar-inner">' +
        		'<div class="graph-select" id="showAll">' +
        			'All Tweets' +
        		'</div>' +
        	'</div>' +
        '</div>' +
        '<hr>'	
	);
	$('#showAll').click(function() {
		plotAllLikes();
	});
}
// ******************************

// ******************************
// If plotChange = true, plots the change in average likes per day
// If plotChange = false, plots the average likes per tweet over time
// ******************************
function plotAverageLikes(plotChange) {
	var sum = 0;
	var likes = sortedTweets.all.likes;
	var likesAvg = [];
	var delta = [0];
	for (i = 0; i < sortedTweets.all.likes.length; i++) {
		sum = sum + likes[i];
		likesAvg[i] = sum / (i + 1);
		if (i >= 1) {
			delta.push(likesAvg[i] - likesAvg[i - 1]);
		}
	}
	var AverageLikes = [{
		x: sortedTweets.all.datesFormatted,
		y: likesAvg,
		type: 'scatter'
	}];
	var Delta = [{
		x: sortedTweets.all.datesFormatted,
		y: delta,
		type: 'scatter'
	}];
	var deltaRange = {
		yrange: [-300, 300]
	};
	if (plotChange) {
		makePlot(Delta, "Change: Average Likes Per Tweet Over Time", "Date and Time of Tweet", "Change in Average Likes", deltaRange);
	} else {
		makePlot(AverageLikes, "Average Likes Per Tweet Over Time", "Date and Time of Tweet", "Average Likes");
	}
}

// ******************************
// Function for plotting number of tweets per day
// ******************************
function plotTweetsPerDay() {
	var days = [];
	var tweetsPerDay = [];
	for (var year in sortedTweets) {
		if (year != 'all') {
			for (var month in sortedTweets[year]) {
				if (month != 'all') {
					for (i = 0; i < sortedTweets[year][month].days.length; i++) {
						if (sortedTweets[year][month].days[i]) {
							tweetsPerDay.push(sortedTweets[year][month].days[i].texts.length);
							days.push(sortedTweets[year][month].days[i].datesFormatted[0].split(' ')[0]);
						}
					}
				}	
			}
		}
	}
	var data = [{
		x: days,
		y: tweetsPerDay,
		mode: 'markers',
		type: 'scatter'
	}];
	makePlot(data, "Tweets Per Day", "Days", "Number of Tweets");
}
// ******************************

// ******************************
// Function for plotting most frequently used words
// ******************************
function plotCommonWords() {
	var words = {};
	var numMentions = {};
	// fill an object with all words used and how many times they were used
	for (i = 0; i < sortedTweets.all.texts.length; i++) {
		var tweetWords = sortedTweets.all.texts[i].toLowerCase().split(' ');
		for (j = 0; j < tweetWords.length; j++) {
			if (words[tweetWords[j]]) {
				words[tweetWords[j]] = words[tweetWords[j]] + 1;
			} else {
				words[tweetWords[j]] = 1;
			}
		}
	}
	// Fill an object whose keys are number of times a word was used
	// and whose values are arrays with all the words used that many times,
	// getting rid of all of the most common words
	// This automatically sorts the words in ascending order
	for (var word in words) {
		if ($.inArray(word, commonWords) == -1) {
			if (!numMentions[words[word]]) {
				numMentions[words[word]] = [];
			}
			numMentions[words[word]].push(word);
		}
	}
	// x-axis data (word)
	var x = [];
	// y-axis data (number of uses)
	var y = [];
	// get all the words used at least 50 times in descending order
	for (var mentions in numMentions) {
		if (mentions >= 50) {
			for (i = 0; i < numMentions[mentions].length; i++) {
				x.unshift(numMentions[mentions][i]);
				y.unshift(mentions);
			}
		}
	}
	var data = [{
		x: x,
		y: y,
		type: 'bar'
	}];
	makePlot(data, "(Non-Common) Words Used At Least 50 Times", undefined, "Number of Uses");
};
// ******************************

// stuff to do once the page has loaded
$(document).ready(function() {
	// get the most recent ~3000 tweets (limited by Twitter API)
	$.getJSON('/load', function(response) {
        console.log(response.tweets.length);
        // the server returns the tweets in reverse chronological order, so reverse them and then sort
        sortTweets(response.tweets.reverse());
        // display likes over time on page load
        plotAllLikes();
        configureOptionsForOverTime();
        // make sure each selection bar is on its own line
        $('.graph-select-bar').each(function() {
        	$(this).css({display: 'block'})
        });
        // clicking back on the "Likes Over Time" option re-displays the year and month buttons
        $('#overtime').click(function() {
        	$('#graphOptionsDiv').css({display: 'block'});
        	plotAllLikes();
        });
        // make the rest of the graph options perform their functions on click, hiding the year and month buttons
        $('#avg').click(function() {
        	$('#graphOptionsDiv').css({display: 'none'})
        	plotAverageLikes(false);
        });
        $('#avgDelta').click(function() {
        	$('#graphOptionsDiv').css({display: 'none'})
        	plotAverageLikes(true);	
        })
        $('#perDay').click(function() {
        	$('#graphOptionsDiv').css({display: 'none'})
        	plotTweetsPerDay();
        });
        $('#uses').click(function() {
        	$('#graphOptionsDiv').css({display: 'none'})
        	plotCommonWords();
        });
    });
});




