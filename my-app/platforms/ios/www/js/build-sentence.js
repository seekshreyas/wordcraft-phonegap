var WORDCRAFT = WORDCRAFT || {}

WORDCRAFT.build = (function(){

	var gameLevel = 0;
	var drawImageData = {};
	var sentenceItems = {};

	var init = function(){
		console.log("let the crafting begin!");

		initReadData();

		var full_json = $.getJSON( "res/data/full_json.json") 
			.done(function(data) {
				drawImageData = data;
				console.log(drawImageData);	    
			})
			.fail(function() {
			    console.log( "error" );
			});

		$("#btn_add_words").bind("tap",function() {
			add_new_words();
		});

		var add_new_words = function(){
			initReadData();
		};
	};
	
	var initReadData = function()
	{
		console.log("Inside Init read data");
		jQuery.getJSON('res/data/parts-of-speech.json', function(data){		
		parseData(data);	
		});	
	};

	var parseData = function(d){
		console.log("Reached parserdata");
		console.log("Length of nouns list" + $("#init-nouns").children().length);
		console.log("Length of verbs list" + $("#init-verbs").children().length);
		console.log(d.nouns);
		
		if($("#init-nouns").children().length < 2)
		{	
			console.log("Checking init noun ");
			console.log("length of nouns < 2");
			var i = $("#init-nouns").children().length;
			while($("#init-nouns").children().length<2)
			{
				var number = 1 + Math.floor(Math.random() * d.nouns.length);
				var htmlLi = '<li class="draggable li-noun" id="noun_' + i + '">'+ d.nouns[number] + '<div class="del" style="cursor: pointer;" onClick="$(this).parent().remove();">x</div></li>' ;
				$("#init-nouns").append(htmlLi);
				//$("#all-words").append(htmlLi);
				i++;
			}
			console.log("Length of nouns list" + $("#init-nouns").children().length);
		};
		if($("#init-verbs").children().length < 3)
		{
			console.log("Checking init verbs");
			console.log("length of verbs < 3");
			var i = $("#init-verbs").children().length;
			while($("#init-verbs").children().length<3)
			{
				
				var number = 1 + Math.floor(Math.random() * Object.keys(d.verbs).length);
				var htmlLi = '<li class="draggable li-verb" id="verb_' + i + '">'+ Object.keys(d.verbs)[number] + '<div class="del" style="cursor: pointer;" onClick="$(this).parent().remove();">x</div></li>' ;
				console.log(htmlLi);
				$("#init-verbs").append(htmlLi);
				//$("#all-words").append(htmlLi);
				i++;
			}

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

		webkit_drop.add('sent-noun-1', 
		{	accept : ["li-noun"], 
			onDrop : function(obj){
				var value = $(obj).text();
				var listItem = value.substr(0, value.length - 1);
				var listItemId = $(obj).attr('id');	
				sentenceItems[listItemId] = listItem;
				draw_image();

			}
		});
		webkit_drop.add('sent-verb-1', 
		{accept : ["li-verb"], 
			onDrop : function(obj){	
				var value = $(obj).text();
				var listItem = value.substr(0, value.length - 1);
				var listItemId = $(obj).attr('id');	
				sentenceItems[listItemId] = listItem;
				draw_image();
				}
		});
	};

	var draw_image = function()
	{	alert("Inside draw");
		alert(JSON.stringify(sentenceItems["noun_0"]));
		var noun_0 = sentenceItems["noun_0"];
		var verb_0 = sentenceItems["verb_0"];

		if(gameLevel ===0 && noun_0)
		{
			alert("gamelevel");
			if(verb_0)
			{
			alert(JSON.stringify(drawImageData[noun_0.toString()]["verb"][verb_0.toString()]));
			}	
			else
			{
				alert("default for noun");
			}
		}
	};

	
	return {
		'init' : init,
		'gameLevel': gameLevel

	};

})();

