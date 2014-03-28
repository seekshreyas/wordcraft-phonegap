var WORDCRAFT = WORDCRAFT || {}

WORDCRAFT.build = (function(){

	var gameLevel = 1;
	var partsofSpeech = {};
	var drawImageData = {};
	var sentenceItems = {"noun":[],"verb":[],"prep":[],"adj":[]};
	var levelPOSCnt = {0:{"noun":2,"verb":3,"prep":0,"adj":0,"adv":0},
					   1:{"noun":2,"verb":3,"prep":5,"adj":0,"adv":0},
					   2:{"noun":2,"verb":3,"prep":3,"adj":3,"adv":0}};

	var init = function(){
		console.log("let the crafting begin!");

		var pos_json = $.getJSON( "res/data/parts-of-speech.json") 
			.done(function(data) {
				partsofSpeech = data;   
			})
			.fail(function() {
			    console.log( "error" );
			});

		initReadData(gameLevel);


		var full_json = $.getJSON( "res/data/full_json.json") 
			.done(function(data) {
				drawImageData = data;   
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

		$(document).on("click","#overlay #overlay-del", function(){
			$(this).parent().remove();
			initReadData(gameLevel);

			$("#winning").append('<source src="res/sound/winning.wav"></source><source src="res/sound/winning.ogg"></source>');
			var audio = $("#winning")[0];
			audio.play();	

		});

		$(document).on("click",".droppable-del", function(){
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
			$("sent-adj-1").addClass("active");
			//$("sent-adv-1").addClass("active");
		}
		jQuery.getJSON('res/data/parts-of-speech.json', function(data){	
			parseData(data,level);	
		});	
	};

	var parseData = function(d,level){

		if($("#init-nouns").children().length < levelPOSCnt[level].noun)
		{	
			console.log("Checking init noun ");
			console.log("length of nouns < 2");
			while($("#init-nouns").children().length < levelPOSCnt[level].noun)
			{
				var number = 1 + Math.floor(Math.random() * d.nouns.length-1);
				var noun = d.nouns[number];
				if(noun)
				{
					var htmlLi = '<li class="draggable li-noun" id="noun_'+noun.replace(" ","_")+'">'+ noun + '<div class="del" style="cursor: pointer;">x</div></li>' ;
					$("#init-nouns").append(htmlLi);
					//$("#all-words").append(htmlLi);
				}
				
			}
			console.log("Length of nouns list" + $("#init-nouns").children().length);
		
		};

		if($("#init-verbs").children().length < levelPOSCnt[level].verb)
		{
			var tmpVerbs = [];
			console.log("Checking init verbs");
			console.log("length of verbs < 3");
			while($("#init-verbs").children().length < levelPOSCnt[level].verb)
			{
				
				var number = 1 + Math.floor(Math.random() * Object.keys(d.verbs).length-1);
				var verb = Object.keys(d.verbs)[number];
				if(jQuery.inArray(verb,tmpVerbs) == -1)
				{
					tmpVerbs.push(verb);
					var htmlLi = '<li class="draggable li-verb" id="verb_'+verb.replace(" ","_")+'">'+ verb + '<div class="del" style="cursor: pointer;">x</div></li>' ;
					$("#init-verbs").append(htmlLi);
				}
				
			}
		};
		if($("#init-prep").children().length < levelPOSCnt[level].prep)
		{
			console.log("Checking init prepositions");
			var tmpVerbs = [];
			var counter = 1;
			while($("#init-prep").children().length < levelPOSCnt[level].prep)
			{
				$("#init-verbs").children().each(function(){
					console.log("Inside loop for verbs");
						var tmp = $(this).text(); 
						tmp = tmp.substr(0, tmp.length - 1);
						console.log("Verb here is:",tmp);
						var tmpPrep = partsofSpeech["verbs"][tmp.toString()];
						while (tmpVerbs.length < 5)
						{
							console.log("Inside counter while loop");
							for(var i=0 ; i < counter; i++)
							{
								if(jQuery.inArray(tmpPrep[i],tmpVerbs) === -1)
								{
									tmpVerbs.push(tmpPrep[i])
									console.log("Looping");
									var htmlLi =  '<li class="draggable li-prep" id="prep_'+tmpPrep[i].replace(" ","_")+'">'+ tmpPrep[i] + '<div class="del" style="cursor: pointer;">x</div></li>' ;
									$("#init-prep").append(htmlLi);
								}
							}
							counter++;
						}
				});
			}
			console.log($("#init-prep").html());
		};

		makeDragabble();

	};

	var makeDragabble = function(){

		$('#init-nouns').children().each(function(index,value) {
			new webkit_draggable(value.id, {revert : true, scroll : true});
		});

		$('#init-verbs').children().each(function(index,value) {
			new webkit_draggable(value.id, {revert : true, scroll : true});
		});

		$('#init-prep').children().each(function(index,value) {
			new webkit_draggable(value.id, {revert : true, scroll : true});
		});

		webkit_drop.add('sent-noun-1', 
		{	accept : ["li-noun"], 
			onDrop : function(obj){
				var value = $(obj).text();
				var listItem = value.substr(0, value.length - 1);

				var listItemId = $(obj).attr('id');	
				var color = $(obj).css( "background-color" );

				//sentenceItems[listItemId] = listItem;
				$(obj).remove();
				sentenceItems["noun"].push(listItem);
				var html = '<li class="drag-li-noun" id="noun_'+listItem.replace(" ","_")+'">'+ listItem + '<div class="del" style="cursor: pointer;" onClick="$(this).parent().remove();">x</div></li>'
				$("#sent-noun-1").append(html);
				$("#sent-noun-1").css("background-color",color);
				draw_image();
			}
		});
		webkit_drop.add('sent-verb-1', 
		{accept : ["li-verb"], 
			onDrop : function(obj){	
				var value = $(obj).text();
				var listItem = value.substr(0, value.length - 1);
				//var listItemId = $(obj).attr('id');	
				//sentenceItems[listItemId] = listItem;
				//$(obj).remove();
				var color = $(obj).css( "background-color" );
				$(obj).remove();
				sentenceItems["verb"].push(listItem);
				var html = '<li class="drag-li-verb" id="verb_'+listItem.replace(" ","_")+'">'+ listItem + '<div class="del" style="cursor: pointer;" onClick="$(this).parent().remove();">x</div></li>'
				$("#sent-verb-1").append(html);
				$("#sent-verb-1").css("background-color",color);
				draw_image();
				}
		});

		webkit_drop.add('sent-prep-1', 
		{accept : ["li-prep"], 
			onDrop : function(obj){	
				var value = $(obj).text();
				var listItem = value.substr(0, value.length - 1);
				//var listItemId = $(obj).attr('id');	
				//sentenceItems[listItemId] = listItem;
				var color = $(obj).css( "background-color" );
				$(obj).remove();
				sentenceItems["prep"].push(listItem);
				var html = '<li class="drag-li-prep" id="prep_'+listItem.replace(" ","_")+'">'+ listItem + '<div class="del" style="cursor: pointer;" onClick="$(this).parent().remove();">x</div></li>'
				$("#sent-prep-1").append(html);
				$("#sent-prep-1").css("background-color",color);
				draw_image();
				}
			});
		};

		webkit_drop.add('sent-noun-2', 
		{	accept : ["li-noun"], 
			onDrop : function(obj){
				var value = $(obj).text();
				var listItem = value.substr(0, value.length - 1);

				var listItemId = $(obj).attr('id');	
				var color = $(obj).css( "background-color" );
				//sentenceItems[listItemId] = listItem;
				$(obj).remove();
				sentenceItems["noun"].push(listItem);
				var html = '<li class="drag-li-noun" id="noun_'+listItem.replace(" ","_")+'">'+ listItem + '<div class="droppable-del" style="cursor: pointer;" onClick="$(this).parent().remove();">x</div></li>'
				$("#sent-noun-2").append(html);
				$("#sent-noun-2").css("background-color",color);
				draw_image();
			}
		});

	var draw_image = function()
	{
		var noun_0 = sentenceItems["noun"][0];
		var verb_0 = sentenceItems["verb"][0];
		var prep_0 = sentenceItems["prep"][0];
		var noun_1 = sentenceItems["noun"][1];

		if(gameLevel === 0 && noun_0)
		{
			if(verb_0)
			{
				var tmpVerb = verb_0.toString().split(" ");
				if (tmpVerb.length>1)
				{
					verb_0 = tmpVerb[1];
				}
				var jsonObj = drawImageData[noun_0.toString()]["verb"][verb_0.toString()];
				WORDCRAFT.handleSentChanges(jsonObj);
				gameLevel = 1;
				
				playSound();

			}	
			else
			{
				var defaultJson = {"eyes": "resources/img/grass/grass_part_eyes_awake.svg",
                "skin": "resources/img/grass/grass_skin.svg",
                "mouth": "resources/img/grass/grass_part_mouth_happy.svg",
                "ears": "resources/img/grass/grass_part_ears.svg"};
				WORDCRAFT.handleSentChanges(defaultJson);
			}
		};

		if(gameLevel === 1 && noun_0 )
		{
			if(verb_0)
			{
				var tmpVerb = verb_0.toString().split(" ");
				if (tmpVerb.length>1)
				{
					verb_0 = tmpVerb[1];
				}
				var jsonObj = drawImageData[noun_0.toString()]["verb"][verb_0.toString()];
				WORDCRAFT.handleSentChanges(jsonObj);


			}	
			else
			{
				if(prep_0 && noun_1 )
				{
					
					var defaultJson = {"eyes": "resources/img/grass/grass_part_eyes_awake.svg",
	                "skin": "resources/img/grass/grass_skin.svg",
	                "mouth": "resources/img/grass/grass_part_mouth_happy.svg",
	                "ears": "resources/img/grass/grass_part_ears.svg"};
					WORDCRAFT.handleSentChanges(defaultJson);
				}
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

		var overlay = jQuery('<div id="overlay"><p style="float:left">Level Complete!!!</p><div id="overlay-del"><b>x</b></div> </div>');
		overlay.appendTo(document.body);
	
	}

	return {
		
		'init' : init,
		'gameLevel': gameLevel
		

	};

})();

