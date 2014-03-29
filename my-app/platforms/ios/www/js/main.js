
var WORDCRAFT = WORDCRAFT || {}

WORDCRAFT = (function(){

	var sceneObj = {};
	var canvas; //canvas object so it is globally accessible

	var defaultSceneObj = {
		"eyes": "res/img/animals/cat/cat_part_eye.svg",
		"skin": "res/img/animals/cat/cat_skin.svg",
		"mouth": "res/img/animals/cat/cat_part_mouth_happy.svg",
		"pos": {
			"ground" : "right_back", 
			"sky" : "none", //other values ["none"]
			"relative" : "none" //other values ["none", "top", "bottom"]
		}  
	};

	var init = function(){
		console.log("let the crafting begin!");

		initCanvas();
		evtHandler(); //all events handler
	};



	var initCanvas = function(){
		//clean scene

		canvas = new fabric.Canvas('elem-frame-svg');
		var perspDim = getCanvasPerspDim(canvas);

		console.log("canvas perspective: ", perspDim);

		renderObjOnCanvas(defaultSceneObj, perspDim);

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
				"left_front" 	: [Math.floor(x_unit + y_unit / Math.tan(theta)/2), Math.floor(y_unit)],
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

		
			handleSentChanges(defaultSceneObj);

		});
	};


	var renderObjOnCanvas = function(cObj, cDim){
		// console.log("Object, Dimension:", cObj, cDim);
		var canvas = new fabric.Canvas('elem-frame-svg');

		imgwidth = 200; //default image width
		imgheight = 255; //default image height

		imgScale = 0.6;
		imgOffsetX = Math.floor(imgwidth*imgScale/2);
		imgOffsetY = Math.floor(imgheight*imgScale/2);
	
		canvaswidth = canvas.width;
		canvasheight = canvas.height;

		var animalPartOrder = ['skin', 'eyes', 'mouth'];	

		// console.log("render canvas dimensions:", canvaswidth, canvasheight);	

		if (cObj.skin !== 'Undefined'){


			for (var i=0; i< animalPartOrder.length; i++){

				console.log("animal order:", cObj[animalPartOrder[i]])
				var animal = new fabric.Image.fromURL(cObj[animalPartOrder[i]], function(oImg){
					pos = cDim.ground[cObj.pos.ground];

					// console.log("imgposition", pos);

					oImg.top = canvasheight - (pos[1] + imgOffsetY);
					oImg.left = pos[0] - imgOffsetX;

					// console.log("final position:", oImg.top, oImg.left);

					oImg.scale(imgScale);
					canvas.add(oImg);
				});
			}
		}	

	};




	//create a method of Sonali to call back from sentence
	//changes

	var handleSentChanges = function(obj){
		canvas = new fabric.Canvas('elem-frame-svg');
		var cDim = getCanvasPerspDim(canvas);


		renderObjOnCanvas(obj, cDim);
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

