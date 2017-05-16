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

var commonWords = ['','the','of','to','and','a','in','is','it','you',
					'that','he','was','for','on','are','with','as','i','his',
					'they','be','at','one','have','this','from','or','had','by',
					'not','word','but','what','some','we','can','out','other','were',
					'all','there','when','up','use','your','how','said','an','each',
					'she','which','do','their','time','if','will','way','about','many',
					'then','them','write','would','like','so','these','her','long','make',
					'thing','see','him','two','has','look','more','day','could','go',
					'come','did','number','sound','no','most','people','my','over','know',
					'water','than','call','first','who','may','down','side','been','now',
					'find','any','new','work','part','take','get','place','made','live',
					'where','after','back','little','only','round','man','year','came','show',
					'every','good','me','give','our','under','name','very','through','just',
					'form','sentence','great','think','say','help','low','line','differ','turn',
					'cause','much','mean','before','move','right','boy','old','too','same',
					'tell','does','set','three','want','air','well','also','play','small',
					'end','put','home','read','hand','port','large','spell','add','even',
					'land','here','must','big','high','such','follow','act','why','ask',
					'men','change','went','light','kind','off','need','house','picture','try',
					'us','again','animal','point','mother','world','near','build','self','earth',
					'father','head','stand','own','page','should','country','found','answer','school',
					'grow','study','still','learn','plant','cover','food','sun','four','between',
					'state','keep','eye','never','last','let','thought','city','tree','cross',
					'farm','hard','start','might','story','saw','far','sea','draw','left',
					'late','run','don\'t','while','press','close','night','real','life','few',
					'north','open','seem','together','next','white','children','begin','got','walk',
					'example','ease','paper','group','always','music','those','both','mark','often',
					'letter','until','mile','river','car','feet','care','second','book','carry',
					'took','science','eat','room','friend','began','idea','fish','mountain','stop',
					'once','base','hear','horse','cut','sure','watch','color','face','wood',
					'main','enough','plain','girl','usual','young','ready','above','ever','red',
					'list','though','feel','talk','bird','soon','body','dog','family','direct',
					'pose','leave','song','measure','door','product','black','short','numeral','class',
					'wind','question','happen','complete','ship','area','half','rock','order','fire',
					'south','problem','piece','told','knew','pass','since','top','whole','king',
					'space','heard','best','hour','better','true','during','hundred','five','remember',
					'step','early','hold','west','ground','interest','reach','fast','verb','sing',
					'listen','six','table','travel','less','morning','ten','simple','several','vowel',
					'toward','war','lay','against','pattern','slow','center','love','person','money',
					'serve','appear','road','map','rain','rule','govern','pull','cold','notice',
					'voice','unit','power','town','fine','certain','fly','fall','lead','cry',
					'dark','machine','note','wait','plan','figure','star','box','noun','field',
					'rest','correct','able','pound','done','beauty','drive','stood','contain','front',
					'teach','week','final','gave','green','oh','quick','develop','ocean','warm',
					'free','minute','strong','special','mind','behind','clear','tail','produce','fact',
					'street','inch','multiply','nothing','course','stay','wheel','full','force','blue',
					'object','decide','surface','deep','moon','island','foot','system','busy','test',
					'record','boat','common','gold','possible','plane','stead','dry','wonder','laugh',
					'thousand','ago','ran','check','game','shape','equate','hot','miss','brought',
					'heat','snow','tire','bring','yes','distant','fill','east','paint','language',
					'among','grand','ball','yet','wave','drop','heart','am','present','heavy',
					'dance','engine','position','arm','wide','sail','material','size','vary','settle',
					'speak','weight','general','ice','matter','circle','pair','include','divide','syllable',
					'felt','perhaps','pick','sudden','count','square','reason','length','represent','art',
					'subject','region','energy','hunt','probable','bed','brother','egg','ride','cell',
					'believe','fraction','forest','sit','race','window','store','summer','train','sleep',
					'prove','lone','leg','exercise','wall','catch','mount','wish','sky','board',
					'joy','winter','sat','written','wild','instrument','kept','glass','grass','cow',
					'job','edge','sign','visit','past','soft','fun','bright','gas','weather',
					'month','million','bear','finish','happy','hope','flower','clothe','strange','gone',
					'jump','baby','eight','village','meet','root','buy','raise','solve','metal',
					'whether','push','seven','paragraph','third','shall','held','hair','describe','cook',
					'floor','either','result','burn','hill','safe','cat','century','consider','type',
					'law','bit','coast','copy','phrase','silent','tall','sand','soil','roll',
					'temperature','finger','industry','value','fight','lie','beat','excite','natural','view',
					'sense','ear','else','quite','broke','case','middle','kill','son','lake',
					'moment','scale','loud','spring','observe','child','straight','consonant','nation','dictionary',
					'milk','speed','method','organ','pay','age','section','dress','cloud','surprise',
					'quiet','stone','tiny','climb','cool','design','poor','lot','experiment','bottom',
					'key','iron','single','stick','flat','twenty','skin','smile','crease','hole',
					'trade','melody','trip','office','receive','row','mouth','exact','symbol','die',
					'least','trouble','shout','except','wrote','seed','tone','join','suggest','clean',
					'break','lady','yard','rise','bad','blow','oil','blood','touch','grew',
					'cent','mix','team','wire','cost','lost','brown','wear','garden','equal',
					'sent','choose','fell','fit','flow','fair','bank','collect','save','control',
					'decimal','gentle','woman','captain','practice','separate','difficult','doctor','please','protect',
					'noon','whose','locate','ring','character','insect','caught','period','indicate','radio',
					'spoke','atom','human','history','effect','electric','expect','crop','modern','element',
					'hit','student','corner','party','supply','bone','rail','imagine','provide','agree',
					'thus','capital','won\'t','chair','danger','fruit','rich','thick','soldier','process',
					'operate','guess','necessary','sharp','wing','create','neighbor','wash','bat','rather',
					'crowd','corn','compare','poem','string','bell','depend','meat','rub','tube',
					'famous','dollar','stream','fear','sight','thin','triangle','planet','hurry','chief',
					'colony','clock','mine','tie','enter','major','fresh','search','send','yellow',
					'gun','allow','print','dead','spot','desert','suit','current','lift','rose',
					'continue','block','chart','hat','sell','success','company','subtract','event','particular',
					'deal','swim','term','opposite','wife','shoe','shoulder','spread','arrange','camp',
					'invent','cotton','born','determine','quart','nine','truck','noise','level','chance',
					'gather','shop','stretch','throw','shine','property','column','molecule','select','wrong',
					'gray','repeat','require','broad','prepare','salt','nose','plural','anger','claim',
					'continent','oxygen','sugar','death','pretty','skill','women','season','solution','magnet',
					'silver','thank','branch','match','suffix','especially','fig','afraid','huge','sister',
					'steel','discuss','forward','similar','guide','experience','score','apple','bought','led',
					'pitch','coat','mass','card','band','rope','slip','win','dream','evening',
					'condition','feed','tool','total','basic','smell','valley','nor','double','seat',
					'arrive','master','track','parent','shore','division','sheet','substance','favor','connect',
					'post','spend','chord','fat','glad','original','share','station','dad','bread',
					'charge','proper','bar','offer','segment','slave','duck','instant','market','degree',
					'populate','chick','dear','enemy','reply','drink','occur','support','speech','nature',
					'range','steam','motion','path','liquid','log','meant','quotient','teeth','shell',
					'neck', '-', '&amp;'];

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
	makePlot(data, "Likes Per Tweet Over Time: 2016 and 2017", "Date and Time of Tweet", "Likes");
}

