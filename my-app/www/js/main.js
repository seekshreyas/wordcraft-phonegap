
var WORDCRAFT = WORDCRAFT || {}

WORDCRAFT = (function(){

	var sceneObj = {};
	var canvas; //canvas object so it is globally accessible
	var animationSpeed = {
		'fast' : 200,
		'normal' : 400,
		'slow': 600
	};

	var defaultSceneObj = [
		{
			"eyes": "res/img/animals/sheep/sheep_part_eye_happy.svg",
			"skin": "res/img/animals/sheep/sheep_skin.svg",
			"mouth": "res/img/animals/sheep/sheep_part_mouth_happy.svg",
			"pos": {
				"ground" : "right_back", 
				"sky" : "none", //other values ["none"]
				"relative" : "none" //other values ["none", "top", "bottom"]
			}  
		},
		{
			"eyes": "res/img/animals/cat/cat_part_eye_happy.svg",
			"skin": "res/img/animals/cat/cat_skin.svg",
			"mouth": "res/img/animals/cat/cat_part_mouth_happy.svg",
			"pos": {
				"ground" : "left_middle", 
				"sky" : "none", //other values ["none"]
				"relative" : "none" //other values ["none", "top", "bottom"]
			}  
		}
	];


	var newDefaultSceneObj = [{
		"body" : {
			"eyes" : "res/img/animals/sheep/sheep_part_eye_happy.svg",
			"skin" : "res/img/animals/sheep/sheep_skin.svg",
			"mouth" : "res/img/animals/sheep/sheep_part_mouth_happy.svg",
			"color" : "", //there will be a default color for every animal
			"size" : "normal", //"normal is default.
			"width" : 200,
			"height" : 255
		},
		"pos" : {
			"plane" : "ground",
			"plane_pos" : "right_middle",
			"plane_matrix" : [0, 0]
		},
		"animation" : [{
				"duration" : "",
				"animation_params" : {
					"start" : "0",
					"end" : "2",
					"mid" : "-5"
				},
				"speed" : "normal",
				"scale" : "",
				"animation_type" : "rotate"
			}, {
				"duration" : "",
				"animation_params" : {
					"start" : "0",
					"end" : "2",
					"mid" : "3"
				},
				"speed" : "normal",
				"scale" : "",
				"animation_type" : "translateY"
			}
		]
	}, {
		"body" : {
			"eyes" : "res/img/animals/cat/cat_part_eye_happy.svg",
			"skin" : "res/img/animals/cat/cat_skin.svg",
			"mouth" : "res/img/animals/cat/cat_part_mouth_happy.svg",
			"color" : "",
			"size" : "large",
			"width" : 200,
			"height" : 255
		},
		"pos" : {
			"plane" : "sky",
			"plane_pos" : "center_front",
			"plane_matrix" : [0, 0]
		},
		"animation" : [{
				"duration" : "",
				"animation_params" : {
					"start" : "0",
					"end" : "2",
					"mid" : ""
				},
				"speed" : "normal",
				"scale" : "",
				"animation_type" : "rotate"
			}, {
				"duration" : "",
				"animation_params" : {
					"start" : "0",
					"end" : "2",
					"mid" : "-1"
				},
				"speed" : "normal",
				"scale" : "",
				"animation_type" : "translateX"
			}
		]
	}
];

	var init = function(){
		console.log("let the crafting begin!");
		canvas = new fabric.Canvas('elem-frame-svg');

		initCanvas();
		evtHandler(); //all events handler
	};



	var initCanvas = function(){
		//clean scene
		
		var perspDim = getCanvasPerspDim(canvas);

		console.log("canvas perspective: ", perspDim);

		renderObjOnCanvas(newDefaultSceneObj, perspDim);

	};




	function getCanvasPerspDim(c){
		// get canvas perspective dimensions
		c_height = c.height;
		c_width = c.width;

		theta = Math.atan2((c_height/2), (c_width/4));

		x_unit = Math.floor(c_width/8)
		y_unit = Math.floor(c_height/16);
		pi = Math.PI; 

		console.log("x,y :", x_unit, y_unit );
		
		var persp = {
			"vanishingY" : Math.floor(c_height/2), //vanishing plane
			"theta" : Math.floor(theta), //angle of perspective
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
			},
			"sky" : {
				"left_front" 	: [Math.floor(x_unit + y_unit / Math.tan(pi - theta)), Math.floor(11*y_unit)],
				"center_front" 	: [Math.floor(c_width/2), Math.floor(11*y_unit)],
				"right_front"	: [Math.floor((c_width - x_unit) + y_unit/Math.tan(pi - theta)), Math.floor(11*y_unit)],
				
				"left_middle" 	: [Math.floor(x_unit + 3*y_unit / Math.tan(pi - theta)), Math.floor(9*y_unit)],
				"center_middle" : [Math.floor(c_width/2), Math.floor(9*y_unit)],
				"right_middle"	: [Math.floor((c_width - x_unit) + 3*y_unit/Math.tan(pi - theta)), Math.floor(9*y_unit)],

				"left_back" 	: [Math.floor(x_unit + 5*y_unit / Math.tan(pi - theta)), Math.floor(7*y_unit)],
				"center_back" 	: [Math.floor(c_width/2), Math.floor(7*y_unit)],
				"right_back"	: [Math.floor((c_width - x_unit) + y_unit/Math.tan(pi - theta)), Math.floor(7*y_unit)]
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
		// console.log("render canvas dimensions:", canvaswidth, canvasheight);	
		if (cObj.length > 0){

			// for (var c=0; c < cObj.length; c++){
			cObj.forEach(function(noun, count){

				var imgwidth = noun.body.width; //default image width
				var imgheight = noun.body.height; //default image height
				var imgScale = 0.2;
				var imgOffsetX = Math.floor(imgwidth*imgScale/2);
				var imgOffsetY = Math.floor(imgheight*imgScale/2);
			
				var canvaswidth = canvas.width;
				var canvasheight = canvas.height;
				var pos;
				var renderObject;

				console.log("ImageWidth, Height:", imgwidth, imgheight, noun);
				// var noun = cObj[c]; //assign the noun object
				
				if (noun.body.skin !== 'undefined'){
					// var animalParts = ['skin', 'mouth', 'eyes'];
					pos = cDim[noun.pos.plane][noun.pos.plane_pos];

					// console.log("Noun: ", noun, "Position: ", pos);

					// renderObject = (function(noun){
						fabric.Image.fromURL(noun.body.skin, function(skin){
							fabric.Image.fromURL(noun.body.mouth, function(mouth){
								fabric.Image.fromURL(noun.body.eyes, function(eyes){

									var part_top = canvasheight - (pos[1] + imgOffsetY);
									var part_left = pos[0] - imgOffsetX;
									console.log("Shreyas:",pos, part_top, part_left, imgScale);

									var group = new fabric.Group([skin, mouth, eyes],{
										top: part_top,
										left: part_left,
										scale: imgScale
									});
									canvas.add(group);

									console.log("animation: ", noun.animation, group.top, group.left);
									handleObjAnimations(group, noun.animation);
								});
							});
						});
					// })(noun);
				}
			});	
		}
	};

	var handleObjAnimations = function(obj, anims){
		console.log("Object Position: ", anims);

		anims.forEach(function(anim_kind, count){
			var defaultDuration = 1000;

			switch (anim_kind.animation_type){
				
				// translate X
				case "translateX":
					console.log("translate on the X-axis");

					var amplitude = 50; // in pixels
					var states = [anim_kind.animation_params.start, anim_kind.animation_params.mid, anim_kind.animation_params.end]

					var movement = states[0] === '' ? 0 : parseInt(states[0]) * amplitude;
					console.log("Displacement: ", displacement);

					var displacement = movement > 0 ? '+=' + movement.toString() : '-=' + (movement * -1).toString();

					obj.animate('left', displacement, { 
						onChange: canvas.renderAll.bind(canvas),
						duration:  anim_kind.duration === ''? defaultDuration : parseInt(anim_kind.duration),
						easing: fabric.util.ease.easeInCubic,
						onComplete : function(){
							var movement = states[1] === '' ? 0 : parseInt(states[1]) * amplitude;
							var displacement = movement > 0 ? '+=' + movement.toString() : '-=' + (movement * -1).toString();

							console.log("Displacement: ", displacement);

							obj.animate('left', displacement, { 
								onChange: canvas.renderAll.bind(canvas),
								duration:  anim_kind.duration === ''? defaultDuration : parseInt(anim_kind.duration),
								easing: fabric.util.ease.easeInCubic,
								onComplete : function(){
									var movement = states[2] === '' ? 0 : parseInt(states[2]) * amplitude;
									var displacement = movement > 0 ? '+=' + movement.toString() : '-=' + (movement * -1).toString();

									console.log("Displacement: ", displacement);

									obj.animate('left', displacement, { 
										onChange: canvas.renderAll.bind(canvas),
										duration:  anim_kind.duration === ''? defaultDuration : parseInt(anim_kind.duration),
										easing: fabric.util.ease.easeOutCubic,
										onComplete : function(){
											console.log("completed:", anim_kind.animation_type);
										}
									});
		
								}
							});
		
						}
					});
		

					break;


				// translate Y
				case "translateY":
					console.log("translate on the X-axis");

					var amplitude = 50; // in pixels
					var states = [anim_kind.animation_params.start, anim_kind.animation_params.mid, anim_kind.animation_params.end]

					var movement = states[0] === '' ? 0 : parseInt(states[0]) * amplitude;
					console.log("Displacement: ", displacement);

					var displacement = movement > 0 ? '+=' + movement.toString() : '-=' + (movement * -1).toString();

					obj.animate('top', displacement, { 
						onChange: canvas.renderAll.bind(canvas),
						duration:  anim_kind.duration === ''? defaultDuration : parseInt(anim_kind.duration),
						easing: fabric.util.ease.easeInCubic,
						onComplete : function(){
							var movement = states[1] === '' ? 0 : parseInt(states[1]) * amplitude;
							var displacement = movement > 0 ? '+=' + movement.toString() : '-=' + (movement * -1).toString();

							console.log("Displacement: ", displacement);

							obj.animate('top', displacement, { 
								onChange: canvas.renderAll.bind(canvas),
								duration:  anim_kind.duration === ''? defaultDuration : parseInt(anim_kind.duration),
								easing: fabric.util.ease.easeInCubic,
								onComplete : function(){
									var movement = states[2] === '' ? 0 : parseInt(states[2]) * amplitude;
									var displacement = movement > 0 ? '+=' + movement.toString() : '-=' + (movement * -1).toString();

									console.log("Displacement: ", displacement);

									obj.animate('top', displacement, { 
										onChange: canvas.renderAll.bind(canvas),
										duration:  anim_kind.duration === ''? defaultDuration : parseInt(anim_kind.duration),
										easing: fabric.util.ease.easeOutCubic,
										onComplete : function(){
											console.log("completed:", anim_kind.animation_type);
										}
									});
		
								}
							});
		
						}
					});
		

					break;


				//rotate
				case "rotate":
					console.log("Rotation Animation");

					var angleAmplitude = 10; // in radians
					var states = [anim_kind.animation_params.start, anim_kind.animation_params.mid, anim_kind.animation_params.end]

					var movement = states[0] === '' ? 0 : parseInt(states[0]) * angleAmplitude;
					var displacement = movement > 0 ? '+=' + movement.toString() : '-=' + (movement * -1).toString();

					// console.log("Displacement: ", displacement,"states: ", parseInt(states[0]), "movement: ", movement, anim_kind);

					obj.animate('angle', displacement, { 
						onChange: canvas.renderAll.bind(canvas),
						duration:  anim_kind.duration === ''? defaultDuration : parseInt(anim_kind.duration),
						easing: fabric.util.ease.easeInCubic,
						onComplete : function(){
							var movement = states[1] === '' ? 0 : parseInt(states[1]) * angleAmplitude;
							var displacement = movement > 0 ? '+=' + movement.toString() : '-=' + (movement * -1).toString();

							console.log("Displacement: ", displacement);

							obj.animate('angle', displacement, { 
								onChange: canvas.renderAll.bind(canvas),
								duration:  anim_kind.duration === ''? defaultDuration : parseInt(anim_kind.duration),
								easing: fabric.util.ease.easeInCubic,
								onComplete : function(){
									var movement = states[2] === '' ? 0 : parseInt(states[2]) * angleAmplitude;
									var displacement = movement > 0 ? '+=' + movement.toString() : '-=' + (movement * -1).toString();

									console.log("Displacement: ", displacement);

									obj.animate('angle', displacement, { 
										onChange: canvas.renderAll.bind(canvas),
										duration:  anim_kind.duration === ''? defaultDuration : parseInt(anim_kind.duration),
										easing: fabric.util.ease.easeOutCubic,
										onComplete : function(){
											console.log("completed:", anim_kind.animation_type);
										}
									});
		
								}
							});
		
						}
					});

					break;

				default:
					console.log("no animation");
			}
		});
	}


	//create a method for Sonali to call back from sentence
	//changes

	var handleSentChanges = function(obj){
		canvas = new fabric.Canvas('elem-frame-svg');
		var cDim = getCanvasPerspDim(canvas);


		renderObjOnCanvas(obj, cDim);
	};

	return {
		'init' : init,
		'handleSentChanges' : handleSentChanges,
		'animationSpeed' : animationSpeed
	};

})();


jQuery(document).ready(function(){

	WORDCRAFT.init();
	WORDCRAFT.build.init()
    
});

