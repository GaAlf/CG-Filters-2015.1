$(function() {

	var width = $('#initial_canvas').width();
	var height = $('#initial_canvas').height();

	$('#input_file').change(function(e) {
		var file = e.target.files[0],
			imageType = /image.*/;

		if (!file.type.match(imageType))
			return;

		var reader = new FileReader();
		reader.onload = fileOnload;
		reader.readAsDataURL(file);        
	});

	function fileOnload(e) {
		var $img = $('<img>', { src: e.target.result });
		var canvas = $('#initial_canvas')[0];
		var context = canvas.getContext('2d');

		$img.load(function() {
			context.drawImage(this, 0, 0);
		});
	}

	var invertColors = function() {

		var initial_canvas = $('#initial_canvas')[0].getContext('2d');
		var result_canvas = $('#result_canvas')[0].getContext('2d');

    	var initialImageData = initial_canvas.getImageData(0,0,width,height);
    	var finalImageData = result_canvas.getImageData(0,0,width,height);

		for (var i = 0; i < finalImageData.data.length; i+=4) {
			finalImageData.data[i] = 255 - initialImageData.data[i];
			finalImageData.data[i+1] = 255 - initialImageData.data[i+1];
			finalImageData.data[i+2] = 255 - initialImageData.data[i+2];
			finalImageData.data[i+3] = 255;
		};

		result_canvas.putImageData(finalImageData,0,0);

	}

	var boxFiltering = function(kernel) {

		var initial_canvas = $('#initial_canvas')[0].getContext('2d');
		var result_canvas = $('#result_canvas')[0].getContext('2d');

		var denominator = 0;
		for(var k=0; k<kernel.length; k++) denominator += kernel[k];

    	var initialImageData = initial_canvas.getImageData(0,0,width,height);
    	var finalImageData = result_canvas.getImageData(0,0,width,height);

		for(var l=1; l<height-1; l++) {
			for(var c=1; c<width-1; c++) {
		
				finalImageData.data[4*(c+(l*width))+3] = 255;

				var red = 0, green = 0, blue = 0;
				for (var k=0; k<kernel.length; k++) {
					var x = c, y = l;

					if(k/3 == 0) y++;
					else if(k/3 == 2) y--;

					if(k%3 == 0) x--;
					else if(k%3 == 2) x++;

					var r = initialImageData.data[4*(x+(y*width))];
					var g = initialImageData.data[4*(x+(y*width))+1];
					var b = initialImageData.data[4*(x+(y*width))+2];

					red += r * kernel[k];
					green += g * kernel[k];
					blue += b * kernel[k];

					if(k == kernel.length-1 && l == height-2 && c == height-2) {
						console.log("Eu entrei aqui.");
						console.log( finalImageData.data.length - (4+4*width) );
						console.log( 4*(c+(l*width)) );
					}				
				};

				finalImageData.data[4*(c+(l*width))] = red / denominator;
				finalImageData.data[4*(c+(l*width))+1] = green / denominator;
				finalImageData.data[4*(c+(l*width))+2] = blue / denominator;
				
			};
		};

		result_canvas.putImageData(finalImageData,0,0);

	}

	var getDynamicMatrix = function(){

		var matrix = [0,0,0,0,0,0,0,0,0];
		for(var k=0; k<9; k++){
			var matrix_pos = "#matrix_"+(k+1);
			var value = $(matrix_pos).val();
			if(value == ""){
				value = "0";
				$(matrix_pos).val("0");
			}
			value = parseInt(value);
			matrix[k] = value;
		}
		return matrix;
	}

	$('#blur_filter').on('click',function(e){
		smothing = [1,1,1,1,2,1,1,1,1];
		boxFiltering(smothing);
	});

	$('#sharpening_filter').on('click',function(e){
		smothing = [-1,-1,-1,-1,9,-1,-1,-1,-1];
		boxFiltering(smothing);
	});

	$('#raised_filter').on('click',function(e){
		smothing = [0,0,-2,0,2,0,1,0,0];
		boxFiltering(smothing);
	});

	$('#motion_blur_filter').on('click',function(e){
		smothing = [0,0,1,0,0,0,1,0,0];
		boxFiltering(smothing);
	});

	$('#edge_detection_filter').on('click',function(e){
		smothing = [-1,-1,-1,-1,8,-1,-1,-1,-1];
		boxFiltering(smothing);
	});

	$('#color_inversion_filter').on('click',function(e){
		invertColors();
	});

	$('#dynamic_matrix_btn').on('click',function(e){
		var dynamic_matrix = getDynamicMatrix();
		boxFiltering(dynamic_matrix);
	});
});
