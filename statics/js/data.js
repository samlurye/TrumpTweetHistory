const monthStuff = {
	Jan : {
		name : 'January',
		num : '01'
	},
	Feb : {
		name : 'February',
		num : '02'
	},
	Mar : {
		name : 'March',
		num : '03'
	},
	Apr : {
		name : 'April',
		num : '04'
	},
	May : {
		name : 'May',
		num : '05'
	},
	Jun : {
		name : 'June',
		num : '06'
	},
	Jul : {
		name : 'July',
		num : '07'
	},
	Aug : { 
		name : 'August',
		num : '08'
	},
	Sep : {
		name : 'September',
		num : '09'
	},
	Oct : {
		name : 'October',
		num : '10'
	},
	Nov : {
		name : 'November',
		num : '11'
	},
	Dec : {
		name : 'December',
		num : '12'
	}
};

function makePlot(data, name, yaxis) {
	$('#header').html(name);
	$('#loading').remove();
	var layout = {
		xaxis : {
			title : "Date and Time of Tweet"
		},
		yaxis : {
			title : yaxis,
			rangemode : 'tozero'
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

var sortedTweets = {};

function sortTweets(tweets) {
	for (i = 0; i < tweets.length; i++) {
		var dateInfo = parseDate(tweets[i].created_at);
		if (!sortedTweets[dateInfo.year]) {
			sortedTweets[dateInfo.year] = {};
		}
		if (!sortedTweets[dateInfo.year][dateInfo.month]) {
			sortedTweets[dateInfo.year][dateInfo.month] = [];
		}
		if (!sortedTweets[dateInfo.year][dateInfo.month][dateInfo.day]) {
			sortedTweets[dateInfo.year][dateInfo.month][dateInfo.day] = [];
		}
		sortedTweets[dateInfo.year][dateInfo.month][dateInfo.day].push({
			text : tweets[i].text,
			date : dateInfo,
			likes : tweets[i].favorite_count
		});
	}
	console.log(sortedTweets);
}

function plotAll(tweets) {
	var x = [];
	var likes = [];
	for (i = 0; i < tweets.length; i++) {
		x[i] = parseDate(tweets[i].created_at).formatted;
		likes[i] = tweets[i].favorite_count;
	}
	var data = {
		x : x,
		y : likes,
		type : 'scatter'
	};
	makePlot(data, "Likes Over Time", "Likes");
}

function plotMonth(month, year) {
	var tweetsOfMonth = sortedTweets[year][month];
	var x = [];
	var likes = [];
	var runningIndex = 0;
	for (day = 0; day < tweetsOfMonth.length; day++) {
		if (tweetsOfMonth[day]) {
			for (i = 0; i < tweetsOfMonth[day].length; i++) {
				x[runningIndex] = tweetsOfMonth[day][i].date.formatted;
				likes[runningIndex] = tweetsOfMonth[day][i].likes;
				runningIndex++;
			}
		}
	}
	var data = {
		x: x,
		y: likes,
		type: 'scatter'
	};
	makePlot(data, "Likes Over Time: " + monthStuff[month].name + ' ' + year, "Likes");
}

function displayMonthButtons() {
	var monthIDs = [];
	for (var year in sortedTweets) {
	    $('#monthsDiv1').prepend(
	        '<h3 id=' + year + '>' + year + '</h1>' +
	        '<div class="container" id="months' + year + '"></div>'
	    );
	    for (var month in sortedTweets[year]) {
	        $('#months' + year).append(
	            '<div class="month-button">' +
	                '<button class="btn btn-default" id=' + month + year + '>' +
	                    month +
	                '</button>' +
	            '</div>'
	        );
	        monthIDs.push(month + year);
	        console.log(monthIDs);
	    }
	}
	$('#monthsDiv1').prepend(
		'<div class="container">' +
			'<div class="month-button">' +
				'<button class="btn btn-default" id="showAll">' +
					'All Tweets' +
				'</button>' +
			'</div>' +
		'</div>'
	);
	return monthIDs;
}

function addEventToMonthButton(monthID) {
	$('#' + monthID).click(function() {
		plotMonth(monthID.substring(0, 3), monthID.substring(3, 7));
	});
}

$(document).ready(function() {
	$.getJSON('/load', function(response) {
        console.log(response.tweets.length);
        const tweets = response.tweets.reverse();
        sortTweets(response.tweets);
        plotAll(tweets);
        var monthIDs = displayMonthButtons();
        $('#showAll').click(function() {
        	plotAll(tweets);
        });
        for (i = 0; i < monthIDs.length; i++) {
        	addEventToMonthButton(monthIDs[i]);
        }
    });
});




