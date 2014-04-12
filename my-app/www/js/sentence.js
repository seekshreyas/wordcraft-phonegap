var WORDCRAFT = WORDCRAFT || {}

WORDCRAFT.build = (function(){

	var gameLevel = 0;
	var partsofSpeech = {};
	var fullJsonData = {};
	var nounSuffix = {"The":"s","A":"","An":""}
	var vowels=['a','e','i','o','u'];
	var pluralWords = ['sheep'];
	var helpVerbType = {"is":"singular","are":"plural"};
	var currWordList = {"noun":[],"helpverb":[],"verb":[],"prep":[],"adj":[],"det":[]};
	var sentWordList = {"noun":[],"helpverb":[],"verb":[],"prep":[],"adj":[],"det":[]};
	var levelPOSCnt = {0:{"noun":2,"helpverb":2,"verb":3,"prep":0,"adj":0,"adv":0,"det":0},
					   1:{"noun":2,"helpverb":2,"verb":3,"prep":3,"adj":0,"adv":0,"det":0},
					   2:{"noun":2,"helpverb":2,"verb":3,"prep":3,"adj":3,"adv":0,"det":3}};
	var jsonForImage = {"body":{},"pos":{},"animation":[]};

	var init = function(){
		console.log("let the crafting begin!");

		//Reading data from source file to get a master list of nouns/verbs
		var pos_json = $.getJSON( "res/data/parts-of-speech.json") 
			.done(function(data) {
				partsofSpeech = data;   
			})
			.fail(function() {
			    console.log( "error" );
			});

		//Reading properties file 
		var full_json = $.getJSON( "res/data/full_json.json") 
			.done(function(data) {
				console.log("Read full json");
				fullJsonData = data; 
				initReadData();
			})
			.fail(function() {
			    console.log( "error" );
			});

		Array.prototype.remove = function(value) {
		  var idx = this.indexOf(value);
		  if (idx != -1) {
		  	  // The second parameter is the number of elements to remove.
		      return this.splice(idx, 1); 
		  }
		  return false;
		};


		$("#btn_add_words").bind("taphold",function() {
			initReadData();
		});


		$(document).on("taphold",".circled-cross", function(){
			var pos = $(this).parent().attr("class").split(" ")[1];
			
			pos = pos.substr(3,pos.length);
			var word = $(this).parent().attr("id");		
			word =  word.split("_")[1];
			currWordList[pos].remove(word);
			sentWordList[pos].remove(word);
			$(this).parent().remove();

			if( pos === 'noun')
			{
				helpverb = $("#sent-helpverb-1 li").text();
				currWordList["helpverb"].remove(helpverb);
				sentWordList["helpverb"].remove(helpverb);
				$("#sent-helpverb-1 li").remove();
			}
		});


	};
	
	var initReadData = function()
	{	
		
		if (gameLevel === 1)
		{
			console.log()
			$("#sent-prep-1").addClass("active");
			$("#sent-noun-2").addClass("active");
		}
		if (gameLevel === 2)
		{
			console.log("Inside level 2");
			$("#sent-det-1").addClass("active");
			$("#sent-adj-1").addClass("active");
			$("#sent-prep-1").addClass("active");
			$("#sent-noun-2").addClass("active");
			var nounText = $("#sent-noun-1 li").text().split(" ");
			if(nounText.length>1)
			{
				if(jQuery.inArray(nounText[0], currWordList["det"]) == -1)
				{
					currWordList["det"].push(nounText[0]);
				}
			 	var html = '<li class="draggable li-det" id="det_'+nounText[0]+'">'+nounText[0];
			 	html +=  + '<span class="icon-entypo circled-cross" style="cursor: pointer;"></span></li>';
				$("#sent-det-1").append(html);
				var nounId = $("#sent-noun-1 li").attr("id").split("_")[1];
				var nounhtml = '<li class="draggable li-noun" id="noun_'+nounId+'">'+nounText[1] 
				nounhtml += '<span class="icon-entypo circled-cross" style="cursor: pointer;"></span></li>';
				
				$('#sent-noun-1').find('li').remove();
				$("#sent-noun-1").append(nounhtml);
			}
		}


		parseData(partsofSpeech);	

	};

	var getPOSToDisplay = function(data,level,pos)
	{
		var posClass="";
		var wordText = "";
		var currData = $(divId).children().get();
		$.each(currData, function(i,val) {
			if(jQuery.inArray(val.text(), currWordList[pos])==-1)
			{
				currWordList[pos].push(val.text());
			}
		});
		var divId = "#init-"+pos;
		var currData = $(divId).contents();
		if(currWordList[pos].length < levelPOSCnt[level][pos])
		{
			while(currWordList[pos].length < levelPOSCnt[level][pos])
			{
				var randIndex  = 1 + Math.floor(Math.random() * data[pos].length-1);
				var word = data[pos][randIndex];
				if(jQuery.inArray(word, currWordList[pos])==-1)
				{
					wordText = word;
					currWordList[pos].push(word);
					if(pos === 'noun')
					{
						tmpNoun = getNounPrefixSufix(pos,word);
						posClass = 'noun_'+tmpNoun[1];

						wordText = tmpNoun[0];
					}
					if(pos === 'det')
					{
						if(wordText === 'The')
						{
							posClass = 'det_plural';
						}	
						else
						{
							posClass = 'det_singular';
						}
					}
					if(pos === 'helpverb')
					{
						posClass = "helpverb-"+helpVerbType[word];
					}	
					if(jQuery.inArray(wordText.substr(0,1),vowels) !== -1)
					{
						posClass = posClass+' '+pos+'_vowel';
					}
					var htmlLi = '<li class="draggable li-'+pos+' '+posClass+'" id="'+pos+'_'+word.replace(" ","_")+'">'+ wordText;
					htmlLi = htmlLi + '<span class="icon-entypo circled-cross" style="cursor: pointer;"></span></li>' ;
					$(divId).append(htmlLi);						
				}		
			}
			
		}
		if(currWordList[pos].length === levelPOSCnt[level][pos])
		{
			//alert(currWordList[pos]);
			getPrepToDisplay(pos,divId,gameLevel);
		}
	}

	var getNounPrefixSufix = function(pos,word)
	{
		var tmpPrefixDet = jQuery.inArray(word, currWordList[pos])%2;
		var prefixDet = partsofSpeech["det"][tmpPrefixDet];
		var currDet = $("#sent-det-1 li").text();
		var suffix = nounSuffix[prefixDet];

		if(jQuery.inArray(word,pluralWords) !== -1)
		{
			suffix = "";
		}		
		//alert(currDet);
		if(gameLevel > 1)
		{
			if(currDet.length>0)
			{
				prefixDet = currDet;
			}
			word = word + suffix;
		}
		else
		{
			word = prefixDet + " " + word + suffix;
		}
		if(nounSuffix[prefixDet])
		{
			posClass = 'plural';
		}
		else
		{
			posClass = 'singular';
		}

		return [word,posClass];
	}

	var getPrepToDisplay = function(pos,divId,level)
	{
		var tmpPrep = [];
		if(pos === 'verb')
		{
			var currData = $(divId).children().get();
			var counter = 0;
			$.each(currWordList["verb"], function(i,val) {
				prepositions = Object.keys(fullJsonData.verb[val].preposition);
				if(currWordList["prep"].length < levelPOSCnt[level]["prep"])
				{
					var randIndex  = 1 + Math.floor(Math.random() * prepositions.length-1);
					var word = prepositions[randIndex];
					if(jQuery.inArray(word, currWordList["prep"])==-1)
					{
						currWordList["prep"].push(word);
						var htmlLi = '<li class="draggable li-prep prep-'+val+'" id="prep_'+word.replace(" ","_")+'">'+ word + '<span class="icon-entypo circled-cross" style="cursor: pointer;"></span></li>' ;
						$("#init-prep").append(htmlLi);	
					}
					else
					{
						console.log("Inside prep add class");
						$("#prep_"+word.replace(" ","_")).addClass("prep-"+val);
					}
				}
			});	
		}
	}

	var parseData = function(d){
	
		getPOSToDisplay(d,gameLevel,"det");
		getPOSToDisplay(d,gameLevel,"noun");
		getPOSToDisplay(d,gameLevel,"helpverb");
		getPOSToDisplay(d,gameLevel,"verb");
		getPOSToDisplay(d,gameLevel,"adj");

		makeDragabble();
		//draw_image();

	};

	var populateOnDrop = function(obj,type,form){
		var listItem = $(obj).text();
		var wordId = $(obj).attr("id").split("_")[1]
		var divid = "#sent-"+type.toString()+"-"+form.toString();

		/* Code to remove the existing word from sentence area */
		currId = $(divid+' li').attr("id");
		if(currId)
		{
			word = currId.split("_")[1];
			currWordList[type.toString()].remove(word);
			sentWordList[type.toString()].remove(word);
			$(divid).find('li').remove();
		}
		$(obj).remove();
		
		if(jQuery.inArray(wordId, currWordList[type.toString()])==-1)
		{
		 	currWordList[type.toString()].push(wordId);
		}
		if(jQuery.inArray(wordId, sentWordList[type.toString()])==-1)
		{
		 	sentWordList[type.toString()].push(wordId);
		}
		var html = '<li class="draggable li-'+type.toString()+'" id="'+type.toString()+'_'+ wordId+'">'+ listItem + '<span class="icon-entypo circled-cross" style="cursor: pointer;"></span></li>';

		$(divid).append(html);
		return true;
	}

	var makeDragabble = function(){

		$('#init-noun').children().each(function(index,value) {
			new webkit_draggable(value.id, {revert : true, scroll : true});
		});
		$('#init-helpverb').children().each(function(index,value) {
			new webkit_draggable(value.id, {revert : true, scroll : true});
		});

		$('#init-verb').children().each(function(index,value) {
			new webkit_draggable(value.id, {revert : true, scroll : true});
		});

		$('#init-prep').children().each(function(index,value) {
			new webkit_draggable(value.id, {revert : true, scroll : true});
		});

		$('#init-det').children().each(function(index,value) {
			new webkit_draggable(value.id, {revert : true, scroll : true});
		});

		$('#init-adj').children().each(function(index,value) {
			new webkit_draggable(value.id, {revert : true, scroll : true});
		});
		makeDroppable();

	};

	/* Needs to be populated work in progress*/
	var makeDroppableOnCancel = function()
	{


	}


	var makeDroppable = function()
	{
		webkit_drop.add('sent-det-1', 
		{ accept : ["li-det"], 
			onDrop : function(obj){	
				populateOnDrop($(obj),'det','1');
			}
		});

		webkit_drop.add('sent-adj-1', 
		{ accept : ["li-adj"], 
			onDrop : function(obj){	
				if(populateOnDrop($(obj),'adj','1'))
				{
					draw_image();
				}
			}
		});

		webkit_drop.add('sent-noun-1', 
		{	accept : ["li-noun"], 
			onDrop : function(obj){
					if(populateOnDrop($(obj),'noun','1'))
					{
						var arrayOfClasses = $(obj).attr('class').split(' ');
						nounType = arrayOfClasses[2].split("_")[1];
						draw_image();
						webkit_drop.add('sent-helpverb-1', 
						{	accept : ["helpverb-"+nounType], 
							onDrop : function(subObj){
									populateOnDrop($(subObj),'helpverb','1');
							}
							
						});

					}
			}
			
		});

		webkit_drop.add('sent-verb-1', 
		{ accept : ["li-verb"], 
			onDrop : function(obj){	
				if(populateOnDrop($(obj),'verb','1'))
				{
					var prepClass = $(obj).text()
					prepClass = "prep-"+prepClass;
					draw_image();
					webkit_drop.add('sent-prep-1', 
					{	
						accept : [prepClass], 
						onDrop : function(subObj){
							populateOnDrop($(subObj),'prep','1');
						}
						
					});
				}

				} 
		});

		webkit_drop.add('sent-noun-2', 
		{	accept : ["li-noun"], 
			onDrop : function(obj){
				if(populateOnDrop($(obj),'noun','2'))
				{
					draw_image();
				}
			}
		});
		
		//draw_image();
	};



	var draw_image = function()
	{
		//alert("Inside draw image");
		if(sentWordList["noun"][0].length > 0)
		{
			/*
			getJson method creates the actual Json. Following values
			are passed to determine the json structure
			1. Only noun 1 avaiable
			2. noun1 and verb are available
			3. noun1, verb, prep,noun2 are available
			4. noun1, verb, noun2 and adj are available
			*/
			if (sentWordList["verb"].length>0 && sentWordList["helpverb"].length>0)
			{
				getJson(2);
				gameLevel = 1;
				initReadData();

			}
			else
			{
				getJson(1);
			}
		}

		if(sentWordList["noun"].length>1 && sentWordList["verb"].length>0 && sentWordList["prep"].length>0)
		{
			if (sentWordList["adj"].length>0)
			{
				getJson(4);
				initReadData();
			}
			else
			{
				getJson(3);
				gameLevel = 2;
				if(gameLevel === 2)
				{
				 	initReadData();
				}
				
			}

		}

		return true;

	};


	var playSound = function()
	{
		console.log("Clicked remove");
		/*$("#sound").append('<source src="res/sound/Cat.wav"></source><source src="res/sound/Cat.ogg"></source>');
		var audio = $("#sound")[0];
		audio.play();

		levelChange();	*/	
	};

	var getJson = function(status)
	{
		body_url = fullJsonData["noun"][sentWordList["noun"]]["svg"]["src"];
		body_dim = fullJsonData["noun"][sentWordList["noun"]]["svg"]["dimension"];
		canvas_pos = fullJsonData["noun"][sentWordList["noun"]]["canvaspos"];
		plane = canvas_pos["plane"];
		plane_pos = canvas_pos["defaultX"] + "_" + canvas_pos["defaultY"];
		//alert(JSON.stringify(plane_pos));
		jsonForImage["body"]["eyes"] = "res/img/animals/"+sentWordList["noun"]+"/"+body_url["eyes"];
		jsonForImage["body"]["skin"] = "res/img/animals/"+sentWordList["noun"]+"/"+body_url["skin"];
		jsonForImage["body"]["mouth"] = "res/img/animals/"+sentWordList["noun"]+"/"+body_url["mouth"];
		jsonForImage["body"]["color"] = "";
		jsonForImage["body"]["size"] = "normal";
		jsonForImage["body"]["width"] = body_dim["width"];
		jsonForImage["body"]["height"] = body_dim["height"];
		jsonForImage["pos"] = { "plane":plane,
								"plane_pos": plane_pos,
								"plane_matrix":[0,0] };

		if(status === 2)
		{
			animation = fullJsonData["verb"][sentWordList["verb"]]["animation"];
			jsonForImage["animation"] = animation;
		}
		/*if(status > 2)
		{
			prep = fullJsonData["verb"][sentWordList["verb"]]["preposition"][sentWordList["prep"]];
			prepX = prep["position_change"]
		}*/
		//alert(JSON.stringify(jsonForImage));

		WORDCRAFT.handleSentChanges([jsonForImage]);

	};

	var levelChange = function(){
		initReadData();
		//var overlay = jQuery('<div id="overlay"><p style="float:left">Level Complete!!!</p><div id="overlay-del"><b>X</b></div> </div>');
		//overlay.appendTo(document.body);
	
	}

	return {
		'init' : init,
		'gameLevel': gameLevel	

	};

})();

