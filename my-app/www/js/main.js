
var WORDCRAFT = WORDCRAFT || {}

WORDCRAFT = (function(){

	var init = function(){
		console.log("let the crafting begin!");
		initCanvas();
		evtHandler(); //all events handler
	};



	var initCanvas = function(){
		var canvas = new fabric.Canvas('elem-frame-svg');

		fabric.Image.fromURL('res/img/animals/cat/cat_full_color.svg', function(oImg){
			oImg.top = 250;
			oImg.left = 200;

			oImg.scale(0.6);
			canvas.add(oImg);
		});

		

		fabric.Image.fromURL('res/img/animals/cat/cat_full_color.svg', function(oImg){
			oImg.top = 280;
			oImg.left = 50;

			oImg.scale(0.8)
			canvas.add(oImg);
		});

	};


	var evtHandler = function(){
		jQuery('.text-muted').click(function(){

			//for testing
			var testObj = {
				"eyes": "res/img/animals/cat/cat_part_eye.svg",
				"skin": "res/img/animals/cat/cat_skin.svg",
				"mouth": "res/img/animals/cat/cat_part_mouth_happy.svg",
				"ears": "res/img/animals/cat/cat_part_ears.svg"
			};
			handleSentChanges(testObj)
		});
	};


	var renderObjOnCanvas = function(cObj){
		console.log(cObj);

		var canvas = new fabric.Canvas('elem-frame-svg');

		for (var key in cObj){
			fabric.Image.fromURL(cObj[key], function(oImg){
				oImg.top = 250;
				oImg.left = 500;

				oImg.scale(0.6);
				canvas.add(oImg);
			});
		}

		

	};




	//create a method of Sonali to call back from sentence
	//changes

	var handleSentChanges = function(obj){
		

		renderObjOnCanvas(obj);
		// console.log(JSON.stringify(obj));
	};

	return {
		'init' : init,
		'handleSentChanges' : handleSentChanges
	};

})();


jQuery(document).ready(function(){

	WORDCRAFT.init();
	WORDCRAFT.build.init()
    
});

