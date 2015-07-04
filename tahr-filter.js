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

    	var imageData = initial_canvas.getImageData(0,0,width,height);

		for (var i = 0; i < imageData.data.length; i+=4) {
			imageData.data[i] = 255 - imageData.data[i];
			imageData.data[i+1] = 255 - imageData.data[i+1];
			imageData.data[i+2] = 255 - imageData.data[i+2];
			imageData.data[i+3] = 255;
		};

		result_canvas.putImageData(imageData,0,0);

	}

	var boxFiltering = function(kernel) {

		var initial_canvas = $('#initial_canvas')[0].getContext('2d');
		var result_canvas = $('#result_canvas')[0].getContext('2d');

		var denominator = 0;
		for(var k=0; k<kernel.length; k++) denominator += kernel[k];

		/*
    	var imageData = initial_canvas.getImageData(0,0,width,height);

    	var l = 1, c = 1;

		for (var i = 0; i < imageData.data.length; i+=4) {

			imageData.data[i+3] = 255;

			var red = 0, green = 0, blue = 0;

			imageData.data[i] = 255 - imageData.data[i];
			imageData.data[i+1] = 255 - imageData.data[i+1];
			imageData.data[i+2] = 255 - imageData.data[i+2];

			if(c < width-1) {
				c++;
			}
			else if(l < height-1) {
				c=0;
				l++;
			}
		};

		result_canvas.putImageData(imageData,0,0);
		*/

		for(var l=1; l<height-1; l++){
			for(var c=1; c<width-1; c++){
				var pixel_data = result_canvas.getImageData(c,l,1,1);
				pixel_data.data[3] = 255;
				var red = 0, green = 0, blue = 0;
				for(var k=0; k<kernel.length; k++){
					var x = c, y = l;

					if(k/3 == 0) y++;
					else if(k/3 == 2) y--;

					if(k%3 == 0) x--;
					else if(k%3 == 2) x++;

					var pixel_temp = initial_canvas.getImageData(x,y,1,1);
					red += pixel_temp.data[0]*kernel[k];
					green += pixel_temp.data[1]*kernel[k];
					blue += pixel_temp.data[2]*kernel[k];
					
					//massive processing here.
				}
				pixel_data.data[0] = red / denominator;
				pixel_data.data[1] = green / denominator;
				pixel_data.data[2] = blue / denominator;
				result_canvas.putImageData(pixel_data,c,l);
			}
		}
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
