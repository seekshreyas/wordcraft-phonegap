var WORDCRAFT = WORDCRAFT || {}

WORDCRAFT.build = (function(){

	var gameLevel = 0;
	var partsofSpeech = {};
	var fullJsonData = {};
	var pluralSuffix = ["","s"];
	var nounSuffix = {"The":"s","A":"","An":""}
	var vowels=['a','e','i','o','u'];
	var pluralWords = ['sheep'];
	var helpVerbType = {"is":"singular","are":"plural"};
	var currWordList = {"noun":[],"helpverb":[],"verb":[],"prep":[],"adj":[],"det":[]};
	var sentWordList = {"noun":[],"helpverb":[],"verb":[],"prep":[],"adj":[],"det":[]};
	var levelPOSCnt = {0:{"noun":2,"helpverb":2,"verb":3,"prep":0,"adj":0,"adv":0,"det":0},
					   1:{"noun":2,"helpverb":2,"verb":3,"prep":3,"adj":0,"adv":0,"det":0},
					   2:{"noun":4,"helpverb":2,"verb":3,"prep":3,"adj":3,"adv":0,"det":3}};
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
		
		$("#btn_add_words").bind("taphold",function(event) {
			event.stopPropagation();
			initReadData();
		});

		$("#btn_forward").bind("taphold",function(event) {
			event.stopPropagation();
			var currWord = getCurrWordsList(event);
			if( gameLevel === 0 && currWord[0].length>0 && currWord[1].length>0 && currWord[2].length>0)
			{
				gameLevel++;
				initReadData();
			}
			else if (gameLevel === 1 && currWord[0].length>0 && currWord[1].length>0 && currWord[2].length>0 && currWord[3].length > 0 &&  currWord[4].length > 0)
			{
				gameLevel++;
				initReadData();
			}

			
		});

	}

	var trashWords = function(obj)
	{
		//alert("Inside trash words");

		var word = $(obj).attr("id");	
		var parentId = $(obj).parent().attr("id");
		var objClass = $(obj).attr("class").split(" ");			
		var pos = objClass[1].substr(3,objClass[1].length);
		var nounType = "";
		word =  word.split("_")[1];
	
		if(pos === 'noun' || pos === 'helpverb' || pos === 'det')
		{
		 	nounType = objClass[2];
		 	
		}
		if(pos === 'verb'  &&  sentWordList["prep"].length >0)
		{
			var prep = $(".prep_"+word).attr("id").split("_")[1];
			currWordList["prep"].remove(prep);
			sentWordList["prep"].remove(prep);
			$(".prep_"+word).remove();
		}
		currWordList[pos].remove(word);
		sentWordList[pos].remove(word);
		$(obj).remove();

		//Code for level 2
		if(gameLevel === 2)
		{
			sentenceRulesLevel2();
		}
		//makeDroppableOnCancel(pos,word,nounType,parentId,$(this));
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
		var posType = "";

		var arrayOfClasses = $(obj).attr('class').split(' ');
		posType = arrayOfClasses[2].split("_")[1];
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

			var noun1 = sentWordList["noun"][0];
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

			splitNounDet();
			makeDroppable('sent-noun-2','noun_pos2','noun','2');
			makeDroppable('sent-noun-1','noun_pos1','noun','1');

			//makeDroppable('sent-noun-1','li-noun-lvl3','noun','1');
		}
		parseData(partsofSpeech);	

	};

	var splitNounDet = function()
	{
		var nounText = $("#sent-noun-1 li").text().split(" ");
		if(nounText.length>1)
		{
			if(jQuery.inArray(nounText[0], currWordList["det"]) == -1)
			{
				currWordList["det"].push(nounText[0]);
			}
			if(jQuery.inArray(nounText[0], sentWordList["det"]) == -1)
			{
				sentWordList["det"].push(nounText[0]);
			}
							
		 	var html = '<li class="draggable li-det" id="det_'+nounText[0]+'">'+nounText[0];
		 	html += '<span class="icon-entypo circled-cross" style="cursor: pointer;"></span></li>';
			$("#sent-det-1").append(html);
			var nounId = $("#sent-noun-1 li").attr("id").split("_")[1];
			var nounClass = $("#sent-noun-1 li").attr("class");
			//alert(nounClass);
			var nounhtml = '<li class="'+nounClass+'" id="noun_'+nounId+'">'+nounText[1] 
			nounhtml += '<span class="icon-entypo circled-cross" style="cursor: pointer;"></span></li>';
			
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
						posClass = tmpNoun[1];
						wordText = tmpNoun[0];
					}
					if(pos === 'det')
					{
						if(wordText === 'The')
						{
							posClass = 'det_singularplural';
						}	
						else if(wordText === 'A')
						{

							posClass = 'det_singular det_consonant';
						}
						else if(wordText === 'An')
						{
							posClass = 'det_singular det_vowel';
						}
					}
					if(pos === 'helpverb')
					{

						posClass = "helpverb_"+ helpVerbType[word];
					}	
					if(jQuery.inArray(wordText.substr(0,1),vowels) !== -1)
					{
						posClass = posClass + ' ' + pos + '_vowel';
					}
					else
					{
						posClass = posClass + ' ' + pos + '_consonant';
					}
					var htmlLi = '<li class="draggable li-'+pos+' '+posClass.trim()+'" id="'+pos+'_'+word.replace(/\s/g,"_")+'">'+ wordText;
					htmlLi = htmlLi + '<span class="icon-entypo circled-cross" style="cursor: pointer;"></span></li>' ;
					$(divId).append(htmlLi);						
				}		
			}
			
		}
		if(currWordList[pos].length === levelPOSCnt[level][pos])
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
		var tmpIndex = currWordList[pos].length;
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
			$.each(currWordList["verb"], function(i,val) {
				prepositions = Object.keys(fullJsonData.verb[val].preposition);
				if(currWordList["prep"].length < levelPOSCnt[level]["prep"])
				{
					var randIndex  = 1 + Math.floor(Math.random() * prepositions.length-1);
					var word = prepositions[randIndex];
					if(jQuery.inArray(word, currWordList["prep"])==-1)
					{
						currWordList["prep"].push(word);
						var htmlLi = '<li class="draggable li-prep prep_'+val+'" id="prep_'+word.replace(/\s/g,"-")+'">'+ word + '<span class="icon-entypo circled-cross" style="cursor: pointer;"></span></li>' ;
						$("#init-prep").append(htmlLi);	
					}
					else
					{
						console.log("Inside prep add class");
						$("#prep_"+word.replace(" ","_")).addClass("prep_"+val);
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

	};

	var populateOnDrop = function(obj,type,form){
		var listItem = $(obj).text();
		var wordId = $(obj).attr("id").split("_")[1]
		var divid = "#sent-"+type.toString()+"-"+form.toString();

		$(obj).remove();
		/* Code to remove the existing word from sentence area */
		currId = $(divid+' li').attr("id");

		if(currId)
		{
			word = currId.split("_")[1];
			currWordList[type.toString()].remove(word);
			sentWordList[type.toString()].remove(word);
			$(divid).find('li').remove();
			if(gameLevel === 2)
			{
				sentenceRulesLevel2();
			}
		}

		if(jQuery.inArray(wordId, currWordList[type.toString()])==-1)
		{
		 	currWordList[type.toString()].push(wordId);
		}
		if(jQuery.inArray(wordId, sentWordList[type.toString()])==-1)
		{
		 	sentWordList[type.toString()].push(wordId);
		}
		var html = '<li class="'+$(obj).attr("class")+'" id="'+type.toString()+'_'+ wordId+'">'+ listItem + '<span class="icon-entypo circled-cross" style="cursor: pointer;"></span></li>';
		$(divid).append(html);

		//alert(divid);
		//Making the dropped tile draggable for the trash can
		$(divid).children().each(function(index,value) {
			new webkit_draggable(value.id, {revert : true, scroll : true});
		});

		if(gameLevel === 2)
		{
			sentenceRulesLevel2();
		}

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

		makeDroppable('sent-noun-1','li-noun','noun','1');
		makeDroppable('sent-noun-2','li-noun','noun','2');


		if(gameLevel ===2 )
		{
			makeDroppable('sent-noun-1','noun_pos1','noun','1');
			makeDroppable('sent-noun-2','noun_pos2','noun','2');

			if(sentWordList["det"][0] === 'An')
			{
				makeDroppable('sent-adj-1','adj_vowel','adj','1');
			}
			else if(sentWordList["det"][0] === 'A')
			{
				makeDroppable('sent-adj-1','adj_consonant','adj','1');
			}
			else
			{
				makeDroppable('sent-adj-1','li-adj','adj','1');
			}

			sentenceRulesLevel2();
		}

	}


	var dropNounRule = function(obj)
	{
		nounType = getPosType($(obj));
		//alert(nounType);

		draw_image(nounType);
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
		if(sentWordList["det"][0] === 'An')
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

		if(sentWordList["det"][0] === 'A')
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

		if(sentWordList["det"][0] === 'The')
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
							dropNounRule(obj);
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
		var noun = sentWordList["noun"];
		//alert(noun.length);
		var verb = sentWordList["verb"];
		var helpverb = sentWordList["helpverb"];
		var prep = sentWordList["prep"];
		var adj = sentWordList["adj"];
		//alert("Inside draw_image");
		//alert(JSON.stringify(sentWordList));
		//alert(noun.length);
		//alert(gameLevel);


		//alert("Inside draw image");

		if(noun[0].length > 0 && noun.length<2 && gameLevel <1)
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

		if(noun.length>1 && verb.length>0 && prep.length>0 && gameLevel>=1)
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
		if(nounPos === 0)
		{
			noun = $("#sent-noun-1 li").attr("id").split("_")[1];//getWordFromId("#sent-noun-1 li");
		}
		else
		{
			noun = $("#sent-noun-2 li").attr("id").split("_")[1];//getWordFromId("#sent-noun-2 li");
		}
		//alert("the noun is:"+noun);
		var body_url = fullJsonData["noun"][noun]["svg"]["src"];
		var body_dim = fullJsonData["noun"][noun]["svg"]["dimension"];
		var canvas_pos = fullJsonData["noun"][noun]["canvaspos"];
		if(nounPos === 0)
		{
			plane = canvas_pos["plane"];	
		}
		else
		{
			plane = "right_middle";
		}
		var plane_pos = canvas_pos["defaultX"] + "_" + canvas_pos["defaultY"];
		defJson["body"]["eyes"] = prefixUrl+noun+"/"+formUrl(noun,"eyes",body_url["eyes"]);
		defJson["body"]["skin"] = prefixUrl+noun+"/"+formUrl(noun,"skin",body_url["skin"]);
		defJson["body"]["mouth"] = prefixUrl+noun+"/"+formUrl(noun,"mouth",body_url["mouth"]);
		defJson["body"]["color"] = "";
		defJson["body"]["size"] = "normal";
		defJson["body"]["width"] = body_dim["width"];
		defJson["body"]["height"] = body_dim["height"];
		defJson["pos"] = { "plane":plane,
								"plane_pos": plane_pos,
								"plane_matrix":[0,0] };

		return defJson;

	}	

	var formUrl = function(posName,part,partURL)
	{
		return posName+'_'+'part_'+part+'_'+partURL+'.svg';
	}

	var getJson = function(status,nounType)
	{
		//alert("Status:"+status);
		//alert("Inside getJson");
		var prefixUrl = "res/img/animals/";

		var defJson = defaultJson(0);
		//alert("Get Json");
		var noun = $("#sent-noun-1 li").attr("id").split("_")[1]; 
		//alert(noun); 
		//The method below is not working. event propagation as to be checked
		//getWordFromId($("sent-noun-1 li"));  //sentWordList["noun"][0];
		var verb = sentWordList["verb"];
		var adj = sentWordList["adj"];
		//alert(adj);
		//alert(sentWordList["prep"]);

		var noun2Json = {};
		var finalJson = [];
		var body_url = "";
		
		var noun1Type = getPosType("#sent-noun-1 li");
		var noun2Type = "";
		if(sentWordList["noun"] .length>1)
		{
			noun2Type = getPosType("#sent-noun-2 li");
		}
		//alert("This is noun1Type"+noun1Type);

		if(status >= 2)
		{
			//alert("Inside status >=2:"+status);
			body_url = fullJsonData["verb"][verb]["bodypart"];
			defJson["body"]["eyes"] = prefixUrl+noun+"/"+formUrl(noun,"eyes",body_url["eyes"]);
			defJson["body"]["skin"] = prefixUrl+noun+"/"+formUrl(noun,"skin",body_url["skin"]);
			defJson["body"]["mouth"] = prefixUrl+noun+"/"+formUrl(noun,"mouth",body_url["mouth"]);
			animation = fullJsonData["verb"][verb]["animation"];
			defJson["animation"] = animation;
		}
		if(status >= 3)
		{
			//alert("Inside 3:"+status);
			noun2Json = defaultJson(1);
			var preposition = fullJsonData["verb"][verb]["preposition"][sentWordList["prep"][0].replace(/-/g,' ')];
			//alert("prep"+ prep);
			plane_matrixX = preposition["position_change"]["positionX"];
			plane_matrixY = preposition["position_change"]["positionY"];
			defJson["pos"]["plane_matrix"] = [plane_matrixX,plane_matrixY];
			if(preposition["multi_nouns"])
			{
				noun2Json["animation"] = defJson["animation"];
			}
			//alert("default inside level 3");
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
			newDefJson["pos"]["plane_pos"] = "right_middle";
			finalJson.push(newDefJson);
		}

		if(!jQuery.isEmptyObject(noun2Json))
		{
			//alert("Noun2Json");
			finalJson.push(noun2Json);
		}
		if(noun2Type === 'plural')
		{
			var newNoun2Json = defaultJson(1);
			newNoun2Json["body"] = noun2Json["body"];
			newNoun2Json["animation"] = noun2Json["animation"];
			newNoun2Json["pos"]["plane_pos"] = "right_middle";
			finalJson.push(newNoun2Json);

		}

		//alert(JSON.stringify(finalJson));

		WORDCRAFT.handleSentChanges(finalJson);
		return;	

	};

	var getBodyParts = function(verb,adj,part)
	{
		//alert("i am doing");
		//alert(verb+adj+part);
		var verbBodyPart = fullJsonData["verb"][verb]["bodypart"][part];
		var adjBodyPart = fullJsonData["adj"][adj]["svg"]["src"][part];
		//alert(verbBodyPart);

		//alert("Inside body parts");
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

	var sentenceRulesLevel2 = function()
	{
		//alert("Inside sentenceRules words");

		var posType = "";
		var det = sentWordList["det"];
		var noun = sentWordList["noun"];
		var noun1 = $("#sent-noun-1 li").attr("id").split("_")[1]; 
		var noun2 = "";
		if(noun.length>1)
		{
			noun2 = $("#sent-noun-2 li").attr("id").split("_")[1]; 
		}
		var helpverb = sentWordList["helpverb"];
		var verb = sentWordList["verb"];
		var prep = sentWordList["prep"];
		var adj = sentWordList["adj"];

		if(det.length > 0)
		{	//alert("Inside det");
			posType = getPosType($("#sent-det-1 li"));
			switch (det)
			{
				case "An":
					makeDroppable('sent-adj-1','adj_vowel','adj','1');
					break;
				default:
					makeDroppable('sent-adj-1','li-adj','adj','1');
			}
			switch (posType)
			{
				case 'singular':
					makeDroppable('sent-noun-1','noun_pos1_singular','noun','1');
					makeDroppable('sent-helpverb-1','helpverb_singular','helpverb','1');
					break;
				default:
					makeDroppable('sent-noun-1','noun_pos1','noun','1');
					makeDroppable('sent-helpverb-1','li-helpverb','helpverb','1');
			}
		}

		if(noun1.length > 0)
		{
			//alert("Inside noun");
			posType = getPosType($("#sent-noun-1 li"));

			switch(posType)
			{
				case 'plural':
					makeDroppable('sent-det-1','det_singularplural','det','1');
					makeDroppable('sent-helpverb-1','helpverb_plural','helpverb','1');
					makeDroppable('sent-helpverb-1','helpverb_plural','helpverb','1');
				default:
					//Check if adj exists or not and differentiate between  A and An
					if(adj.length > 0)
					{
						if(("#sent-adj-1 li").hasClass('adj_vowel'))
						{
							makeDroppable('sent-det-1','det_vowel','det','1');
						}
						else
						{
							makeDroppable('sent-det-1','det_consonant','det','1');
						}
					}
					makeDroppable('sent-helpverb-1','helpverb_singular','helpverb','1');

			}
			
			if(det.length > 0)
			{
				switch (det)
				{
					case "An":
						makeDroppable('sent-adj-1','adj_vowel','adj','1');
						break;
					default:
						makeDroppable('sent-adj-1','li-adj','adj','1');
				}
			}
			else
			{
				makeDroppable('sent-adj-1','li-adj','adj','1');
			}

		}

		if(helpverb.length > 0)
		{
			//alert("Inside helpverb");
			posType = getPosType($("#sent-helverb-1 li"));
			switch(posType)
			{
				case 'plural':
					makeDroppable('sent-det-1','det_singularplural','det','1');
					makeDroppable('sent-noun-1','noun_pos1_plural','noun','1');
					if(det.length > 0)
					{
						switch (det)
						{
							case "An":
								makeDroppable('sent-adj-1','adj_vowel','adj','1');
								break;
							default:
								makeDroppable('sent-adj-1','li-adj','adj','1');
						}
					}
					else
					{
						makeDroppable('sent-adj-1','li-adj','adj','1');
					}
					break;
				default:
					makeDroppable('sent-noun-1','noun_pos1_singular','noun','1');
					if(adj.length > 0)
					{
						if(("#sent-adj-1 li").hasClass('adj_vowel'))
						{
							makeDroppable('sent-det-1','det_vowel','det','1');
						}
						else
						{
							makeDroppable('sent-det-1','det_consonant','det','1');
						}
					}
					else
					{
						makeDroppable('sent-det-1','li-det','det','1');
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

