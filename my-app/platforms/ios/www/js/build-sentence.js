var WORDCRAFT = WORDCRAFT || {}

WORDCRAFT.build = (function(){

	var gameLevel = 0;
	var partsofSpeech = {};
	var drawImageData = {};
	var sentenceItems = {"noun":[],"verb":[],"prep":[],"adj":[],"det":[]};
	var levelPOSCnt = {0:{"noun":2,"verb":3,"prep":0,"adj":0,"adv":0,"det":0},
					   1:{"noun":2,"verb":3,"prep":3,"adj":0,"adv":0,"det":0},
					   2:{"noun":2,"verb":3,"prep":3,"adj":3,"adv":0,"det":1}};

	var init = function(){
		console.log("let the crafting begin!");

		Array.prototype.remove = function(value) {
		  var idx = this.indexOf(value);
		  if (idx != -1) {
		      return this.splice(idx, 1); // The second parameter is the number of elements to remove.
		  }
		  return false;
		}

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
			var elem = $(this).parent().text();
			elem = elem.substr(0, elem.length - 1);
			elemClass = $(this).parent().attr('class');
			elemClass = elemClass.substr(8,elemClass.length);
			sentenceItems[elemClass].remove(elem);
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
				//if(jQuery.inArray(det,tmpDet) == -1)
				//{
					tmpDet.push(det);
					var htmlLi = '<li class="draggable li-det" id="det_'+det.replace(" ","_")+'">'+ det + '<div class="del" style="cursor: pointer;">x</div></li>' ;
					$("#init-det").append(htmlLi);
				//}
				
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
			var tmpNouns = [];
			while($("#init-nouns").children().length < levelPOSCnt[level].noun)
			{
				var number = 1 + Math.floor(Math.random() * d.nouns.length-1);
				var noun = d.nouns[number];
				if (noun && $.inArray(noun, tmpNouns) == -1)
				{
						tmpNouns.push(noun);
						if(gameLevel == 2)
						{
							
							var htmlLi = '<li class="draggable li-noun" id="noun_'+noun.split(" ")[1]+'">'+ noun.split(" ")[1] + '<div class="del" style="cursor: pointer;">x</div></li>' ;
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

						var htmlLi =  '<li class="draggable li-prep" id="prep_'+tmpPrep[0].replace(" ","_")+'">'+ tmpPrep[0] + '<div class="del" style="cursor: pointer;">x</div></li>' ;
						$("#init-prep").append(htmlLi);
						console.log("Preposition html:", htmlLi);
				});
			}
		}

		makeDragabble();

	};

	var populateOnDrop = function(obj,type,form){
			var value = $(obj).text();
			if(($("#sent-"+type.toString()+"-"+form.toString()).html().length) == 21)
			{
				var listItem = value.substr(0, value.length - 1);
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
					"ground" : pos.toString(), 
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
							"ground" : "right_back", 
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
				alert("game level2");
				alert(JSON.stringify(createDefaultJson(noun_0,"right_back")));
				WORDCRAFT.handleSentChanges(createDefaultJson(noun_0,"right_back"));
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

				WORDCRAFT.handleSentChanges(createDefaultJson(noun_0,"right_back"));
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
				alert(adj_1);
				if(adj_1 && prep_0)
				{
					//alert("game level4");
					//alert(JSON.stringify(jsonObj));
					//jsonObj.push(defaultJson_noun1);
					jsonObj = drawImageData[noun_0.toString()]["adj"][adj_1.toString()];
					alert(adj);
					alert(jsonObj);
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

		var overlay = jQuery('<div id="overlay"><p style="float:left">Level Complete!!!</p><div id="overlay-del"><b>X</b></div> </div>');
		overlay.appendTo(document.body);
	
	}

	return {
		
		'init' : init,
		'gameLevel': gameLevel
		

	};

})();

