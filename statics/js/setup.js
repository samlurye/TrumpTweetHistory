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

// gets the tweets for user accountName and sets up the page
function makePage(accountName) {
	$('#header').html('Loading ' + accountName + '\'s tweets....');
	$('#loading').css({display: 'block'});
	$('#plot').html('');
	$('#graphOptionsDiv').html('');
	// disable searching while a tweets request is processing
	$('#search-input').prop('disabled', true);
    // make sure each selection bar is on its own line
    $('.graph-select-bar').each(function() {
    	$(this).css({display: 'none'});
    });
	console.log("Making page for " + accountName);
	// get the most recent ~3000 tweets (limited by Twitter API)
	$.getJSON('/load', {q: accountName}, function(response) {
		if (response.disableSearch) {
			$('#search-div').css({display: 'none'});
			$('#disabled-search-message').css({display: 'block'})
			// and eventually, default to trump's tweets, which will be in a database
			// and not require any calls to the twitter API
		} else {
			$('#disabled-search-message').css({display: 'none'});
			$('#search-div').css({display: 'block'});
			sortedTweets = {
				all: new tweetArrays()
			};
	        console.log(response.tweets.length);
	        // the server returns the tweets in reverse chronological order, so reverse them and then sort
	        sortTweets(response.tweets.reverse());
	        // display likes over time on page load
	        plotAllLikes();
	        configureOptionsForOverTime();
	        $('#search-input').prop('disabled', false)
	        .attr('placeholder', 'Search Twitter Accounts');
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
	    }  
    });
}

// stuff to do once the page has loaded
$(document).ready(function() {
	makePage('realDonaldTrump');
	enableSearching();
});





