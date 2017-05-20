// ******************************
// Search-bar functionality
// ******************************

// how long (in ms) since the last character was typed
var searchTimer = 0;
// whether a given query has already been searched
var hasSearched = false;

// clicking on a search result gets the tweets for that user
function addGetAccountOnClick(id) {
	$('#account' + id).click(function() {
		console.log($(this).html());
		$('#search-input').val($(this).html());
		makePage($(this).html());
	});
}

function search() {
    // perform search only if it's been 250 ms since last key press and query hasn't already been searched for
	if (searchTimer >= 250 && !hasSearched) {
		hasSearched = true;
		var query = $('#search-input').val();
		console.log('Searching for ' + query);
    	$.getJSON('/search', {'search': query}, function(results) {
            // if the rate limit was exceeded, disable the search function
            if (results.disableSearch) {
                $("#search-div").css({display: 'none'});
                $("#disabled-search-message").css({display: 'block'})
            } else {
                $("#search-div").css({display: 'block'});
                $("#disabled-search-message").css({display: 'none'})
                // display the results and attach click event listeners to each
        		var accounts = results.accounts;
    			$('#results').html('');
        		for (i = 0; i < accounts.length; i++) {
                    if (accounts[i] == 'No Results') {
                        $('#results').append(
                            '<li id="no-results">No Results</li>'
                        );    
                    } else {
            			$('#results').append(
            				'<li id="account' + i + '"">' + accounts[i] + '</li>'
            			);
            			addGetAccountOnClick(i);
                    }
        		}
            }        
    	});
	}
}

function enableSearching() {
	var timerInterval;
    var searchInterval;
    // on clicking the search bar
    $('#search-input').focus(function() {
        // flatten the bottom edge
    	$(this).removeClass('unclicked')
    	.addClass('clicked');
        // show the results box
    	$('#results').css({display: 'block'});
    	searchTimer = 0;
    	hasSearched = false;
        // start timer counting
    	timerInterval = setInterval(function(){searchTimer++}, 1);
        // call search every 1 ms
    	searchInterval = setInterval(search, 1);
    })
    // on clicking off the search bar
    .blur(function() {
        // de-flatten the bottom edge
	    $(this).removeClass('clicked')
	    .addClass('unclicked');
        // after 0.1 s, hide the results box -- if done immediately, the program doesn't register
        // the result that was clicked
    	setTimeout(function() {
	    	$('#results').css({display: 'none'});
            // stop timer
	    	clearInterval(timerInterval);
            // stop searching
	    	clearInterval(searchInterval);
	    }, 100);
    })
    // on typing in the search bar
    .keyup(function() {
        // a new query was entered
        hasSearched = false;
        // 0 ms since last character entry 
        searchTimer = 0;
    });
}
// ******************************