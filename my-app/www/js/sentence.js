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


		$("#btn_add_words").bind("taphold",function() {
			initReadData();
		});

		$("#btn_check_sent").bind("taphold",function() {
			gameLevel++;
			initReadData();
		});


		$(document).on("taphold",".circled-cross", function(){
			var nounType = "";
			var word = $(this).parent().attr("id");	
			var parentClass = "";
			var objClass = $(this).parent().attr("class").split(" ");			
			var pos = objClass[1].substr(3,objClass[1].length);
			word =  word.split("_")[1];
			//if(pos === 'noun' || pos == 'helverb')
			//{
			if(pos === 'noun' || pos === 'helpverb' || pos === 'det')
			{
			 	nounType = objClass[2];
			 	//Check this out, this has to be changed
				//parentClass = $(this).parent().parent().parent().parent().attr("class");
			}
			if(pos === 'verb' && gameLevel>0 &&  sentWordList["prep"].length >0)
			{
				var prep = $(".prep_"+word).attr("id").split("_")[1];
				currWordList["prep"].remove(prep);
				sentWordList["prep"].remove(prep);
				$(".prep_"+word).remove();

			}
			currWordList[pos].remove(word);
			sentWordList[pos].remove(word);
			$(this).parent().remove();

			makeDroppableOnCancel(pos,nounType,word,parentClass);
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
			 	html += '<span class="icon-entypo circled-cross" style="cursor: pointer;"></span></li>';
				$("#sent-det-1").append(html);
				var nounId = $("#sent-noun-1 li").attr("id").split("_")[1];
				var nounhtml = '<li class="draggable li-noun" id="noun_'+nounId+'">'+nounText[1] 
				nounhtml += '<span class="icon-entypo circled-cross" style="cursor: pointer;"></span></li>';
				
				$('#sent-noun-1').find('li').remove();
				$("#sent-noun-1").append(nounhtml);

			}

			makeDroppable('sent-noun-2','noun_level2','noun','2');
			makeDroppable('sent-noun-1','noun_level1','noun','1');


			//makeDroppable('sent-noun-1','li-noun-lvl3','noun','1');
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
						posClass = tmpNoun[1];
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
						posClass = "helpverb_"+helpVerbType[word];
					}	
					if(jQuery.inArray(wordText.substr(0,1),vowels) !== -1)
					{
						posClass = posClass+' '+pos+'_vowel';
					}
					else
					{
						posClass = posClass+' '+pos+'_consonant';
					}
					var htmlLi = '<li class="draggable li-'+pos+' '+posClass+'" id="'+pos+'_'+word.replace(" ","_")+'">'+ wordText;
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

		if(jQuery.inArray(word,pluralWords) !== -1)
		{
			suffix = "";
		}		
		//alert(currDet);
		if(nounSuffix[prefixDet])
		{
			posClass = pos+'_plural';
		}
		else
		{
			posClass = pos+'_singular';
		}

		if(gameLevel > 1 && tmpIndex%2 == 0)
		{

			word = word + suffix;
			posClass = posClass+ ' noun_level1';

		}
		else
		{
			word = prefixDet + " " + word + suffix;
			posClass = posClass+ ' noun_level2';
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
						var htmlLi = '<li class="draggable li-prep prep_'+val+'" id="prep_'+word.replace(" ","_")+'">'+ word + '<span class="icon-entypo circled-cross" style="cursor: pointer;"></span></li>' ;
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

	};

	var populateOnDrop = function(obj,type,form){
		var listItem = $(obj).text();
		var wordId = $(obj).attr("id").split("_")[1]
		//alert($(obj).attr("class"));
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
		var html = '<li class="'+$(obj).attr("class")+'" id="'+type.toString()+'_'+ wordId+'">'+ listItem + '<span class="icon-entypo circled-cross" style="cursor: pointer;"></span></li>';
		//alert(html);
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


		makeDroppable('sent-noun-1','li-noun','noun','1');
		makeDroppable('sent-det-1','li-det','det','1');
		$("#init-det li" ).each(function() {
				console.log("I am here in the loop");
				if($( this ).attr("id") === "det_The")
				{
			  		$( this ).addClass( "det_singular" );
			  	}
			});
		makeDroppable('sent-verb-1','li-verb','verb','1');
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
		
		if(gameLevel <= 1)
		{
			makeDroppable('sent-noun-2','li-noun','noun','2');
		}
		else
		{
			makeDroppable('sent-noun-1','noun_level1','noun','1');
		}

	};

	/* Needs to be populated work in progress*/
	var makeDroppableOnCancel = function(pos, nounType, word, parentClass)
	{
		var nounType= "";
		var acceptableClass = "";

		if(pos === 'noun' && sentWordList["helpverb"][0].length > 0)
		{
			acceptableClass = 'noun_'+ helpVerbType[sentWordList["helpverb"][0]];
			makeDroppable('sent-noun-1',acceptableClass,'noun','1');
		}
		if(pos === 'helpverb')
		{
			makeDroppable('sent-noun-1','li-noun','noun','1');
			makeDroppable('sent-det-1','li-det','det','1');

		}
		if(pos === 'det')
		{
			var arrayClasses = $("#sent-helpverb-1 li").attr("class").split(" ");
			if(arrayClasses.length > 0)
			{
				acceptableClass = "det_"+arrayClasses[2].split("_")[1];
				makeDroppable('sent-det-1',acceptableClass,'det','1');
			}
		}
		return true;
	}


	var makeDroppable = function(containerId, acceptClass, pos, posCnt)
	{
		var nounType = "";
		webkit_drop.add(containerId, 
		{	accept : [acceptClass], 
			onDrop : function(obj){
					if(populateOnDrop($(obj),pos,posCnt))
					{
						if(pos === 'noun')
						{
							nounType = getNounType($(obj));
							draw_image(nounType);
							webkit_drop.add('sent-helpverb-1', 
							{	accept : ["helpverb_"+nounType], 
								onDrop : function(subObj){
										populateOnDrop($(subObj),'helpverb','1');
								}
								
							});
						}
						else if(pos === 'verb')
						{
							var prepClass = $(obj).text()
							prepClass = "prep_"+prepClass;
							draw_image("none");
							webkit_drop.add('sent-prep-1', 
							{	
								accept : [prepClass], 
								onDrop : function(subObj){
									populateOnDrop($(subObj),'prep','1');
								}
								
							});
						}
						else if (pos === 'det')
						{
							if(sentWordList["det"][0] === 'An')
							{
								webkit_drop.add('sent-adj-1', 
								{	
									accept : ["adj_vowel"], 
									onDrop : function(subObj){
										populateOnDrop($(subObj),'adj','1');
									}
									
								});
							}
						}
						else if(pos === 'adj')
						{
							draw_image("none");
						}
					}
			}
			
		});

	}


	var getNounType = function(obj)
	{
		var nounType = "";
		var arrayOfClasses = $(obj).attr('class').split(' ');
		nounType = arrayOfClasses[2].split("_")[1];
		return nounType;
	}



	var draw_image = function(nounPos)
	{
		alert("nountType:"+nounPos);
		var finalJson = [];
		var noun = sentWordList["noun"];
		var verb = sentWordList["verb"];
		var helpverb = sentWordList["helpverb"];
		var prep = sentWordList["prep"];
		var adj = sentWordList["adj"];
		//alert("Inside draw image");

		if(gameLevel===0 && noun[0].length > 0 && noun.length<2)
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
		if(gameLevel>=1 && noun.length>1 && verb.length>0 && prep.length>0)
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
		var prefixUrl = "res/img/animals/";
		var noun = sentWordList["noun"][nounPos];
		alert("the noun is:"+noun);
		var body_url = fullJsonData["noun"][noun]["svg"]["src"];
		var body_dim = fullJsonData["noun"][noun]["svg"]["dimension"];
		var canvas_pos = fullJsonData["noun"][noun]["canvaspos"];
		var plane = canvas_pos["plane"];
		var plane_pos = canvas_pos["defaultX"] + "_" + canvas_pos["defaultY"];
		jsonForImage["body"]["eyes"] = prefixUrl+noun+"/"+formUrl(noun,"eyes",body_url["eyes"]);
		jsonForImage["body"]["skin"] = prefixUrl+noun+"/"+formUrl(noun,"skin",body_url["skin"]);
		jsonForImage["body"]["mouth"] = prefixUrl+noun+"/"+formUrl(noun,"mouth",body_url["mouth"]);
		jsonForImage["body"]["color"] = "";
		jsonForImage["body"]["size"] = "normal";
		jsonForImage["body"]["width"] = body_dim["width"];
		jsonForImage["body"]["height"] = body_dim["height"];
		jsonForImage["pos"] = { "plane":plane,
								"plane_pos": plane_pos,
								"plane_matrix":[0,0] };

		return jsonForImage;

	}	

	var formUrl = function(posName,part,partURL)
	{
		return posName+'_'+'part_'+part+'_'+partURL+'.svg';
	}

	var getJson = function(status,nounType)
	{
		var prefixUrl = "res/img/animals/";
		var defJson = defaultJson(0);
		var noun = sentWordList["noun"][0];
		var verb = sentWordList["verb"];
		var noun2Json = {};
		var finalJson = [];
		var body_url = "";
		finalJson.push(defJson);
		
		if(status == 2)
		{
			alert("Inside status >=2:"+status);
			body_url = fullJsonData["verb"][verb]["bodypart"];
			defJson["body"]["eyes"] = prefixUrl+noun+"/"+formUrl(noun,"eyes",body_url["eyes"]);
			defJson["body"]["skin"] = prefixUrl+noun+"/"+formUrl(noun,"skin",body_url["skin"]);
			defJson["body"]["mouth"] = prefixUrl+noun+"/"+formUrl(noun,"mouth",body_url["mouth"]);
			animation = fullJsonData["verb"][verb]["animation"];
			defJson["animation"] = animation;
		}
		if(status ==3)
		{
			alert("Inside 3:"+status);
			body_url = fullJsonData["verb"][verb]["bodypart"];
			defJson["body"]["eyes"] = prefixUrl+noun+"/"+formUrl(noun,"eyes",body_url["eyes"]);
			defJson["body"]["skin"] = prefixUrl+noun+"/"+formUrl(noun,"skin",body_url["skin"]);
			defJson["body"]["mouth"] = prefixUrl+noun+"/"+formUrl(noun,"mouth",body_url["mouth"]);
			animation = fullJsonData["verb"][verb]["animation"];
			defJson["animation"] = animation;
			noun2Json = defaultJson(1);
			alert("Printing noun2json");
			alert(JSON.stringify(noun2Json));
			prep = fullJsonData["verb"][verb][sentWordList["prep"]]
			plane_matrixX = prep["position_change"]["positionX"];
			plane_matrixY = prep["position_change"]["positionY"];
			defJson["pos"]["plane_matrix"] = [plane_matrixX,plane_matrixY];
		}

		if(nounType === 'plural')
		{
			finalJson.push(defJson);
		}
		if(!jQuery.isEmptyObject(noun2Json))
		{
			alert("Noun2Json");
			finalJson.push(noun2Json);
		}
		alert(JSON.stringify(finalJson));

		WORDCRAFT.handleSentChanges(finalJson);
		return;	

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

