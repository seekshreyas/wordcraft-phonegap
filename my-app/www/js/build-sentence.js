var WORDCRAFT = WORDCRAFT || {}

WORDCRAFT.build = (function(){

	var gameLevel = 2;
	var partsofSpeech = {};
	var drawImageData = {};
	var sentenceItems = {"noun":[],"verb":[],"prep":[],"adj":[],"det":[]};
	var levelPOSCnt = {0:{"noun":2,"verb":3,"prep":0,"adj":0,"adv":0,"det":0},
					   1:{"noun":2,"verb":3,"prep":3,"adj":0,"adv":0,"det":0},
					   2:{"noun":2,"verb":3,"prep":3,"adj":3,"adv":0,"det":1}};

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

			/*$("#winning").append('<source src="res/sound/winning.wav"></source><source src="res/sound/winning.ogg"></source>');
			var audio = $("#winning")[0];
			audio.play();	*/

		});

		$(document).on("click",".droppable-del", function(){
			alert("Clicked on droppable del");
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

		jQuery.getJSON('res/data/parts-of-speech.json', function(data){	
			parseData(data,level);	
		});	
	};

	var parseData = function(d,level){
	
		if($("#init-det").children().length < levelPOSCnt[level].det)
		{
			var tmpDet = [];
			console.log("Checking init det");
			console.log("length of det < 3");
			while($("#init-det").children().length < levelPOSCnt[level].det)
			{
				
				var number = 1 + Math.floor(Math.random() * Object.keys(d.det).length-1);
				var det = d.det[number];
				if(jQuery.inArray(det,tmpDet) == -1)
				{
					tmpDet.push(det);
					var htmlLi = '<li class="draggable li-det" id="det_'+det.replace(" ","_")+'">'+ det + '<div class="del" style="cursor: pointer;">x</div></li>' ;
					$("#init-det").append(htmlLi);
				}
				
			}
		}

		if($("#init-adj").children().length < levelPOSCnt[level].adj)
		{
			var tmpAdj = [];
			console.log("Checking init det");
			console.log("length of det < 3");
			while($("#init-adj").children().length < levelPOSCnt[level].adj)
			{
				
				var number = 1 + Math.floor(Math.random() * Object.keys(d.adj).length-1);
				var adj = d.adj[number];
				if(jQuery.inArray(adj,tmpAdj) == -1)
				{
					tmpAdj.push(det);
					var htmlLi = '<li class="draggable li-adj" id="adj_'+adj.replace(" ","_")+'">'+ adj + '<div class="del" style="cursor: pointer;">x</div></li>' ;
					$("#init-adj").append(htmlLi);
				}
				
			}
		}
		
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
					if(gameLevel === 2)
					{
						var htmlLi = '<li class="draggable li-noun" id="noun_'+noun.split(" ")[1]+'">'+ noun + '<div class="del" style="cursor: pointer;">x</div></li>' ;
						$("#init-nouns").append(htmlLi);
					}
					else
					{
						var htmlLi = '<li class="draggable li-noun" id="noun_'+noun.replace(" ","_")+'">'+ noun + '<div class="del" style="cursor: pointer;">x</div></li>' ;
						$("#init-nouns").append(htmlLi);	
					}
					//$("#all-words").append(htmlLi);
				}
				
			}
		}

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

		}

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
						var tmpPrep = partsofSpeech["verbs"][tmp.toString()];
						//while (tmpVerbs.length < 3)
						//{

						//for(var i=0 ; i < 1; i++)
						//{
							//if(tmpPrep[0]){
								//if(jQuery.inArray(tmpPrep[0],tmpVerbs) === -1)
								//{
									//tmpVerbs.push(tmpPrep[0])
									var htmlLi =  '<li class="draggable li-prep" id="prep_'+tmpPrep[0].replace(" ","_")+'">'+ tmpPrep[0] + '<div class="del" style="cursor: pointer;">x</div></li>' ;
									$("#init-prep").append(htmlLi);
									console.log("Preposition html:", htmlLi);
								//}
							//}
						//}
							//counter++;
						//}
						//console.log("Preposition array",tmpVerbs.toString());
				});
			}
		}

		makeDragabble();

	};

	var populateOnDrop = function(obj,type,form){
			//alert(obj.html());
			var value = $(obj).text();
			if(($("#sent-"+type.toString()+"-"+form.toString()).html().length) == 21)
			{
				var listItem = value.substr(0, value.length - 1);
				//alert(listItem);
				//var listItemId = $(obj).attr('id');	
				//sentenceItems[listItemId] = listItem;
				var color = $(obj).css("background-color");
				$(obj).remove();
				sentenceItems[type.toString()].push(listItem);
				
				var html = '<li class="drag-li-'+type.toString()+'" id="'+type.toString()+'_'+ listItem+'">'+ listItem + '<div class="droppable-del" style="cursor: pointer;">x</div></li>';
				var divid = "#sent-"+type.toString()+"-"+form.toString();
				$(divid).append(html);

				$("#sent-"+type.toString()+"-"+form.toString()).css("background-color",color);
				$(obj).parent().css("background-color",color);
				draw_image();
			}
	}

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

		$('#init-det').children().each(function(index,value) {
			new webkit_draggable(value.id, {revert : true, scroll : true});
		});

		$('#init-adj').children().each(function(index,value) {
			new webkit_draggable(value.id, {revert : true, scroll : true});
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

				alert("gameLevel 1");
				var tmpVerb = verb_0.toString().split(" ");
				if (tmpVerb.length>1)
				{
					verb_0 = tmpVerb[1];
				}
				//var jsonObj = drawImageData[noun_0.toString()]["verb"][verb_0.toString()];
				var jsonObj = {
					"eyes": "res/img/animals/cat/cat_part_eye.svg",
					"skin": "res/img/animals/cat/cat_skin.svg",
					"mouth": "res/img/animals/cat/cat_part_mouth_happy.svg",
					"pos": {
							"ground" : "right_back", 
							"sky" : "none", //other values ["none"]
							"relative" : "none" //other values ["none", "top", "bottom"]
							}  
					};
				/*var jsonObj = {
					"eyes": "res/img/animals/cat/cat_part_eye_sadder.svg",
                	"skin": "res/img/animals/cat/cat_skin.svg",
                	"mouth": "res/img/animals/cat/cat_part_mouth_sad.svg"
                };*/

				WORDCRAFT.handleSentChanges(jsonObj);
				gameLevel = 1;
				
				playSound();

			}	
			else
			{
				alert("gameLevel 2");
				var defaultJson = {
					"eyes": "res/img/animals/cat/cat_part_eye.svg",
					"skin": "res/img/animals/cat/cat_skin.svg",
					"mouth": "res/img/animals/cat/cat_part_mouth_happy.svg",
					"pos": {
							"ground" : "right_back", 
							"sky" : "none", //other values ["none"]
							"relative" : "none" //other values ["none", "top", "bottom"]
							}  
					};
				WORDCRAFT.handleSentChanges(defaultJson);
			}
		};

		if(gameLevel === 1 && noun_0 )
		{
			if(verb_0)
			{
				alert("gameLevel 3");
				var tmpVerb = verb_0.toString().split(" ");
				if (tmpVerb.length>1)
				{
					verb_0 = tmpVerb[1];
				}
				//var jsonObj = drawImageData[noun_0.toString()]["verb"][verb_0.toString()];
				var jsonObj = {
					"eyes": "res/img/animals/cat/cat_part_eye.svg",
					"skin": "res/img/animals/cat/cat_skin.svg",
					"mouth": "res/img/animals/cat/cat_part_mouth_happy.svg",
					"pos": {
							"ground" : "right_back", 
							"sky" : "none", //other values ["none"]
							"relative" : "none" //other values ["none", "top", "bottom"]
							}  
					};
				WORDCRAFT.handleSentChanges(jsonObj);


			}	
			else
			{
				if(prep_0 && noun_1 )
				{
					alert("gameLevel 4");
					var defaultJson = {
					"eyes": "res/img/animals/cat/cat_part_eye.svg",
					"skin": "res/img/animals/cat/cat_skin.svg",
					"mouth": "res/img/animals/cat/cat_part_mouth_happy.svg",
					"pos": {
							"ground" : "right_back", 
							"sky" : "none", //other values ["none"]
							"relative" : "none" //other values ["none", "top", "bottom"]
							}  
					};

					WORDCRAFT.handleSentChanges(defaultJson);
					gameLevel = 2;
				
					playSound();

				}
			}

		}

		if(gameLevel == 2){
			alert("gameLevel 5");
			var defaultJson = {
					"eyes": "res/img/animals/cat/cat_part_eye.svg",
					"skin": "res/img/animals/cat/cat_skin.svg",
					"mouth": "res/img/animals/cat/cat_part_mouth_happy.svg",
					"pos": {
							"ground" : "right_back", 
							"sky" : "none", //other values ["none"]
							"relative" : "none" //other values ["none", "top", "bottom"]
							}  
					};

			WORDCRAFT.handleSentChanges(defaultJson);
			gameLevel = 2;
		
			playSound();
		}
	};

	var createImageJson = function(noun_first,adj,verb,prep,noun_sec){


	};

	var playSound = function()
	{
		$("#sound").append('<source src="res/sound/Cat.wav"></source><source src="res/sound/Cat.ogg"></source>');
		var audio = $("#sound")[0];
		audio.play();

		levelChange();		
	};

	var levelChange = function(){

		var overlay = jQuery('<div id="overlay"><p style="float:left">Level Complete!!!</p><div id="overlay-del"><b>X</b></div> </div>');
		overlay.appendTo(document.body);
	
	}

	return {
		
		'init' : init,
		'gameLevel': gameLevel
		

	};

})();

