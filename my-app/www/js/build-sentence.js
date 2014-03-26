var WORDCRAFT = WORDCRAFT | {}

WORDCRAFT = (function(){

	var init = function(){
		console.log("let the crafting begin!");

		initReadData();
		
		$("#btn_add_words").click(function() {
			console.log("Inside button click");
			initReadData();
		});
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
				var htmlLi = '<li class="draggable li-noun" id="noun-' + i + '">'+ d.nouns[number] + '<div class="del" style="cursor: pointer;" onClick="$(this).parent().remove();">x</div></li>' ;
				$("#init-nouns").append(htmlLi);
				$("#all-words").append(htmlLi);
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
				var htmlLi = '<li class="draggable li-verb" id="verb-' + i + '">'+ Object.keys(d.verbs)[number] + '<div class="del" style="cursor: pointer;" onClick="$(this).parent().remove();">x</div></li>' ;
				console.log(htmlLi);
				$("#init-verbs").append(htmlLi);
				$("#all-words").append(htmlLi);
				i++;
			}

		};

		$('#all-words').children().each(function(index,value) {
			console.log("inside all words");
			console.log(value.id);
			new webkit_draggable(value.id, {revert : true, scroll : true});

		});

		$('#init-nouns').children().each(function(index,value) {
			new webkit_draggable(value.id, {revert : true, scroll : true});
		});

		webkit_drop.add('sent-noun-1', 
		{accept : ["li-noun"], 
			onDrop : function(e){	
				}

		});
		webkit_drop.add('sent-verb-1', 
		{accept : ["li-verb"], 
			onDrop : function(e){	
				}
		});

		
	};

	

	var add_new_words = function(){
		initReadData();
	};

	return {
		'init' : init
	};

})();


jQuery(document).ready(function(){

	WORDCRAFT.init();
});