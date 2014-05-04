var WORDCRAFT = WORDCRAFT || {}

WORDCRAFT.build = (function(){

	var gameLevel = 0;
	var currDiv = 0;
	var partsofSpeech = {};
	var fullJsonData = {};
	var gameLevelSentWord = {0:3,1:5,2:7};
	var pluralSuffix = ["","s"];
	var nounSuffix = {"the":"s","a":"","an":""}
	var vowels=['a','e','i','o','u'];
	var pluralWords = ['sheep'];
	var helpVerbType = {"is":"singular","are":"plural"};
	var currAllWordList = {"noun":[],"helpverb":[],"verb":[],"prep":[],"adj":[],"det":[]};
	var currWordList = {0:{"noun":[],"helpverb":[],"verb":[],"prep":[],"adj":[],"det":[]},
						1:{"noun":[],"helpverb":[],"verb":[],"prep":[],"adj":[],"det":[]},
						2:{"noun":[],"helpverb":[],"verb":[],"prep":[],"adj":[],"det":[]},
						3:{"noun":[],"helpverb":[],"verb":[],"prep":[],"adj":[],"det":[]}
						};
	var sentWordList = {"noun":[],"helpverb":[],"verb":[],"prep":[],"adj":[],"det":[]};
	var levelPOSCnt =  {
		0:{"noun":2,"helpverb":2,"verb":3,"prep":0,"adj":0,"adv":0,"det":0},
		1:{"noun":2,"helpverb":2,"verb":3,"prep":3,"adj":0,"adv":0,"det":0},
		2:{"noun":2,"helpverb":2,"verb":3,"prep":3,"adj":3,"adv":0,"det":3}
		};
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

		evtHandle(); //Handling events
	};


	var evtHandle = function()
	{
		
		$("#btn_add_words").bind("vclick",function(event) {
			event.stopPropagation();
			initReadData();
		});

		$("#btn_divForward").bind("vclick",function(event) {
			event.stopPropagation();
			console.log("Reached div forward");
			var btnBackwardDiv = $("#btn_divBackward");
			var prevDiv = 0;
			if(currDiv<=2)
			{

				currDiv++;
				console.log("CURR DIV VALUE IS:",currDiv);
				prevDiv = currDiv - 1;
			}
			else
			{
				prevDiv = 3;
				currDiv = 0;
			}

			console.log("PREV DIV VALUE IS:",prevDiv);

			$(".words-list-"+prevDiv).hide();
			$(".words-list-"+currDiv).show();

			initReadData();
			
		});

		$("#btn_divBackward").bind("vclick",function(event) {
			event.stopPropagation();
			console.log("Reached div backwards");
			var btnForwardDiv = $("#btn_divForward");
			var nextDiv = "";
			if(currDiv>0)
			{
				currDiv--;
				console.log("CURR DIV VALUE IS:",currDiv);
				nextDiv = currDiv + 1;

				
			}
			else
			{
				nextDiv = 0 ;
				currDiv = 3;
				//btnForwardDiv.toggleClass("mute");
			}
		
			console.log("NEXT DIV VALUE IS:",nextDiv);
			console.log("THE CLASS OF THE DIV IS:",".words-list-"+currDiv);

			$(".words-list-"+nextDiv).hide();
			$(".words-list-"+currDiv).show();

			initReadData();
		});


		$("#btn_forward").bind("vclick",function(event) {
			event.stopPropagation();
			var currWord = getCurrWordsList(event);
			if( gameLevel === 0 && currWord[0].length>0 && currWord[1].length>0 && currWord[2].length>0)
			{
				gameLevel++;
				$("#btn_back").toggleClass("mute");
				
				//This code is to refresh everything when going from level 0 to 1
				$('.build-sentence').children().each(function (id,obj) {
					$(obj).children().each(function (id,subObj) {
						trashWords($(subObj));
						});
				});
				WORDCRAFT.canvasReset();
				$(".level p").text('Make a '+gameLevelSentWord[gameLevel]+' word sentence');
				initReadData();
			}
			else if (gameLevel === 1 && currWord[0].length>0 && currWord[1].length>0 && currWord[2].length>0 && currWord[3].length > 0 &&  currWord[4].length > 0)
			{
				gameLevel++;
				$("#btn_forward").toggleClass("mute");
				$(".level p").text('Make a '+gameLevelSentWord[gameLevel]+' word sentence');
				WORDCRAFT.canvasReset();
				initReadData();
			}	
		});

		$("#btn_back").bind("vclick",function(event) {
			event.stopPropagation();

			if(gameLevel === 1)
			{
				$("#btn_back").toggleClass("mute");
				$("#btn_forward").toggleClass("mute");
			}
			if(gameLevel > 0)
			{
				gameLevel--;
				$("#btn_forward").toggleClass("mute");
			}
			
			$(".level p").text('Make a '+gameLevelSentWord[gameLevel]+' word sentence');
			
			WORDCRAFT.canvasReset();

			$('.build-sentence').children().each(function (id,obj) {
				$(obj).children().each(function (id,subObj) {
					trashWords($(subObj));
				});
			});

			$('.words-list').children().each(function (id,obj) {
				$(obj).children().each(function (id,subObj) {
					trashWords($(subObj));
				});
			});

			initReadData();

			//event.preventDefault();
			
		});

		$("#btn_refresh").bind("vclick",function(event) {
			event.stopPropagation();
			$(".level p").text('Make a '+gameLevelSentWord[gameLevel]+' word sentence');
			WORDCRAFT.canvasReset();
			$('.build-sentence').children().each(function (id,obj) {
				$(obj).children().each(function (id,subObj) {
					trashWords($(subObj));
				});
			});

			initReadData();			
		});

		$('document').on('vclick', function(evt){
			evt.preventDefault();
		});

	}

	var trashWords = function(obj)
	{
		var elem = $(obj);
		var word = elem.attr("id");	
		var parentId = elem.parent().attr("id");
		var objClass = elem.attr("class").split(" ");			
		var pos = objClass[1].substr(3,objClass[1].length);
		var wordListDiv = ".words-list-"+currDiv; 
		console.log("Inside trash words");
		var nounType = "";
		word =  word.split("_")[1];
		if(parentId === "sent-noun-1")
		{
			WORDCRAFT.canvasReset();
		}
		if(pos === 'verb' && sentWordList["prep"]!== 'undefined')
		{
			var prep = sentWordList["prep"];
			var prepElem = $("#prep_"+prep);
			sentWordList["prep"].remove(prep);
			$("#sent-prep-1").remove("#prep_"+prep);
			
			$(wordListDiv+" #init-prep").append(prepElem);			
		}

		if(pos === "helpverb" || pos ==="det")
		{
			//$(".words-list-0 #init-"+pos).append(word);	
			currWordList[0][pos].remove(word);
		}
		else
		{

			currWordList[currDiv][pos].remove(word);
		}

		currAllWordList[pos].remove(word);
		if(sentWordList[pos]!== 'undefined')
		{
			sentWordList[pos].remove(word);
		}
		elem.remove();

		if(gameLevel <=1 )
		{
			sentenceRulesLevel1();
		}

		//Code for level 2
		if(gameLevel === 2)
		{
			sentenceRulesLevel2();
		}
	}

	var makeDroppableTrash = function()
	{

		webkit_drop.add("trash", 
		{
			accept : ["draggable"], 
			hoverClass : "zoom",
			onDrop : function(obj){
					//alert("Inside on drop");
					trashWords(obj);
					}		
		});

		return true;
	}


		//This is to get whether a given word is singular or plural
	var getPosType = function(obj)
	{
		var elem  = $(obj);
		var posType = "";
		if(elem.length >0)
		{
			var arrayOfClasses = elem.attr('class').split(' ');
			posType = arrayOfClasses[2].split("_")[1];
		}
		return posType;
	}

	var getWordFromId = function(divId)
	{
		
		var tmpWord = $(divId).attr("id");
		//alert(tmpWord);
		if(tmpWord.length > 0)
		{
			tmpWord = tmpWord.split("_")[1].replace(/-/g,' ');
			return tmpWord;
		}
		else
		{
			return "";
		}
	}


	var getCurrWordsList = function(event)
	{

		var tmpNounId = $("#sent-noun-1 li").attr("id");
		var noun1 = "";
		if(tmpNounId.length > 0)
		{
			noun1 = tmpNounId.split("_")[1]; 
		}

		var helpverb = sentWordList["helpverb"];
		var verb = sentWordList["verb"];
		var prep = sentWordList["prep"];
		var noun2 = "";
		var adj = sentWordList["adj"];
		if(sentWordList["noun"].length >  1)
		{
			noun2 = sentWordList["noun"][1];
		}
		return [noun1,helpverb,verb,prep,noun2,adj];

	}

	
	var initReadData = function()
	{	
		console.log("Reached iniRead Data");
		if(gameLevel === 0)
		{
			$("#sent-det-1").removeClass("active");
			$("#sent-adj-1").removeClass("active");
			$("#sent-prep-1").removeClass("active");
			$("#sent-noun-2").removeClass("active");

		}
		
		if (gameLevel === 1)
		{
			console.log()
			$("#sent-prep-1").addClass("active");
			$("#sent-noun-2").addClass("active");
			$("#sent-det-1").removeClass("active");
			$("#sent-adj-1").removeClass("active");


		}
		if (gameLevel === 2)
		{
			console.log("Inside level 2");
			$("#sent-det-1").addClass("active");
			$("#sent-adj-1").addClass("active");
			$("#sent-prep-1").addClass("active");
			$("#sent-noun-2").addClass("active");

			splitNounDet();

		}
		parseData(partsofSpeech);	

	};

	var splitNounDet = function()
	{
		var nounText = $("#sent-noun-1 li").text().split(" ");
		var posClass = "";
		if(nounText.length>1)
		{
			if(jQuery.inArray(nounText[0], currWordList[currDiv]["det"]) == -1)
			{
				currWordList[currDiv]["det"].push(nounText[0].toLowerCase());
				currAllWordList["det"].push(nounText[0].toLowerCase());
			}
			if(jQuery.inArray(nounText[0], sentWordList["det"]) == -1)
			{
				sentWordList["det"].push(nounText[0].toLowerCase());
			}

			if(nounText[0] === 'The')
			{
				posClass = 'det_singularplural det_consonant';
			}	
			else if(nounText[0] === 'A')
			{

				posClass = 'det_singular det_consonant';
			}
			else if(nounText[0] === 'An')
			{
				posClass = 'det_singular det_vowel';
			}
						
		 	var html = '<li class="draggable li-det '+posClass+'" id="det_'+nounText[0].toLowerCase()+'">'+nounText[0]+'</li>';
			$("#sent-det-1").append(html);
			var nounId = $("#sent-noun-1 li").attr("id").split("_")[1];
			var nounClass = $("#sent-noun-1 li").attr("class");
			var nounhtml = '<li class="'+nounClass+'" id="noun_'+nounId+'">'+nounText[1]+'</li>' ;
			
			$('#sent-noun-1').find('li').remove();
			$("#sent-noun-1").append(nounhtml);
			
			//Making the newly added elements draggable
			$("#sent-noun-1").children().each(function(index,value) {
				new webkit_draggable(value.id, {revert : true, scroll : true});
				});

			$("#sent-det-1").children().each(function(index,value) {
				new webkit_draggable(value.id, {revert : true, scroll : true});
			});

		}

		return true;

	}

	var getPOSToDisplay = function(data,level,pos)
	{
		console.log("Reached getPOSToDisplay");
		

		var posClass="";
		var wordText = "";
		var currData = $(divId).children().get();
		$.each(currData, function(i,val) {
			if(jQuery.inArray(val.text(), currAllWordList[pos])==-1)
			{
				currWordList[currDiv][pos].push(val.text());
				currAllWordList[pos].push(val.text());
			}
		});

		var sentData = $("sent-"+pos+"-1 li").children().get();
		$.each(sentData, function(i,val) {
			if(jQuery.inArray(val.text(), currAllWordList[pos])==-1)
			{
				currWordList[currDiv][pos].push(val.text());
				currAllWordList[pos].push(val.text());

			}
		});

		if(pos === 'noun')
		{
			var sentData = $("sent-"+pos+"-2 li").children().get();
			$.each(sentData, function(i,val) {
				if(jQuery.inArray(val.text(), currAllWordList[pos])==-1)
				{
					currWordList[currDiv][pos].push(val.text());
					currAllWordList[pos].push(val.text());
				}
			});
		}

		var divId = "#init-"+pos;
		console.log("VALUE OF CURRDIV:",currDiv);
		console.log("VALUE OF POS:",pos);
		console.log("CURRDIV values:",currWordList[currDiv][pos]);
		///console.log("DATA POS LENGTH IS",data[pos].length);
	if(currDiv > 0 && (pos === 'helpverb' || pos === 'det') )
	{
		console.log("REACHED IF CONDITION");
	}
	else
	{

		while(currWordList[currDiv][pos].length < levelPOSCnt[level][pos] && currAllWordList[pos].length<data[pos].length)
		{
			var posClass="";
			var randIndex  = 1 + Math.floor(Math.random() * data[pos].length-1);
			var word = data[pos][randIndex];
			console.log("WORD POS IS:",pos);
			console.log("WORD SELECTED IS:",word);


			if(jQuery.inArray(word, currAllWordList[pos])==-1)
			{
				wordText = word;
				currWordList[currDiv][pos].push(word);
				currAllWordList[pos].push(word);

				if(pos === 'noun')
				{
					tmpNoun = getNounPrefixSufix(pos,word);
					posClass = tmpNoun[1];
					wordText = tmpNoun[0];
				}
				if(pos === 'det')
				{
					if(wordText === 'the')
					{
						posClass = 'det_singularplural det_consonant';
					}	
					else if(wordText === 'a')
					{

						posClass = 'det_singular det_consonant';
					}
					else if(wordText === 'an')
					{
						posClass = 'det_singular det_vowel';
					}
				}
				if(pos === 'helpverb')
				{

					posClass = "helpverb_"+ helpVerbType[word];
				}	
				if(pos === 'adj')
				{
					if(jQuery.inArray(wordText.substr(0,1),vowels) !== -1)
					{
						posClass = posClass + ' ' + pos + '_vowel';
					}
					else
					{
						posClass = posClass + ' ' + pos + '_consonant';
					}
				}
				var htmlLi = '<li class="draggable li-'+pos+' '+posClass.trim()+'" id="'+pos+'_'+word.replace(/\s/g,"_")+'">'+ wordText+'</li>';
				
				$(".words-list-" + currDiv +" "+divId).append(htmlLi);						
			}

				
		}

	}

		if(pos === "verb" && currWordList[currDiv][pos].length === levelPOSCnt[level][pos])
		{
			getPrepToDisplay(pos,divId,gameLevel);
		}
	}

	var getNounPrefixSufix = function(pos,word)
	{
	
		var randIndex  = Math.floor(Math.random() * 2);
		var prefixDet = partsofSpeech["det"][randIndex];
		var currDet = $("#sent-det-1 li").text();
		var suffix = nounSuffix[prefixDet];
		var tmpIndex = currWordList[currDiv][pos].length;
		var type = "";  // can be singular or plural

		if(jQuery.inArray(word,pluralWords) !== -1)
		{
			suffix = "";
		}		
		//alert(currDet);
		if(nounSuffix[prefixDet])
		{
			posClass = pos+'_plural';
			type = "plural";
		}
		else
		{
			posClass = pos+'_singular';
			type = "singular";
		}

		if(gameLevel > 1 && tmpIndex%2 == 0)
		{
			word = word + suffix;
			posClass = posClass+ ' noun_pos1';
			posClass = posClass+ ' noun_pos1_'+type;

		}
		else
		{
			word = prefixDet + " " + word + suffix;
			posClass = posClass+ ' noun_pos2';
			posClass = posClass+ ' noun_pos2_'+type;
		}
		return [word,posClass];
	}

	var getPrepToDisplay = function(pos,divId,level)
	{
		var tmpPrep = [];
		if(pos === 'verb')
		{
			var currData = $(divId).children().get();
			//Need to out a fix here to pick children of verbs also
			var counter = 0;
			$.each(currWordList[currDiv]["verb"], function(i,val) {

				prepositions = Object.keys(fullJsonData.verb[val].preposition);

				if(currWordList[currDiv]["prep"].length < levelPOSCnt[level]["prep"])
				{
					var randIndex  = 1 + Math.floor(Math.random() * prepositions.length-1);
					var word = prepositions[randIndex];
					console.log("The preposition is:",word);
					if(jQuery.inArray(word, currAllWordList["prep"])==-1)
					{
						currWordList[currDiv]["prep"].push(word);
						currAllWordList["prep"].push(word);

						var htmlLi = '<li class="draggable li-prep prep_'+val+'" id="prep_'+word.replace(/\s/g,"-")+'">'+ word + '</li>' ;

						$(".words-list-" + currDiv +" "+"#init-prep").append(htmlLi);	
					}
					else
					{
						console.log("Inside prep add class");

						$("#prep_"+word.replace(" ","_")).addClass("prep_"+val);
					}
				}
			});	
		}
		prepVerbMapping();

	}

	var prepVerbMapping = function()
	{
		currAllWordList
		$.each(currAllWordList["prep"], function(i,prepVal)
		{
			$.each(currAllWordList["verb"], function(i,verbVal)
			{
				prepositions = Object.keys(fullJsonData.verb[verbVal].preposition);

				if(jQuery.inArray(prepVal, prepositions) != -1)
				{
					var tmp = prepVal.replace(/\s/g,"-")
					$("#prep_"+tmp).addClass("prep_"+verbVal);
				}

			});
		});
		return true;
		
	}

	var parseData = function(d){
	
		console.log("Reached parse data");
		getPOSToDisplay(d,gameLevel,"det");
		getPOSToDisplay(d,gameLevel,"noun");
		getPOSToDisplay(d,gameLevel,"helpverb");
		getPOSToDisplay(d,gameLevel,"verb");
		getPOSToDisplay(d,gameLevel,"adj");

		console.log(currAllWordList);
		console.log(currWordList);

		makeDragabble();

	};

	var populateOnDrop = function(obj,type,form){
		//elem caching change this else where var elem = $(obj);
		// Also try chaging the name of obj to something 
		var elem = $(obj);
		var listItem = elem.text();
		var wordId = elem.attr("id").split("_")[1]
		var divid = "#sent-"+type.toString()+"-"+form.toString();
		var word = "";

		
		/* Code to remove the existing word from sentence area */
		currId = $(divid+' li').attr("id");

		if(currId)
		{
			word = currId.split("_")[1];
			currWordList[currDiv][type.toString()].remove(word);
			currAllWordList[type.toString()].remove(word);
			sentWordList[type.toString()].remove(word);
			$(divid).find('li').remove();

			// When verb is replaced the assoiciated preposition should get removed
			if(type === 'verb'  &&  sentWordList["prep"].length >0)
			{
				var prep = sentWordList["prep"];
				var prepElem = $("#prep_"+prep);
				sentWordList["prep"].remove(prep);
				$("#sent-prep-1").remove("#prep_"+prep);
				$("#init-prep").append(prepElem);
			}
		}



		if(jQuery.inArray(wordId, currWordList[currDiv][type.toString()])==-1)
		{
		 	currWordList[currDiv][type.toString()].push(wordId);
		 	
		}

		if(jQuery.inArray(wordId, currAllWordList[type.toString()])==-1)
		{
		 
		 	currAllWordList[type.toString()].push(wordId);
		}

		if(jQuery.inArray(wordId, sentWordList[type.toString()])==-1)
		{
		 	sentWordList[type.toString()].push(wordId);
		}

		elem.remove();
		console.log("DIVID IS",divid);
		if(divid === '#sent-noun-1' && gameLevel<2)
		{
			listItem = listItem.substring(0,1).toUpperCase()+listItem.substring(1,listItem.length);
			console.log("The noun is:",listItem);
		}
		var html = '<li class="'+elem.attr("class")+'" id="'+type.toString()+'_'+ wordId+'">'+ listItem + '</li>';
		$(divid).append(html);

		//alert(divid);
		//Making the dropped tile draggable for the trash can
		$(divid).children().each(function(index,value) {
			new webkit_draggable(value.id, {revert : true, scroll : true});
		});

		if(gameLevel <=1)
		{
			sentenceRulesLevel1();
		}

		if(gameLevel === 2)
		{
			sentenceRulesLevel2();
		}

		return true;
	}

	var makeDragabble = function(){

		$('.words-list-'+currDiv+' #init-noun').children().each(function(index,value) {
			new webkit_draggable(value.id, {revert : true, scroll : true});
		});
		$('.words-list-'+currDiv+' #init-helpverb').children().each(function(index,value) {
			new webkit_draggable(value.id, {revert : true, scroll : true});
		});

		$('.words-list-'+currDiv+' #init-verb').children().each(function(index,value) {
			new webkit_draggable(value.id, {revert : true, scroll : true});
		});

		$('.words-list-'+currDiv+' #init-prep').children().each(function(index,value) {
			new webkit_draggable(value.id, {revert : true, scroll : true});
		});

		$('.words-list-'+currDiv+' #init-det').children().each(function(index,value) {
			new webkit_draggable(value.id, {revert : true, scroll : true});
		});

		$('.words-list-'+currDiv+' #init-adj').children().each(function(index,value) {
			new webkit_draggable(value.id, {revert : true, scroll : true});
		});

		//Initial set up making all words droppable on trash and then assigning droppable rules
		if(makeDroppableTrash())
		{
			makeDroppableRules();
		}
			
		
	};


	var makeDroppableRules = function()
	{


		makeDroppable('sent-det-1','li-det','det','1');
		makeDroppable('sent-verb-1','li-verb','verb','1');


		if(gameLevel <=1)
		{
			makeDroppable('sent-noun-2','noun_pos2','noun','2');
			makeDroppable('sent-noun-1','noun_pos2','noun','1');
			sentenceRulesLevel1();
		}

		if(gameLevel ===2 )
		{
			makeDroppable('sent-noun-2','noun_pos2','noun','2');
			makeDroppable('sent-noun-1','noun_pos1','noun','1');
			sentenceRulesLevel2();
		}

	}


	var dropNounRule = function(obj,posCnt)
	{
		nounType = getPosType($(obj));

		draw_image(nounType);

		if (posCnt == 1)
		{
			
			webkit_drop.add('sent-helpverb-1', 
			{	accept : ["helpverb_"+nounType], 
				hoverClass : "zoom",
				onDrop : function(subObj){
						if(populateOnDrop($(subObj),'helpverb','1'))
						{
							draw_image("none");
						}
				}
				
			});
		}

	}

	var dropVerbRule = function(obj)
	{
		var prepClass = $(obj).text()
		prepClass = "prep_"+prepClass;
		draw_image("none");
		webkit_drop.add('sent-prep-1', 
		{	
			accept : [prepClass], 
			hoverClass : "zoom",
			onDrop : function(subObj){
				if(populateOnDrop($(subObj),'prep','1'))
				{
					draw_image("none");
				}
			}
			
		});
	}

	var dropDetRule = function()
	{
		if(sentWordList["det"][0] == 'an')
		{
			webkit_drop.add('sent-adj-1', 
			{	
				accept : ["adj_vowel"], 
				hoverClass : "zoom",
				onDrop : function(subObj){
					if(populateOnDrop($(subObj),'adj','1'))
					{
						draw_image("none");
					}
				}
				
			});
		}

		if(sentWordList["det"][0] == 'a')
		{
			webkit_drop.add('sent-adj-1', 
			{		
				accept : ["adj_consonant"], 
				hoverClass : "zoom",
				onDrop : function(subObj){
					if(populateOnDrop($(subObj),'adj','1'))
					{
						draw_image("none");
					}
				}
				
			});
		}

		if(sentWordList["det"][0] == 'the')
		{
			webkit_drop.add('sent-adj-1', 
			{	
				
				accept : ["li-adj"], 
				hoverClass : "zoom",
				onDrop : function(subObj){
					if(populateOnDrop($(subObj),'adj','1'))
					{
						draw_image("none");
					}
				}
				
			});
		}
	}

	var dropAdjRule = function()
	{
		draw_image("none");
	}




	var makeDroppable = function(containerId, acceptClass, pos, posCnt)
	{
		var nounType = "";
		webkit_drop.add(containerId, 
		{	accept : [acceptClass], 
			hoverClass : "zoom",
			onDrop : function(obj){
					if(populateOnDrop($(obj),pos,posCnt))
					{
					
						if(pos === 'noun')
						{
							dropNounRule(obj,posCnt);
						}
						else if(pos === 'verb')
						{
							dropVerbRule(obj);
						}
						else if (pos === 'det')
						{
							dropDetRule(obj);
						}
						else if(pos === 'adj')
						{
							dropAdjRule(obj);
						}
					}
			}
			
		});

		return true;

	}




	var draw_image = function(nounPos)
	{
		
		var finalJson = [];
		var noun1 = "";
		var tmpNounId = $("#sent-noun-1 li").attr("id");
		if(typeof tmpNounId != 'undefined')
		{
			noun1 = tmpNounId.split("_")[1]; 
		}

		var noun = sentWordList["noun"];
		var verb = sentWordList["verb"];
		var helpverb = sentWordList["helpverb"];
		var prep = sentWordList["prep"];
		var adj = sentWordList["adj"];


		if(noun1.length > 0 && noun.length<2)
		{
			/*
			getJson method creates the actual Json. Following values
			are passed to determine the json structure
			1. Only noun 1 available
			2. noun1 and verb are available
			3. noun1, verb, prep,noun2 are available
			4. noun1, verb, noun2 and adj are available
			*/
			if (verb.length>0 && helpverb.length>0)
			{
				getJson(2,nounPos);
			}
			else
			{
				getJson(1,nounPos);
			}
		}


		if(noun.length>1 && helpverb.length > 0 && verb.length>0 && prep.length>0 && gameLevel>=1)
		{

			if (adj.length>0)
			{
				getJson(4,nounPos);
			}
			else
			{
				getJson(3,nounPos);
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

	var defaultJson = function(nounPos)
	{
		var defJson = {"body":{},"pos":{},"animation":[]};	
		var prefixUrl = "res/img/animals/";
		var plane = "";
		var noun = "";
		var posOffset = [0,0];
		if(nounPos === 0)
		{
			noun = $("#sent-noun-1 li").attr("id").split("_")[1];//getWordFromId("#sent-noun-1 li");
		}
		else
		{
			noun = $("#sent-noun-2 li").attr("id").split("_")[1];//getWordFromId("#sent-noun-2 li");
		}
		
		var body_url = fullJsonData["noun"][noun]["svg"]["src"];
		var body_dim = fullJsonData["noun"][noun]["svg"]["dimension"];
		var canvas_pos = fullJsonData["noun"][noun]["canvaspos"];

		var plane_pos = canvas_pos["defaultX"] + "_" + canvas_pos["defaultY"];
		defJson["body"]["eyes"] = prefixUrl+noun+"/"+formUrl(noun,"eyes",body_url["eyes"]);
		defJson["body"]["skin"] = prefixUrl+noun+"/"+formUrl(noun,"skin",body_url["skin"]);
		defJson["body"]["mouth"] = prefixUrl+noun+"/"+formUrl(noun,"mouth",body_url["mouth"]);
		defJson["body"]["color"] = "";
		defJson["body"]["size"] = "normal";
		defJson["body"]["width"] = body_dim["width"];
		defJson["body"]["height"] = body_dim["height"];
		plane = canvas_pos["plane"];
		defJson["pos"] = { "plane":plane,
								"plane_pos": plane_pos,
								"plane_matrix":posOffset};

		return defJson;

	}	

	var formUrl = function(posName,part,partURL)
	{
		return posName+'_'+'part_'+part+'_'+partURL+'.svg';
	}

	var getJson = function(status,nounType)
	{
		
		var prefixUrl = "res/img/animals/";
		var noun1Type = "";
		var noun = ""

		var defJson = defaultJson(0);
	
		var tmpNoun1Id = $("#sent-noun-1 li").attr("id");
		if(typeof tmpNoun1Id != 'undefined')
		{
			noun = tmpNoun1Id.split("_")[1]; 
			noun1Type = getPosType($("#sent-noun-1 li"));
		}

		var tmpNoun2Id = $("#sent-noun-2 li").attr("id");

		if(typeof tmpNoun2Id != 'undefined')
		{
			noun2 = tmpNoun2Id.split("_")[1]; 
			noun2Type = getPosType($("#sent-noun-2 li"));
		}

		var verb = sentWordList["verb"];
		var adj = sentWordList["adj"];
	

		var noun2Json = {};
		var finalJson = [];
		var body_url = "";
		
		
		var noun2Type = "";

		if(sentWordList["noun"] .length>1)
		{
			noun2Type = getPosType($("#sent-noun-2 li"));
		}
		

		if(status >= 2)
		{
			
			body_url = fullJsonData["verb"][verb]["bodypart"];
			defJson["body"]["eyes"] = prefixUrl+noun+"/"+formUrl(noun,"eyes",body_url["eyes"]);
			defJson["body"]["skin"] = prefixUrl+noun+"/"+formUrl(noun,"skin",body_url["skin"]);
			defJson["body"]["mouth"] = prefixUrl+noun+"/"+formUrl(noun,"mouth",body_url["mouth"]);
			animation = fullJsonData["verb"][verb]["animation"];
			defJson["animation"] = animation;
		}
		if(status >= 3)
		{
			
			noun2Json = defaultJson(1);
			
			var preposition = fullJsonData["verb"][verb]["preposition"][sentWordList["prep"][0].replace(/-/g,' ')];
			plane_matrixX = preposition["position_change"]["positionX"];
			plane_matrixY = preposition["position_change"]["positionY"];
			console.log("PLANE MATRIX VALUES ARE:",plane_matrixX,plane_matrixY);
			if(plane_matrixX === 999 && plane_matrixY === 999 )
			{
				
				defJson["pos"]["plane_pos"] = preposition["grid"]["grid_obj1"];
				noun2Json["pos"]["plane_pos"] = preposition["grid"]["grid_obj2"];
				defJson["pos"]["plane_matrix"] = [0,0];
				//defJson["pos"]["plane_pos"] = "right_"+noun1_pos;
				
			}
			else
			{
				defJson["pos"]["plane_matrix"] = [plane_matrixX,plane_matrixY];
				noun2Json["pos"]["plane_pos"] = defJson["pos"]["plane_pos"];
			}

			
			//noun2Json["pos"]["plane_matrix"] = defJson["pos"]["plane_matrix"];//[plane_matrixX,plane_matrixY];

			if(preposition["multi_nouns"])
			{
				noun2Json["animation"] = defJson["animation"];

				noun2Json["body"]["eyes"] = prefixUrl+noun2+"/"+formUrl(noun2,"eyes",body_url["eyes"]);
				noun2Json["body"]["skin"] = prefixUrl+noun2+"/"+formUrl(noun2,"skin",body_url["skin"]);
				noun2Json["body"]["mouth"] = prefixUrl+noun2+"/"+formUrl(noun2,"mouth",body_url["mouth"]);
			}
		}
		if(status >=4 )
		{
			var adjProp = fullJsonData["adj"][adj]["svg"]["properties"];
			defJson["body"]["color"] = adjProp["color"];
			defJson["body"]["size"] = adjProp["size"];
			defJson["body"]["eyes"] = prefixUrl+noun+"/"+formUrl(noun,"eyes",getBodyParts(verb,adj,"eyes"));
			defJson["body"]["skin"] = prefixUrl+noun+"/"+formUrl(noun,"skin",getBodyParts(verb,adj,"skin"));
			defJson["body"]["mouth"] = prefixUrl+noun+"/"+formUrl(noun,"mouth",getBodyParts(verb,adj,"mouth"));

		}

		finalJson.push(defJson);

		if(noun1Type === 'plural')
		{
			var newDefJson = defaultJson(0);
			newDefJson["body"] = defJson["body"];
			newDefJson["animation"] = defJson["animation"];
			newDefJson["pos"]["plane_pos"] = defJson["pos"]["plane_pos"]
			var plane_matrix_x = defJson["pos"]["plane_matrix"][0] + 1;
			var plane_matrix_y = defJson["pos"]["plane_matrix"][1];

			newDefJson["pos"]["plane_matrix"] = [plane_matrix_x,plane_matrix_y];
			finalJson.push(newDefJson);
		}

		if(!jQuery.isEmptyObject(noun2Json))
		{
			finalJson.push(noun2Json);
		}
		if(noun2Type === 'plural')
		{

			var newNoun2Json = defaultJson(1);
			newNoun2Json["body"] = noun2Json["body"];
			newNoun2Json["animation"] = noun2Json["animation"];
			newNoun2Json["pos"]["plane_pos"] = noun2Json["pos"]["plane_pos"]
			//newNoun2Json["pos"]["plane_pos"] = "right_middle";

			newNoun2Json["pos"]["plane_matrix"] = [1,0];

			finalJson.push(newNoun2Json);

		}

		console.log("THE FINAL JSON");
		console.log(JSON.stringify(finalJson));

		WORDCRAFT.handleSentChanges(finalJson);
		return true;	

	};

	var getBodyParts = function(verb,adj,part)
	{

		var verbBodyPart = fullJsonData["verb"][verb]["bodypart"][part];
		var adjBodyPart = fullJsonData["adj"][adj]["svg"]["src"][part];

		if(part === 'skin')
		{
			if(adjBodyPart === 'positive')
			{
				return verbBodyPart;
			}
			else
			{
				return adjBodyPart;
			}
		}
		else
		{
			if(adjBodyPart === 'happy')
			{
				return verbBodyPart;
			}
			else
			{
				return adjBodyPart;
			}
		}



	}

	var levelChange = function(){
		initReadData();
		//var overlay = jQuery('<div id="overlay"><p style="float:left">Level Complete!!!</p><div id="overlay-del"><b>X</b></div> </div>');
		//overlay.appendTo(document.body);
	
	}

	var sentenceRulesLevel1 = function()
	{
		
		var helpverb = sentWordList["helpverb"];
		var posType = ""
		if(helpverb.length > 0)
		{
			posType = getPosType($("#sent-helpverb-1 li"));
			makeDroppable('sent-noun-1','noun_pos2_'+posType,'noun','1');
		}
		else
		{
			makeDroppable('sent-noun-1','noun_pos2','noun','1');
		}
		return true;
	}

	var sentenceRulesLevel2 = function()
	{

		var posType = "";
		var tmpNounId = "";
		var det = sentWordList["det"];
		var noun = sentWordList["noun"];
		tmpNounId = $("#sent-noun-1 li").attr("id");
		var noun1 = "";
		if(typeof tmpNounId != 'undefined')
		{
			noun1 = tmpNounId.split("_")[1]; 
		}
		var noun2 = "";
		if(noun.length > 1)
		{
			noun2 = $("#sent-noun-2 li").attr("id").split("_")[1]; 
		}
		var helpverb = sentWordList["helpverb"];
		var verb = sentWordList["verb"];
		var prep = sentWordList["prep"];
		var adj = sentWordList["adj"];

		if(helpverb.length > 0)
		{
			//console.log("1.helpverb pos");
			posType = getPosType($("#sent-helpverb-1 li"));
			switch(posType)
			{
				case 'plural':
					makeDroppable('sent-det-1','det_singularplural','det','1');
					makeDroppable('sent-noun-1','noun_pos1_plural','noun','1');
					break;
				default:
					makeDroppable('sent-noun-1','noun_pos1_singular','noun','1');

					if(adj.length > 0)
					{
						//console.log("1a.helpverb pos");
						//console.log($("#sent-adj-1 li").hasClass('adj_vowel'));
						if($("#sent-adj-1 li").hasClass('adj_vowel'))
						{
							//alert("4.Inside vowel class");
							makeDroppable('sent-det-1','det_vowel,det_singularplural','det','1');
						}
						else
						{
							makeDroppable('sent-det-1','det_consonant','det','1');
						}
					}
			}
			if(det.length > 0)
			{
				

				if(det == 'an')
				{
					makeDroppable('sent-adj-1','adj_vowel','adj','1');
				}
				else if (det == 'the')
				{
					makeDroppable('sent-adj-1','li-adj','adj','1');
				}
				else if(det == 'a')
				{
					makeDroppable('sent-adj-1','adj_consonant','adj','1');
				}
			}
			else
			{	
				makeDroppable('sent-adj-1','li-adj','adj','1');
			}


		}
		else 
		{
			if(det.length > 0)
			{
				//console.log("2.det pos");
				posType = getPosType($("#sent-det-1 li"));

				if(det == 'an')
				{

					makeDroppable('sent-adj-1','adj_vowel','adj','1');
				}
				else if (det == 'the')
				{
					makeDroppable('sent-adj-1','li-adj','adj','1');
				}
				else if(det == 'a')
				{
					makeDroppable('sent-adj-1','adj_consonant','adj','1');
				}
				switch (posType)
				{
					case 'singular':
						makeDroppable('sent-noun-1','noun_pos1_singular','noun','1');
						makeDroppable('sent-helpverb-1','helpverb_singular','helpverb','1');

						break;
					default:
						if(noun1.length>0)
						{
							console.log("3.noun pos");
							posType = getPosType($("#sent-noun-1 li"));
							makeDroppable('sent-helpverb-1','helpverb_'+posType,'helpverb','1');
							if(posType == 'plural')
							{
								makeDroppable('sent-det-1','det_vowel,det_singularplural','det','1');
							}
							else
							{
								console.log("4..noun pos");
								if($("#sent-adj-1 li").hasClass('adj_vowel'))
								{
									//alert("4.Inside vowel class");
									makeDroppable('sent-det-1','det_vowel,det_singularplural','det','1');
								}
								else
								{
									makeDroppable('sent-det-1','det_consonant','det','1');
								}
							}
						}
						else
						{
							makeDroppable('sent-noun-1','noun_pos1','noun','1');
							//makeDroppable('sent-helpverb-1','li-helpverb','helpverb','1');
							if(adj.length > 0)
							{

								if($("#sent-adj-1 li").hasClass('adj_vowel'))
								{
									//alert("4.Inside vowel class");
									makeDroppable('sent-det-1','det_vowel,det_singularplural','det','1');
								}
								else
								{
									makeDroppable('sent-det-1','det_consonant','det','1');
								}
							}
						}
				}
			}
			else
			{	
				makeDroppable('sent-noun-1','noun_pos1','noun','1');
				if(adj.length > 0)
				{

					console.log("5.noun pos");
					if($("#sent-adj-1 li").hasClass('adj_vowel'))
					{
						//console.log("6.noun pos");
						makeDroppable('sent-det-1','det_vowel,det_singularplural','det','1');
					}
					else
					{
						//console.log("7.noun pos");
						makeDroppable('sent-det-1','det_consonant','det','1');
					}
				}
							
			}

		}
		return true;

	}

	return {
		'init' : init,
		'gameLevel' : gameLevel	

	};

})();
