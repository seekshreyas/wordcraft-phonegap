
var WORDCRAFT = WORDCRAFT || {};

WORDCRAFT = (function(){

	var sceneObj = {};
	// var canvas; //canvas object so it is globally accessible
	var canvas =  new fabric.StaticCanvas('elem-frame-svg');
	var canvasDim = getCanvasPerspDim(canvas);


	var animationSpeed = {
		'fast' : 200,
		'normal' : 400,
		'slow': 600
	};

	var canvasState = 'inactive'; 
	var replay = []; // for caching animations


	var newDefaultSceneObj = [{
		"body" : {
			"eyes" : "res/img/animals/horse/horse_part_eyes_happy.svg",
			"skin" : "res/img/animals/horse/horse_part_skin_positive.svg",
			"mouth" : "res/img/animals/horse/horse_part_mouth_happy.svg",
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
					"start" : "-0.25",
					"end" : "0.25",
					"mid" : "0"
				},
				"speed" : "fast",
				"scale" : "",
				"animation_type" : "translateX"
			}
		]
	}, {
		"body" : {
			"eyes" : "res/img/animals/sun/sun_part_eyes_happy.svg",
			"skin" : "res/img/animals/sun/sun_part_skin_positive.svg",
			"mouth" : "res/img/animals/sun/sun_part_mouth_happy.svg",
			"color" : "", //there will be a default color for every animal
			"size" : "normal", //"normal is default.
			"width" : 200,
			"height" : 255
		},
		"pos" : {
			"plane" : "sky",
			"plane_pos" : "right_middle",
			"plane_matrix" : [0, 0]
		},
		"animation" : [{
				"duration" : "",
				"animation_params" : {
					"start" : "-0.25",
					"end" : "0.25",
					"mid" : "0"
				},
				"speed" : "fast",
				"scale" : "",
				"animation_type" : "translateX"
			}
		]
	}
];

	var init = function(){
		console.log("let the crafting begin!");
		

		initCanvas();
		evtHandler(); //all events handler
	};



	var initCanvas = function(){
		//clean scene
		// canvas = new fabric.Canvas('elem-frame-svg');
		// canvas.selection = false;

		var perspDim = getCanvasPerspDim(canvas);

		// console.log("canvas perspective: ", perspDim);

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

		// for perspective scaling, take the ratio of the y_units
		// Therefore:
		
		var scale = {
			'front': 1.0, //5/5
			'middle': 0.8, //3/5
			'back' : 0.4 //1/5
		};
		
		var persp = {
			"vanishingY" : Math.floor(c_height/2), //vanishing plane
			"theta" : Math.floor(theta), //angle of perspective
			"ground" : {
				"left_front" 	: [Math.floor(x_unit + y_unit / Math.tan(theta)/2), Math.floor(y_unit), scale.front],
				"center_front" 	: [Math.floor(c_width/2), Math.floor(y_unit),  scale.front],
				"right_front"	: [Math.floor((c_width - x_unit) + y_unit/Math.tan(theta)), Math.floor(y_unit),  scale.front],
				
				"left_middle" 	: [Math.floor(x_unit + 3*y_unit / Math.tan(theta)), Math.floor(3*y_unit), scale.middle],
				"center_middle" : [Math.floor(c_width/2), Math.floor(3*y_unit), scale.middle],
				"right_middle"	: [Math.floor((c_width - x_unit) + 3*y_unit/Math.tan(theta)), Math.floor(3*y_unit), scale.middle],

				"left_back" 	: [Math.floor(x_unit + 5*y_unit / Math.tan(theta)), Math.floor(5*y_unit), scale.back],
				"center_back" 	: [Math.floor(c_width/2), Math.floor(5*y_unit), scale.back],
				"right_back"	: [Math.floor((c_width - x_unit) + y_unit/Math.tan(theta)), Math.floor(5*y_unit), scale.back]
			},
			"sky" : {
				"left_front" 	: [Math.floor(x_unit + y_unit / Math.tan(pi - theta)), Math.floor(13*y_unit), scale.front],
				"center_front" 	: [Math.floor(c_width/2), Math.floor(13*y_unit), scale.front],
				"right_front"	: [Math.floor((c_width - x_unit) + y_unit/Math.tan(pi - theta)), Math.floor(13*y_unit), scale.front],
				
				"left_middle" 	: [Math.floor(x_unit - Math.abs(y_unit / Math.tan(pi - theta))), Math.floor(11*y_unit), scale.middle],
				"center_middle" : [Math.floor(c_width/2), Math.floor(11*y_unit), scale.middle],
				"right_middle"	: [Math.floor((c_width - x_unit) + Math.abs(y_unit/Math.tan(pi - theta))), Math.floor(11*y_unit), scale.middle],

				"left_back" 	: [Math.floor(x_unit + 5*Math.abs(y_unit / Math.tan(pi - theta))), Math.floor(7*y_unit), scale.back],
				"center_back" 	: [Math.floor(c_width/2), Math.floor(7*y_unit), scale.back],
				"right_back"	: [Math.floor((c_width - x_unit) + Math.abs(y_unit/Math.tan(pi - theta))), Math.floor(7*y_unit), scale.back]
			}
		};

		return persp; 
	}
	

	var evtHandler = function(){
		


		jQuery('#btn-replay').on('vclick', function(){
			console.log('replay clicked');

			lastElem = replay.pop()


			canvas = new fabric.StaticCanvas('elem-frame-svg');
			var cDim = getCanvasPerspDim(canvas);


			renderObjOnCanvas(lastElem, cDim);

		});





	};


	var renderObjOnCanvas = function(cObj, cDim){
		// console.log("render canvas dimensions:", cDim);	

		canvas.selection = false;

		replay = []; //reset the animation array, so it doesn't exponentially grow

		replay.push(cObj);

		if (cObj.length > 0){

			canvasState = 'active';

			// for (var c=0; c < cObj.length; c++){
			cObj.forEach(function(noun, count){

				var imgwidth = noun.body.width; //default image width
				var imgheight = noun.body.height; //default image height
				var imgInitScale = 1.0;
				var imgOffsetX = Math.floor(imgwidth*imgInitScale/2);
				var imgOffsetY = Math.floor(imgheight*imgInitScale/2);

				var adjacencyOffset = noun.pos.plane_matrix;
				var adjacencyAmplitude = 40;

				// console.log("adjacencyOffset: ", adjacencyOffset);

			
				var canvaswidth = canvas.width;
				var canvasheight = canvas.height;
				var pos;
				var renderObject;

				var cDim = getCanvasPerspDim(canvas);

				// console.log("ImageWidth, Height:", imgwidth, imgheight, noun);
				// var noun = cObj[c]; //assign the noun object
				
				if (noun.body.skin !== 'undefined'){
					// var animalParts = ['skin', 'mouth', 'eyes'];
					console.log("noun: ", noun, cDim);


					pos = cDim[noun.pos.plane][noun.pos.plane_pos];

					// console.log("Noun: ", noun, "Position: ", pos);

					
						fabric.Image.fromURL(noun.body.skin, function(img){

							var skin = img.scale(imgInitScale*pos[2]);

							fabric.Image.fromURL(noun.body.mouth, function(img){

								var mouth = img.scale(imgInitScale*pos[2]);

								fabric.Image.fromURL(noun.body.eyes, function(img){

									var eyes = img.scale(imgInitScale*pos[2]);

									
									var part_left = pos[0] - imgOffsetX + adjacencyOffset[0] * adjacencyAmplitude;
									var part_top = canvasheight - (pos[1] + imgOffsetY) + adjacencyOffset[1] * adjacencyAmplitude;
									// console.log("Shreyas:",pos, part_top, part_left, imgScale);

									var group = new fabric.Group([skin, mouth, eyes],{
										top: part_top,
										left: part_left,
										selectable : false
									});
									canvas.add(group);
									// this.__canvases.push(canvas);
									canvas.renderAll();

									

									// console.log("animation: ", noun.animation, group.top, group.left);
									handleObjAnimations(group, noun.animation);
								});
							});
						});
					
				}
			});	
		}
	};

	var handleObjAnimations = function(obj, anims){
		// console.log("Object Position: ", anims);

		anims.forEach(function(anim_kind, count){
			var defaultDuration = 200;

			// console.log("animation duration: ", anim_kind.duration);

			canvasState = 'animating';

			switch (anim_kind.animation_type){
				
				// translate X
				case "translateX":
					// console.log("translate on the X-axis");

					var amplitude = 50; // in pixels
					var states = [anim_kind.animation_params.start, anim_kind.animation_params.mid, anim_kind.animation_params.end]

					var movement = states[0] === '' ? 0 : parseFloat(states[0]) * amplitude;
					// console.log("Displacement: ", displacement);

					var displacement = movement > 0 ? '+=' + movement.toString() : '-=' + (movement * -1).toString();

					obj.animate('left', displacement, { 
						onChange: canvas.renderAll.bind(canvas),
						duration:  anim_kind.duration === ''? defaultDuration : parseFloat(anim_kind.duration),
						// easing: fabric.util.ease.easeInCubic,
						onComplete : function(){
							var movement = states[1] === '' ? 0 : parseFloat(states[1]) * amplitude;
							var displacement = movement > 0 ? '+=' + movement.toString() : '-=' + (movement * -1).toString();

							// console.log("Displacement: ", displacement);

							obj.animate('left', displacement, { 
								onChange: canvas.renderAll.bind(canvas),
								duration:  anim_kind.duration === ''? defaultDuration : parseFloat(anim_kind.duration),
								easing: fabric.util.ease.easeInCubic,
								onComplete : function(){
									var movement = states[2] === '' ? 0 : parseFloat(states[2]) * amplitude;
									var displacement = movement > 0 ? '+=' + movement.toString() : '-=' + (movement * -1).toString();

									// console.log("Displacement: ", displacement);

									obj.animate('left', displacement, { 
										onChange: canvas.renderAll.bind(canvas),
										duration:  anim_kind.duration === ''? defaultDuration : parseFloat(anim_kind.duration),
										easing: fabric.util.ease.easeOutCubic,
										onComplete : function(){
											// console.log("completed:", anim_kind.animation_type);

											canvasState = 'inactive';
										}
									});
		
								}
							});
		
						}
					});
		

					break;


				// translate Y
				case "translateY":
					// console.log("translate on the X-axis");

					var amplitude = 50; // in pixels
					var states = [anim_kind.animation_params.start, anim_kind.animation_params.mid, anim_kind.animation_params.end]

					var movement = states[0] === '' ? 0 : parseInt(states[0]) * amplitude;
					// console.log("Displacement: ", displacement);

					var displacement = movement > 0 ? '+=' + movement.toString() : '-=' + (movement * -1).toString();

					obj.animate('top', displacement, { 
						onChange: canvas.renderAll.bind(canvas),
						duration:  anim_kind.duration === ''? defaultDuration : parseInt(anim_kind.duration),
						easing: fabric.util.ease.easeInCubic,
						onComplete : function(){
							var movement = states[1] === '' ? 0 : parseInt(states[1]) * amplitude;
							var displacement = movement > 0 ? '+=' + movement.toString() : '-=' + (movement * -1).toString();

							// console.log("Displacement: ", displacement);

							obj.animate('top', displacement, { 
								onChange: canvas.renderAll.bind(canvas),
								duration:  anim_kind.duration === ''? defaultDuration : parseInt(anim_kind.duration),
								easing: fabric.util.ease.easeInCubic,
								onComplete : function(){
									var movement = states[2] === '' ? 0 : parseInt(states[2]) * amplitude;
									var displacement = movement > 0 ? '+=' + movement.toString() : '-=' + (movement * -1).toString();

									// console.log("Displacement: ", displacement);

									obj.animate('top', displacement, { 
										onChange: canvas.renderAll.bind(canvas),
										duration:  anim_kind.duration === ''? defaultDuration : parseInt(anim_kind.duration),
										easing: fabric.util.ease.easeOutCubic,
										onComplete : function(){
											// console.log("completed:", anim_kind.animation_type);
											
											canvasState = 'inactive';
										}
									});
		
								}
							});
		
						}
					});
		

					break;


				//rotate
				case "rotate":
					// console.log("Rotation Animation");

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

							// console.log("Displacement: ", displacement);

							obj.animate('angle', displacement, { 
								onChange: canvas.renderAll.bind(canvas),
								duration:  anim_kind.duration === ''? defaultDuration : parseInt(anim_kind.duration),
								easing: fabric.util.ease.easeInCubic,
								onComplete : function(){
									var movement = states[2] === '' ? 0 : parseInt(states[2]) * angleAmplitude;
									var displacement = movement > 0 ? '+=' + movement.toString() : '-=' + (movement * -1).toString();

									// console.log("Displacement: ", displacement);

									obj.animate('angle', displacement, { 
										onChange: canvas.renderAll.bind(canvas),
										duration:  anim_kind.duration === ''? defaultDuration : parseInt(anim_kind.duration),
										easing: fabric.util.ease.easeOutCubic,
										onComplete : function(){
											// console.log("completed:", anim_kind.animation_type);

											canvasState = 'inactive';
										}
									});
		
								}
							});
		
						}
					});

					break;



				case 'swap':

					// console.log("Swap animation: ", anim_kind.animation_part);
					// var partIndex = {
					// 	'skin' : 0,
					// 	'mouth' : 1,
					// 	'eyes' : 2
					// };

					// var groupObjects = obj.getObjects();

					// var swapObj = groupObjects[partIndex[anim_kind.animation_part]];

					// var start = anim_kind.animation_params.start;
					// var stop = anim_kind.animation_params.end;

					// var swapAnim = function(start, stop){
					// 	// console.log("Swap Object", swapObj.getSrc());
					// 	swapObj.setSourcePath = stop;

					// 	// console.log("Swap Object", swapObj.getSrc());

					// 	if (anim_kind.duration === 'none'){
					// 		window.setTimeout(swapAnim(stop, start), 1000);
					// 	}
					// }

					// swapAnim(start, stop);



					break;

				default:
					console.log("no animation");

					WORDCRAFT.build.init(); //to signal animation finished
			}
		});
	}


	//create a method for Sonali to call back from sentence
	//changes

	var handleSentChanges = function(obj){
		canvas = new fabric.StaticCanvas('elem-frame-svg');
		var cDim = getCanvasPerspDim(canvas);

		console.log("Object passed: ", obj);
		renderObjOnCanvas(obj, cDim);
	};

	return {
		'init' : init,
		'handleSentChanges' : handleSentChanges,
		'animationSpeed' : animationSpeed,
		'canvasState' : canvasState
	};

})();


jQuery(document).ready(function(){

	WORDCRAFT.init();
	WORDCRAFT.build.init();
    
});