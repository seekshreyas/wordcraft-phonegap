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

		Array.prototype.remove = function(value) {
		  var idx = this.indexOf(value);
		  if (idx != -1) {
		      return this.splice(idx, 1); // The second parameter is the number of elements to remove.
		  }
		  return false;
		};


		$("#btn_add_words").bind("tap",function() {
			initReadData(gameLevel);
		});


		$(document).on("tap",".circled-cross", function(){
			var pos = $(this).parent().attr("class").split(" ")[1];
			
			pos = pos.substr(3,pos.length);
			//alert(pos);
			var word = $(this).parent().attr("id");
			
			word =  word.split("_")[1];
			//alert(word);
			//alert(sentenceItems[pos]);
			sentenceItems[pos].remove(word);
			//alert($(this).parent().html().toString());
			//console.log(sentenceItems[pos]);
			$(this).parent().remove();
		});

		$(document).on("click","#overlay", function(){
			$(this).parent();
			initReadData(gameLevel);

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
			if(jQuery.inArray(val.text(), sentenceItems[pos])==-1)
			{
				sentenceItems[pos].push(val.text());
			}
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
					wordText = word;
					sentenceItems[pos].push(word);
					if(pos === 'noun' )
					{
						tmpNoun = getNounPrefixSufix(pos,word);
						posClass = tmpNoun[1];
						wordText = tmpNoun[0];
					}
					if(pos === 'helpverb')
					{
						posClass = "helpverb-"+helpVerbType[word];
					}	
					var htmlLi = '<li class="draggable li-'+pos+' '+posClass+'" id="'+pos+'_'+word.replace(" ","_")+'">'+ wordText;
					htmlLi = htmlLi + '<span class="icon-entypo circled-cross" style="cursor: pointer;"></span></li>' ;
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
				if(jQuery.inArray(val.text(), sentenceItems["prep"])==-1)
				{
				 	sentenceItems["prep"].push(val.text());
				}
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
						sentenceItems["prep"].push(word);
						var htmlLi = '<li class="draggable li-prep prep-'+val.innerText+'" id="prep_'+word.replace(" ","_")+'">'+ word + '<span class="icon-entypo circled-cross" style="cursor: pointer;"></span></li>' ;
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
		//draw_image();

	};

	var populateOnDrop = function(obj,type,form){
		var listItem = $(obj).text();
		var wordId = $(obj).text();

			if(($("#sent-"+type.toString()+"-"+form.toString()).html().length) == 21)
			{
				var color = $(obj).css("background-color");
				$(obj).remove();
				

				if(type === 'noun')
				{
					wordId =  $(obj).attr("id").split("_")[1]
				}

				if(jQuery.inArray(wordId, sentenceItems[type.toString()])==-1)
				{
				 	sentenceItems[type.toString()].push(wordId);
				}
				
				
				var html = '<li class="draggable li-'+type.toString()+'" id="'+type.toString()+'_'+ wordId+'">'+ listItem + '<span class="icon-entypo circled-cross" style="cursor: pointer;"></span></li>';
				var divid = "#sent-"+type.toString()+"-"+form.toString();
				//alert(html);
				$(divid).append(html);

				$("#sent-"+type.toString()+"-"+form.toString()).css("background-color",color);
				$(obj).parent().css("background-color",color);
				//draw_image();
			}
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
				populateOnDrop($(obj),'adj','1');
			}
		});

		webkit_drop.add('sent-noun-1', 
		{	accept : ["li-noun"], 
			onDrop : function(obj){
					populateOnDrop($(obj),'noun','1');
					var arrayOfClasses = $(obj).attr('class').split(' ');
					nounType = arrayOfClasses[2].split("_")[1];
					webkit_drop.add('sent-helpverb-1', 
					{	accept : ["helpverb-"+nounType], 
						onDrop : function(subObj){
								populateOnDrop($(subObj),'helpverb','1');
						}
						
					});
			}
			
		});

		webkit_drop.add('sent-verb-1', 
		{ accept : ["li-verb"], 
			onDrop : function(obj){	
				populateOnDrop($(obj),'verb','1');
				var prepClass = $(obj).text()
				prepClass = "prep-"+prepClass;
				webkit_drop.add('sent-prep-1', 
				{	
					accept : [prepClass], 
					onDrop : function(subObj){
						populateOnDrop($(subObj),'prep','1');
					}
					
				});

				} 
		});

		webkit_drop.add('sent-noun-2', 
		{	accept : ["li-noun"], 
			onDrop : function(obj){
				populateOnDrop($(obj),'noun','2');
			}
		});
		
		draw_image();
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
		var finalSentence = {}
		var builtSent = $( "#build-sentence").children();
		$.each(builtSent,function(i,value){
			finalSentence[value.id] = value.innerHtml;
		});
		//alert(finalSentence["sent-noun-1"].length);

	};

	var playSound = function()
	{
		console.log("Clicked remove");
		/*$("#sound").append('<source src="res/sound/Cat.wav"></source><source src="res/sound/Cat.ogg"></source>');
		var audio = $("#sound")[0];
		audio.play();

		levelChange();	*/	
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

