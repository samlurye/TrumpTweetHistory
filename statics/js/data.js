function tweetArrays() {
	this.texts = [];
	this.datesFormatted = [];
	this.likes = [];
}

var sortedTweets = {
	all: new tweetArrays()
};

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

function makePlot(data, name, xaxis, yaxis) {
	$('#header').html(name);
	$('#loading').remove();
	var layout = {
		xaxis: {
			title: xaxis
		},
		yaxis: {
			title: yaxis,
			rangemode: 'tozero'
		}
	}
	Plotly.newPlot('plot', [data], layout);
}

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

function sortTweets(tweets) {
	for (i = 0; i < tweets.length; i++) {

		var dateInfo = parseDate(tweets[i].created_at);

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

function plotAllLikes() {
	var data = {
		x: sortedTweets.all.datesFormatted,
		y: sortedTweets.all.likes,
		hovertext: sortedTweets.all.texts,
		mode: 'markers',
		type: 'scatter'
	};
	makePlot(data, "Likes Over Time: 2016 and 2017", "Date and Time of Tweet", "Likes");
}

function plotLikesByYear(year) {
	var data = {
		x: sortedTweets[year].all.datesFormatted,
		y: sortedTweets[year].all.likes,
		hovertext: sortedTweets[year].all.texts,
		mode: 'markers',
		type: 'scatter'
	};
	makePlot(data, "Likes Over Time: " + year, "Date and Time of Tweet", "Likes");
}

function plotLikesByMonth(month, year) {
	var data = {
		x: sortedTweets[year][month].all.datesFormatted,
		y: sortedTweets[year][month].all.likes,
		hovertext: sortedTweets[year][month].all.texts,
		mode: 'markers',
		type: 'scatter'
	}
	makePlot(data, "Likes Over Time: " + month + " " + year, "Date and Time of Tweet", "Likes");
}

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

function configureMonthButtons() {
	for (var year in sortedTweets) {
		if (year != 'all') {
		    $('#monthsDiv1').prepend(
		        '<button class="btn btn-default" id="' + year + '">' + year + '</button>' +
		        '<div class="container" id="months' + year + '"></div>'
		    );
		    addEventToYearButton(year);
		    for (var month in sortedTweets[year]) {
		    	if (month != 'all') {
			        $('#months' + year).append(
			            '<div class="plot-button">' +
			                '<button class="btn btn-default" id=' + month + year + '>' +
			                    month +
			                '</button>' +
			            '</div>'
			        );
			        addEventToMonthButton(month + year);
			    }
		    }
		}
	}
	$('#monthsDiv1').prepend(
		'<div class="container" style="margin-bottom:10px;padding:0px">' +
			'<button class="btn btn-default" id="showAll">' +
				'All Tweets' +
			'</button>' +
		'</div>'
	);
	$('#showAll').click(function() {
		plotAllLikes();
	});
}

$(document).ready(function() {
	$.getJSON('/load', function(response) {
        console.log(response.tweets.length);
        sortTweets(response.tweets.reverse());
        configureMonthButtons();
        plotAllLikes();
    });
});




