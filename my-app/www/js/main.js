
var WORDCRAFT = WORDCRAFT || {}

WORDCRAFT = (function(){

	



	var init = function(){
		console.log("let the crafting begin!");
		initCanvas();
		evtHandler(); //all events handler
	};



	var initCanvas = function(){
		//clean scene


		var canvas = new fabric.Canvas('elem-frame-svg');

		var perspDim = getCanvasPerspDim(canvas);

		console.log("canvas perspective: ", perspDim);


		


		// fabric.loadSVGFromURL('res/img/animals/cat/cat_full_color.svg', function(objects, options) {
		//     var shape = fabric.util.groupSVGElements(objects, options);
		//     canvas.add(shape.scale(0.6));
		//     shape.set({ left: 200, top: 100 }).setCoords();
		//     canvas.renderAll();
		// });


		// fabric.Image.fromURL('res/img/animals/cat/cat_full_color.svg', function(oImg){
		// 	oImg.top = 250;
		// 	oImg.left = 200;

		// 	oImg.scale(0.6);
		// 	canvas.add(oImg);
		// });


	};




	function getCanvasPerspDim(c){
		// get canvas perspective dimensions

		c_height = c.height;
		c_width = c.width;

		theta = Math.atan2((c_height/2), (c_width/4));

		x_unit = Math.floor(c_width/8)
		y_unit = Math.floor(c_height/16);
		
		var persp = {
			"vanishingY" : Math.floor(c_height/2), //vanishing plane
			"theta" : Math.floor(theta), //
			"ground" : {
				"left_front" 	: [Math.floor(x_unit + y_unit / Math.tan(theta)), Math.floor(y_unit)],
				"center_front" 	: [Math.floor(c_width/2), Math.floor(y_unit)],
				"right_front"	: [Math.floor((c_width - x_unit) + y_unit/Math.tan(theta)), Math.floor(y_unit)],
				
				"left_middle" 	: [Math.floor(x_unit + 3*y_unit / Math.tan(theta)), Math.floor(3*y_unit)],
				"center_middle" : [Math.floor(c_width/2), Math.floor(3*y_unit)],
				"right_middle"	: [Math.floor((c_width - x_unit) + 3*y_unit/Math.tan(theta)), Math.floor(3*y_unit)],

				"left_back" 	: [Math.floor(x_unit + 5*y_unit / Math.tan(theta)), Math.floor(5*y_unit)],
				"center_back" 	: [Math.floor(c_width/2), Math.floor(5*y_unit)],
				"right_back"	: [Math.floor((c_width - x_unit) + y_unit/Math.tan(theta)), Math.floor(5*y_unit)]
			}
		};

		return persp; 
	}
	

	var evtHandler = function(){
		jQuery('.text-muted').click(function(){

			// //for testing
			// var testObj = {
			// 	"eyes": "res/img/animals/cat/cat_part_eye.svg",
			// 	"skin": "res/img/animals/cat/cat_skin.svg",
			// 	"mouth": "res/img/animals/cat/cat_part_mouth_happy.svg",
			// 	"ears": "res/img/animals/cat/cat_part_ears.svg"
			// };
			handleSentChanges(testObj);

			// initCanvas();
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

