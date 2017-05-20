// makes the plot, using Plotly.js
function makePlot(data, name, xaxis, yaxis, rangeManual) {
	// set the title of the graph
	$('#header').html(name);
	// remove the loading animation
	$('#loading').css({display: 'none'});
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