
var WORDCRAFT = WORDCRAFT || {}

WORDCRAFT = (function(){

	var init = function(){
		console.log("let the crafting begin!");
		initCanvas();
		initFabric();
		initSVG();

	};



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

		fabric.Image.fromURL('res/img/cat/cat_skin.svg', function(oImg){
			oImg.width = 201;
			oImg.height = 242;
			oImg.top = 20;
			oImg.left = 20;
			canvas.add(oImg);
		});

		fabric.Image.fromURL('res/img/cat/cat_part_mouth.svg', function(oImg){
			oImg.width = 201;
			oImg.height = 242;
			oImg.top = 20;
			oImg.left = 20;
			canvas.add(oImg);
		});

		fabric.Image.fromURL('res/img/cat/cat_part_eye.svg', function(oImg){
			oImg.width = 201;
			oImg.height = 242;
			oImg.top = 20;
			oImg.left = 20;
			oImg.fill ='#aac';

			canvas.add(oImg);
		});

	};




	//create a method of Sonali to call back from sentence
	//changes

	var handleSentChanges = function(obj){
		console.log(JSON.stringify(obj));
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

