
var WORDCRAFT = WORDCRAFT | {}

WORDCRAFT = (function(){

	var init = function(){
		console.log("let the crafting begin!");
		initReadData();
		initCanvas();
		initFabric();
		initSVG();
		

	};

	var initReadData = function()
	{
		
		jQuery.getJSON('resources/data/parts-of-speech.json', function(data){
			
			parseData(data);
		});
		 

		function parseData(d){
			console.log("responseData", d);

			var items_nouns = [];
			var items_verbs = [];
			console.log("Length of nouns list" + $("#init-nouns").children().length);
			console.log("Length of verbs list" + $("#init-verbs").children().length);


			if($("#init-nouns").children().length < 2)
			{	
				var i = $("#init-nouns").children().length;
				while($("#init-nouns").children().length<2)
				{
					var number = 1 + Math.floor(Math.random() * d.nouns.length);
					var htmlLi = '<li class="draggable li-noun" id="noun-' + i + '">'+ d.nouns[number] + '<div class="del" style="cursor: pointer;" onClick="$(this).parent().remove();">x</div></li>' ;
					$("#init-nouns").append(htmlLi);
					i++;
				}
				console.log("Length of nouns list" + $("#init-nouns").children().length);
			};
			if($("#init-verbs").children().length < 3)
			{
				var i = $("#init-verbs").children().length;
				while($("#init-verbs").children().length<3)
				{
					var number = 1 + Math.floor(Math.random() * Object.keys(d.verbs).length);
					var htmlLi = '<li class="draggable li-verb" id="verb-' + i + '">'+ Object.keys(d.verbs)[number] + '<div class="del" style="cursor: pointer;" onClick="$(this).parent().remove();">x</div></li>' ;
					console.log(htmlLi);
					$("#init-verbs").append(htmlLi);
					i++;
				}

			};
			
			$("#init-verbs, #init-nouns, #built-words").sortable({
				placeholder: "placeholder-highlight",
				connectWith: ".connectedSortable",
				scroll: true,
				revert: true,
				stop:function(event,ui){

					console.log($( "#init-verbs" ).children());
					console.log($( "#init-nouns" ).children());

					var pos = ui.item[0].id;
					console.log(S(pos).substring(0,pos.length-2).s);

					if(S(pos).substring(0,pos.length-2).s === "noun")
					{

						console.log("Selected Noun");
						$("#init-nouns").sortable({ disabled: true });
					}
					if(S(pos).substring(0,pos.length-2).s === "verb")
					{
						console.log("Selected Verb");
						$("#init-verbs").sortable({ disabled: true });
					}
					console.log("Inside stop");
					draw_image();

				}

			});
			return;
		}
		return;
	}


	$(".add_words").on("click",function(){
		console.log("Clicked Adding new words!!!");
		$("#init-nouns").sortable({ disabled: false });
		$("#init-verbs").sortable({ disabled: false });
		add_new_words();
	})

	var add_new_words = function(){
		initReadData();
		console.log("Built words children",$("#built-words").children());
	}

	var draw_image = function(){
		console.log("Inside draw image the outer loop:");
		var noun_1 = "";
		var verb = "";

		var jqxhr = $.getJSON( "resources/data/full_json.json", function(data) {
			  console.log( "success" );
			  console.log(data["The cats"]["verb"]["agrees"]);
			  $("#built-words").children().each(function(index,value){
					var text = $(this).text();
					console.log(value.className);
					console.log($("li[class~='li-noun']"));
					if($(this).hasClass("li-noun"))
					{
						noun_1 = S(text).substring(0,text.length-1).s;
					}
					if ($(this).hasClass("li-verb"))
					{
						verb = S(text).substring(0,text.length-1).s;
					}

				});

			console.log("Noun: "+noun_1);
			console.log("Verb: "+verb);
			if(verb.length === 0 && noun_1 !=null)
			{
				$(".container-canvas").html("");
				//Remove path just use defaults or specific parts
				$(".container-canvas").append("<p>url: resources/img/"+noun_1+"full.svg</p>")
			}
			else if( !(verb === null && noun_1 ===null))
			{
				console.log(data.cats);
				$(".container-canvas").html("");
				console.log("This is the data for noun and verb: "+ data[noun_1][verb]);
				$(".container-canvas").append("<p>url: resources/img/individual_urls.svg</p>")
			}


			})
			  .done(function() {
			    console.log( "second success" );
			    
			  })
			  .fail(function() {
			    console.log( "error" );
			  })
			  .always(function() {
			    console.log( "complete" );
			  });
		 
	}

	var initCanvas = function(){
		//running through fabric getting started page
		//ref url: http://fabricjs.com/fabric-intro-part-1/

		
		var canvasEl = document.getElementById('elem-frame-native'); //reference canvas element
		//var ctx = canvasEl.getContext('2d'); 	//2d context to draw on (bitmap)

		//ctx.fillStyle = 'red';
		//ctx.fillRect(100, 100, 50, 50);

	};



	var initFabric = function(){
		var canvas = new fabric.Canvas('elem-frame-fabric');

		var rect = new fabric.Rect({
			'left': 100,
			'top': 100,
			'fill' : 'blue', 
			'width': 50,
			'height' : 50,
			'angle':45

		});

		canvas.add(rect);

	};



	var initSVG = function(){
		var canvas = new fabric.Canvas('elem-frame-svg');

		fabric.Image.fromURL('resources/img/cat/cat_skin.svg', function(oImg){
			oImg.width = 201;
			oImg.height = 242;
			oImg.top = 20;
			oImg.left = 20;
			canvas.add(oImg);
		});

		fabric.Image.fromURL('resources/img/cat/cat_part_mouth.svg', function(oImg){
			oImg.width = 201;
			oImg.height = 242;
			oImg.top = 20;
			oImg.left = 20;
			canvas.add(oImg);
		});

		fabric.Image.fromURL('resources/img/cat/cat_part_eye.svg', function(oImg){
			oImg.width = 201;
			oImg.height = 242;
			oImg.top = 20;
			oImg.left = 20;
			oImg.fill ='#aac';

			canvas.add(oImg);
		});

	};


	return {
		'init' : init
	};

})();


jQuery(document).ready(function(){

	WORDCRAFT.init();

	


    
});

