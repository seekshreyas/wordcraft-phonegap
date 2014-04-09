var WORDCRAFT = WORDCRAFT || {}

WORDCRAFT.build = (function(){

	var gameLevel = 0;
	var partsofSpeech = {};
	var fullJsonData = {};
	var nounSuffix = {"The":"s","A":""}
	var helpVerbType = {"is":"singular","are":"plural"}
	var sentenceItems = {"noun":[],"helpverb":[],"verb":[],"prep":[],"adj":[],"det":["The","A"]};
	var levelPOSCnt = {0:{"noun":2,"helpverb":2,"verb":3,"prep":0,"adj":0,"adv":0,"det":0},
					   1:{"noun":2,"helpverb":2,"verb":3,"prep":3,"adj":0,"adv":0,"det":0},
					   2:{"noun":2,"helpverb":2,"verb":3,"prep":3,"adj":3,"adv":0,"det":1}};

	var init = function(){
		console.log("let the crafting begin!");

		Array.prototype.remove = function(value) {
		  var idx = this.indexOf(value);
		  if (idx != -1) {
		      return this.splice(idx, 1); // The second parameter is the number of elements to remove.
		  }
		  return false;
		}

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
				drawImageData = data;
				initReadData(gameLevel);
			})
			.fail(function() {
			    console.log( "error" );
			});

		
		$("#btn_add_words").bind("tap",function() {
			add_new_words(gameLevel);
		});

		var add_new_words = function(){
			initReadData(gameLevel);
		};

		$(document).on("click","#overlay", function(){
			$(this).parent();
			initReadData(gameLevel);

		});

		$(document).on("click",".droppable-del", function(){
			var elem = $(this).parent().text();
			elem = elem.substr(0, elem.length - 1);
			elemClass = $(this).parent().attr('class');
			elemClass = elemClass.substr(8,elemClass.length);
			//sentenceItems[elemClass].remove(elem);
			$(this).parent().remove();
			$(this).parent().parent().css("background-color", "");
			draw_image();
		});

		$(document).on("click",".del", function(){
			$(this).parent().remove();
		});
		
	};
	
	var initReadData = function(level)
	{
		if (level === 1)
		{
			console.log()
			$("#sent-prep-1").addClass("active");
			$("#sent-noun-2").addClass("active");
		}
		if (level === 2)
		{
			console.log("Inside level 2");
			$("#sent-det-1").addClass("active");
			$("#sent-adj-1").addClass("active");
			$("#sent-prep-1").addClass("active");
			$("#sent-noun-2").addClass("active");

		}

		parseData(partsofSpeech,level);	

	};

	var getPOSToDisplay = function(data,level,pos)
	{
		var posClass="";
		var currData = $(divId).children().get();
		$.each(currData, function(i,val) {
			sentenceItems[pos].push(val.text());
		});
		var divId = "#init-"+pos;
		var currData = $(divId).contents();
		if(sentenceItems[pos].length < levelPOSCnt[level][pos])
		{
			while(sentenceItems[pos].length < levelPOSCnt[level][pos])
			{
				var randIndex  = 1 + Math.floor(Math.random() * data[pos].length-1);
				var word = data[pos][randIndex];
				if(jQuery.inArray(word, sentenceItems[pos])==-1)
				{
					sentenceItems[pos].push(word);
					if(pos === 'noun' )
					{
						tmpNoun = getNounPrefixSufix(pos,word);
						posClass = tmpNoun[1];
						word = tmpNoun[0];
						console.log(tmpNoun);
					}
					if(pos === 'helpverb')
					{
						posClass = "helpverb-"+helpVerbType[word];
					}	
					var htmlLi = '<li class="draggable li-'+pos+' '+posClass+'" id="'+pos+'_'+word.replace(" ","_")+'">'+ word + '<span class="icon-entypo circled-cross" style="cursor: pointer;"></span></li>' ;
					$(divId).append(htmlLi);						
				}		
			}
			if(sentenceItems[pos].length === levelPOSCnt[level][pos])
			{
				getPrepToDisplay(pos,divId,gameLevel);
			}
		}
	}

	var getNounPrefixSufix = function(pos,word)
	{
		var tmpPrefixDet = jQuery.inArray(word, sentenceItems[pos])%2;
		var prefixDet = sentenceItems["det"][tmpPrefixDet];
		word = prefixDet+" "+word + nounSuffix[prefixDet];
		if(nounSuffix[prefixDet])
		{
			posClass = pos+'_plural';
		}
		else
		{
			posClass = pos+'_singular';
		}

		return [word,posClass];
	}

	var getPrepToDisplay = function(pos,divId,level)
	{
		var tmpPrep = [];
		if(pos === 'verb')
		{

			var currPrepData = $("#init-prep").children().get();
			$.each(currPrepData, function(i,val) {
				sentenceItems["prep"].push(val.text());
			});

			var currData = $(divId).children().get();
			var counter = 0;
			$.each(currData, function(i,val) {
				prepositions = Object.keys(fullJsonData.verb[val.innerText].preposition);
				if(sentenceItems["prep"].length < levelPOSCnt[level]["prep"])
				{
					var randIndex  = 1 + Math.floor(Math.random() * prepositions.length-1);
					var word = prepositions[randIndex];
					if(jQuery.inArray(word, sentenceItems["prep"])==-1)
					{
						sentenceItems[pos].push(word);
						var htmlLi = '<li class="draggable li-prep" id="prep_'+word.replace(" ","_")+'">'+ word + '<span class="icon-entypo circled-cross" style="cursor: pointer;"></span></li>' ;
						$("#init-prep").append(htmlLi);	
					}
				}
			});		
		}
	}

	var parseData = function(d,level){
	
		getPOSToDisplay(d,gameLevel,"noun");
		getPOSToDisplay(d,gameLevel,"helpverb");
		getPOSToDisplay(d,gameLevel,"verb");
		getPOSToDisplay(d,gameLevel,"adj");

		makeDragabble();

	};

	var populateOnDrop = function(obj,type,form){
			var value = $(obj).text();
			//if(($("#sent-"+type.toString()+"-"+form.toString()).html().length) == 21)
			//{
				var listItem = value.substr(0, value.length - 1);
				var color = $(obj).css("background-color");
				$(obj).remove();
				//sentenceItems[type.toString()].push(listItem);
				
				var html = '<li class="drag-li-'+type.toString()+'" id="'+type.toString()+'_'+ listItem+'">'+ listItem + '<span class="icon-entypo circled-cross" style="cursor: pointer;"></span></li>';
				var divid = "#sent-"+type.toString()+"-"+form.toString();
				$(divid).append(html);

				$("#sent-"+type.toString()+"-"+form.toString()).css("background-color",color);
				$(obj).parent().css("background-color",color);
				//draw_image();
			//}
	}

	var makeDragabble = function(){

		$('#init-noun').children().each(function(index,value) {
			new webkit_draggable(value.id, {revert : true, scroll : true});
		});
		//makeDroppable('sent-noun-1',1,'li-noun','noun');
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

		webkit_drop.add('sent-det-1', 
		{ accept : ["li-det"], 
			onDrop : function(obj){	
				populateOnDrop($(obj),'det','1');
			}
		});

		webkit_drop.add('sent-adj-1', 
		{ accept : ["li-adj"], 
			onDrop : function(obj){	
				populateOnDrop($(obj),'adj','1');
			}
		});

		webkit_drop.add('sent-noun-1', 
		{	accept : ["li-noun"], 
			onDrop : function(obj){
					populateOnDrop($(obj),'noun','1');
					//sent-helpverb-1
					webkit_drop.add('sent-noun-1', 
					{	accept : ["li-noun"], 
						onDrop : function(obj){
								populateOnDrop($(obj),'noun','1');
								//sent-helpverb-1
						}
						
					});
			}
			
		});

		webkit_drop.add('sent-verb-1', 
		{ accept : ["li-verb"], 
			onDrop : function(obj){	
				populateOnDrop($(obj),'verb','1');
				} 
		});

		webkit_drop.add('sent-prep-1', 
		{ accept : ["li-prep"], 
			onDrop : function(obj){	
				populateOnDrop($(obj),'prep','1');
				} 
		});



		webkit_drop.add('sent-noun-2', 
		{	accept : ["li-noun"], 
			onDrop : function(obj){
				populateOnDrop($(obj),'noun','2');
			}
		});

	};

	var makeDroppable = function(dropDivid,idSerNo, dropDivClass, pos ){

		webkit_drop.add(dropDivid, 
		{	accept : [dropDivClass], 
			onDrop : function(obj){
				populateOnDrop($(obj),pos,idSerNo);
			}
		});

	};


	var createDefaultJson = function(type,pos){
		
		var noun = type.split(" ");
		if(noun.length >1){
			noun = noun[1];
		}
		var json_elem = [{
			"eyes": "res/img/animals/"+noun+"/"+noun+"_part_eye_happy.svg",
			"skin": "res/img/animals/"+noun+"/"+noun+"_skin.svg",
			"mouth": "res/img/animals/"+noun+"/"+noun+"_part_mouth_happy.svg",
			"pos": {
					"ground" : "left_back", 
					"sky" : "none",
					"relative" : "none"
					}  
			}];

		return json_elem;

	};


	var draw_image = function()
	{
		var noun_0 = sentenceItems["noun"][0];
		var verb_0 = sentenceItems["verb"][0];
		var prep_0 = sentenceItems["prep"][0];
		var noun_1 = sentenceItems["noun"][1];
		var adj_1  = sentenceItems["adj"][0];
		var det_1 = sentenceItems["det"][0];


		if(gameLevel === 0 && noun_0)
		{
			if(verb_0)
			{
				//alert("game level1");
				var tmpVerb = verb_0.toString().split(" ");
				if (tmpVerb.length>1)
				{
					verb_0 = tmpVerb[1];
				}
				var jsonObj = drawImageData[noun_0.toString()]["verb"][verb_0.toString()];
				jsonObj["pos"]={
							"ground" : "left_back", 
							"sky" : "none", //other values ["none"]
							"relative" : "none" //other values ["none", "top", "bottom"]
							}  ;

				//alert(JSON.stringify(jsonObj));
				WORDCRAFT.handleSentChanges([jsonObj]);
				gameLevel = 1;
				playSound();
			}	
			else
			{
				//alert("game level2");
				//alert(JSON.stringify(createDefaultJson(noun_0,"right_back")));
				WORDCRAFT.handleSentChanges(createDefaultJson(noun_0,"left_back"));
			}
		};

		if(gameLevel === 1 && noun_0 )
		{ 
			
			if(verb_0)
			{
				//alert("game level3");
				var tmpVerb = verb_0.toString().split(" ");
				if (tmpVerb.length>1)
				{
					verb_0 = tmpVerb[1];
				}
				var jsonObj = drawImageData[noun_0.toString()]["verb"][verb_0.toString()];
				jsonObj["pos"] = {
							"ground" : "left_front", 
							"sky" : "none", //other values ["none"]
							"relative" : "none" //other values ["none", "top", "bottom"]
							} ;
											//alert(JSON.stringify(jsonObj));
				if(prep_0 && noun_1 )
				{
					//alert("game level4");
					//alert(JSON.stringify(jsonObj));
					//jsonObj.push(defaultJson_noun1);
					WORDCRAFT.handleSentChanges([jsonObj]);
					gameLevel = 2;
					playSound();

				}
			}	
			else
			{

				WORDCRAFT.handleSentChanges(createDefaultJson(noun_0,"left_back"));
			}

		}

		if(gameLevel === 2 && noun_0){
			//var jsonObj = [];
			//alert("game level6");
			if(verb_0)
			{
				//alert("game level7");
				var tmpVerb = verb_0.toString().split(" ");
				if (tmpVerb.length>1)
				{
					verb_0 = tmpVerb[1];
				}
				jsonObj = drawImageData[noun_0.toString()]["verb"][verb_0.toString()];
				//alert(JSON.stringify(jsonObj));
				//alert(adj_1);
				if(adj_1 && prep_0)
				{
					//alert("game level4");
					//alert(JSON.stringify(jsonObj));
					//jsonObj.push(defaultJson_noun1);
					jsonObj = drawImageData[noun_0.toString()]["adj"][adj_1.toString()];
					//alert(adj);
					//alert(jsonObj);
					WORDCRAFT.handleSentChanges([jsonObj]);
					gameLevel = 2;
					playSound();

				}
			}	
			else
			{

				WORDCRAFT.handleSentChanges(createDefaultJson(noun_0,"right_back"));
			}
		}
	};

	var playSound = function()
	{
		$("#sound").append('<source src="res/sound/Cat.wav"></source><source src="res/sound/Cat.ogg"></source>');
		var audio = $("#sound")[0];
		audio.play();

		levelChange();		
	};

	var levelChange = function(){
		initReadData(gameLevel);
		//var overlay = jQuery('<div id="overlay"><p style="float:left">Level Complete!!!</p><div id="overlay-del"><b>X</b></div> </div>');
		//overlay.appendTo(document.body);
	
	}

	return {
		
		'init' : init,
		'gameLevel': gameLevel
		

	};

})();