function plotLikesByYear(year) {
	var data = {
		x: sortedTweets[year].all.datesFormatted,
		y: sortedTweets[year].all.likes,
		hovertext: sortedTweets[year].all.texts,
		mode: 'markers',
		type: 'scatter'
	};
	makePlot(data, "Likes Per Tweet Over Time: " + year, "Date and Time of Tweet", "Likes");
}

function plotLikesByMonth(month, year) {
	var data = {
		x: sortedTweets[year][month].all.datesFormatted,
		y: sortedTweets[year][month].all.likes,
		hovertext: sortedTweets[year][month].all.texts,
		mode: 'markers',
		type: 'scatter'
	}
	makePlot(data, "Likes Per Tweet Over Time: " + month + " " + year, "Date and Time of Tweet", "Likes");
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

function plotAverageLikes() {
	var sum = 0;
	var likes = sortedTweets.all.likes;
	var likesAvg = [];
	for (i = 0; i < sortedTweets.all.likes.length; i++) {
		sum = sum + likes[i];
		likesAvg[i] = sum / (i + 1);
	}
	var data = {
		x: sortedTweets.all.datesFormatted,
		y: likesAvg,
		type: 'scatter'
	};
	makePlot(data, "Average Likes Per Tweet Over Time", "Date and Time of Tweet", "Average Likes");
}

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
	var data = {
		x: days,
		y: tweetsPerDay,
		mode: 'markers',
		type: 'scatter'
	};
	makePlot(data, "Tweets Per Day", "Days", "Number of Tweets");
}

function plotCommonWords() {
	var words = {};
	var numMentions = {};
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
	for (var word in words) {
		if ($.inArray(word, commonWords) == -1) {
			if (!numMentions[words[word]]) {
				numMentions[words[word]] = [];
			}
			numMentions[words[word]].push(word);
		}
	}
	var x = [];
	var y = [];
	for (var mentions in numMentions) {
		if (mentions >= 50) {
			for (i = 0; i < numMentions[mentions].length; i++) {
				x.unshift(numMentions[mentions][i]);
				y.unshift(mentions);
			}
		}
	}
	var data = {
		x: x,
		y: y,
		type: 'bar'
	};
	makePlot(data, "(Non-Common) Words Used At Least 50 Times", "Word", "Number of Uses");
};

$(document).ready(function() {
	$.getJSON('/load', function(response) {
        console.log(response.tweets.length);
        sortTweets(response.tweets.reverse());
        plotAllLikes();
        configureOptionsForOverTime();
        $('.graph-select-bar').each(function() {
        	$(this).css({display: 'block'});
        });
        $('#overtime').click(function() {
        	$('#graphOptionsDiv').css({display: 'block'});
        	plotAllLikes();
        });
        $('#avg').click(function() {
        	$('#graphOptionsDiv').css({display: 'none'});
        	plotAverageLikes();
        });
        $('#perDay').click(function() {
        	$('#graphOptionsDiv').css({display: 'none'});
        	plotTweetsPerDay();
        });
        $('#uses').click(function() {
        	$('#graphOptionsDiv').css({display: 'none'});
        	plotCommonWords();
        });
    });
});




