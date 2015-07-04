$(function() {

	var width = $('#initial_canvas').width();
	var height = $('#initial_canvas').height();

	function loadImage(inputOrigin,e){
		var file = e.target.files[0],
			imageType = /image.*/;

		if (!file.type.match(imageType))
			return;

		var reader = new FileReader();
		reader.onload = function(e){
			var $img = $('<img>', { src: e.target.result });
			var canvas = $(inputOrigin)[0];
			var context = canvas.getContext('2d');
			context.clearRect(0,0,width,height);

			$img.load(function() {
				context.drawImage(this, 0, 0);
			});
		};
		reader.readAsDataURL(file);
	}

	$('#input_file').change(function(e) {
		loadImage('#initial_canvas',e);        
	});

	$('#input_file2').change(function(e) {
		loadImage('#initial_canvas2',e);       
	});

	$("#tools_control").change(function(e){
		var tool = $("#tools_control").val();
		if(tool == "operations"){
			$("#second_input").removeClass();
			$("#second_canvas").removeClass();
			$("#tools_operations").removeClass();
			$("#tools_filters").addClass("hidden");
		}
		else if(tool == "filters"){
			$("#second_input").addClass("hidden");
			$("#second_canvas").addClass("hidden");
			$("#tools_filters").removeClass();
			$("#tools_operations").addClass("hidden");
		}
	});

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

	};

	var blackNwhite = function() {
		var initial_canvas = $('#initial_canvas')[0].getContext('2d');
		var result_canvas = $('#result_canvas')[0].getContext('2d');

    	var initialImageData = initial_canvas.getImageData(0,0,width,height);
    	var finalImageData = result_canvas.getImageData(0,0,width,height);

		for (var i = 0; i < finalImageData.data.length; i+=4) {
			//RED=30%, GREEN=59% and BLUE=11%
			var d = initialImageData.data[i]*0.3 + initialImageData.data[i+1]*0.59 + initialImageData.data[i+2]*0.11;
			finalImageData.data[i] = d;
			finalImageData.data[i+1] = d;
			finalImageData.data[i+2] = d;
			finalImageData.data[i+3] = 255;
		};

		result_canvas.putImageData(finalImageData,0,0);
	};

	var sepia = function() {
		var initial_canvas = $('#initial_canvas')[0].getContext('2d');
		var result_canvas = $('#result_canvas')[0].getContext('2d');

    	var initialImageData = initial_canvas.getImageData(0,0,width,height);
    	var finalImageData = result_canvas.getImageData(0,0,width,height);

		for (var i = 0; i < finalImageData.data.length; i+=4) {
			// Red = (r * .393) + (g *.769) + (b * .189)
			// Green = (r * .349) + (g *.686) + (b * .168)
			// Blue = (r * .272) + (g *.534) + (b * .131)
			var d = 255.0;
			d = initialImageData.data[i]*0.393 + initialImageData.data[i+1]*0.769 + initialImageData.data[i+2]*0.189;
			finalImageData.data[i] = Math.min(d,255.0);
			d = initialImageData.data[i]*0.349 + initialImageData.data[i+1]*0.686 + initialImageData.data[i+2]*0.168;
			finalImageData.data[i+1] = Math.min(d,255.0);
			d = initialImageData.data[i]*0.272 + initialImageData.data[i+1]*0.534 + initialImageData.data[i+2]*0.131;
			finalImageData.data[i+2] = Math.min(d,255.0);
			finalImageData.data[i+3] = 255;
		};

		result_canvas.putImageData(finalImageData,0,0);
	};

	var addImage = function(image2) {
		var initial_canvas = $('#initial_canvas')[0].getContext('2d');
		var result_canvas = $('#result_canvas')[0].getContext('2d');

		result_canvas.drawImage(image2,0,0);

    	var initialImageData = initial_canvas.getImageData(0,0,width,height);
    	var finalImageData = result_canvas.getImageData(0,0,width,height);

		for (var i = 0; i < finalImageData.data.length; i+=4) {

			var d = initialImageData.data[i] + finalImageData.data[i];
			finalImageData.data[i] = Math.min(d,255.0);

			d = initialImageData.data[i+1] + finalImageData.data[i+1];
			finalImageData.data[i+1] = Math.min(d,255.0);

			d = initialImageData.data[i+2] + finalImageData.data[i+2];
			finalImageData.data[i+2] = Math.min(d,255.0);

			finalImageData.data[i+3] = 255;
		};

		result_canvas.putImageData(finalImageData,0,0);
	};

	var subImage = function(image2) {
		var initial_canvas = $('#initial_canvas')[0].getContext('2d');
		var result_canvas = $('#result_canvas')[0].getContext('2d');

		result_canvas.drawImage(image2,0,0);

    	var initialImageData = initial_canvas.getImageData(0,0,width,height);
    	var finalImageData = result_canvas.getImageData(0,0,width,height);

		for (var i = 0; i < finalImageData.data.length; i+=4) {

			var d = initialImageData.data[i] - finalImageData.data[i];
			finalImageData.data[i] = Math.max(d,0.0);

			d = initialImageData.data[i+1] - finalImageData.data[i+1];
			finalImageData.data[i+1] = Math.max(d,0.0);

			d = initialImageData.data[i+2] - finalImageData.data[i+2];
			finalImageData.data[i+2] = Math.max(d,0.0);

			finalImageData.data[i+3] = 255;
		};

		result_canvas.putImageData(finalImageData,0,0);
	};

	var crop = function(x,y,dx,dy) {

		var initial_canvas = $('#initial_canvas')[0].getContext('2d');
		var result_canvas = $('#result_canvas')[0].getContext('2d');

    	var finalImageData = initial_canvas.getImageData(x,y,dx,dy);

		result_canvas.putImageData(finalImageData,0,0);

	};


	var boxFiltering = function(kernel) {

		var initial_canvas = $('#initial_canvas')[0].getContext('2d');
		var result_canvas = $('#result_canvas')[0].getContext('2d');
		
		result_canvas.clearRect(0,0,width,height);

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
				};

				finalImageData.data[4*(c+(l*width))] = red / denominator;
				finalImageData.data[4*(c+(l*width))+1] = green / denominator;
				finalImageData.data[4*(c+(l*width))+2] = blue / denominator;
				
			};
		};

		result_canvas.putImageData(finalImageData,0,0);

	};

	var boxFiltering2Kernels = function(kernel1, kernel2) {

		var initial_canvas = $('#initial_canvas')[0].getContext('2d');
		var result_canvas = $('#result_canvas')[0].getContext('2d');
		
		result_canvas.clearRect(0,0,width,height);

		var denominator1 = 0, denominator2 = 0;
		for(var k=0; k<kernel1.length; k++) denominator1 += kernel1[k];

		for(var k=0; k<kernel2.length; k++) denominator2 += kernel2[k];

		var initialImageData = initial_canvas.getImageData(0,0,width,height);
		var finalImageData = result_canvas.getImageData(0,0,width,height);

		for(var l=1; l<height-1; l++) {
			for(var c=1; c<width-1; c++) {
		
				finalImageData.data[4*(c+(l*width))+3] = 255;

				var red1 = 0, green1 = 0, blue1 = 0;
				var red2 = 0, green2 = 0, blue2 = 0;
				for (var k=0; k<kernel1.length; k++) {
					var x = c, y = l;

					if(k/3 == 0) y++;
					else if(k/3 == 2) y--;

					if(k%3 == 0) x--;
					else if(k%3 == 2) x++;

					var r = initialImageData.data[4*(x+(y*width))];
					var g = initialImageData.data[4*(x+(y*width))+1];
					var b = initialImageData.data[4*(x+(y*width))+2];

					red1 += r * kernel1[k];
					green1 += g * kernel1[k];
					blue1 += b * kernel1[k];
					
					red2 += r * kernel2[k];
					green2 += g * kernel2[k];
					blue2 += b * kernel2[k];
				};

				finalImageData.data[4*(c+(l*width))] = Math.round(Math.sqrt(Math.pow(red1 / denominator1,2) + Math.pow(red2 / denominator2,2)));
				finalImageData.data[4*(c+(l*width))+1] = Math.round(Math.sqrt(Math.pow(green1 / denominator1,2) + Math.pow(green2 / denominator2,2)));
				finalImageData.data[4*(c+(l*width))+2] = Math.round(Math.sqrt(Math.pow(blue1 / denominator1,2) + Math.pow(blue2 / denominator2,2)));
				
			};
		};
		
		result_canvas.putImageData(finalImageData,0,0);
	};

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
	};

	var getCropBox = function(){

		var ret = [0,0,width,height];
		var temp = parseInt( $('#crop_x').val() );
		if(temp > ret[0]) ret[0] = temp;
		temp = parseInt( $('#crop_y').val() );
		if(temp > ret[1]) ret[1] = temp;
		temp = parseInt( $('#crop_dx').val() );
		if(temp < ret[2]) ret[2] = temp;
		temp = parseInt( $('#crop_dy').val() );
		if(temp < ret[3]) ret[3] = temp;
		return ret;
	};

	$('#blur_filter').on('click',function(e){
		smoothing = [1,1,1,1,2,1,1,1,1];
		boxFiltering(smoothing);
	});

	$('#sharpening_filter').on('click',function(e){
		smoothing = [-1,-1,-1,-1,9,-1,-1,-1,-1];
		boxFiltering(smoothing);
	});

	$('#raised_filter').on('click',function(e){
		smoothing = [0,0,-2,0,2,0,1,0,0];
		boxFiltering(smoothing);
	});

	$('#motion_blur_filter').on('click',function(e){
		smoothing = [0,0,1,0,0,0,1,0,0];
		boxFiltering(smoothing);
	});

	$('#edge_detection_filter').on('click',function(e){
		smoothing = [-1,-1,-1,-1,8,-1,-1,-1,-1];
		boxFiltering(smoothing);
	});

	$('#color_inversion_filter').on('click',function(e){
		invertColors();
	});

	$('#black_and_white_filter').on('click',function(e){
		blackNwhite();
	});

	$('#sepia_filter').on('click',function(e){
		sepia();
	});

	$('#dynamic_matrix_btn').on('click',function(e){
		var dynamic_matrix = getDynamicMatrix();
		boxFiltering(dynamic_matrix);
	});

	$('#crop_btn').on('click',function(e){
		var crop_box = getCropBox();
		crop(crop_box[0],crop_box[1],crop_box[2],crop_box[3]);
	});

	$('#sobel_filter').on('click',function(e){
		gx = [-1,0,1,-2,0,2,-1,0,1];
		gy = [1,2,1,0,0,0,-1,-2,-1];
		boxFiltering2Kernels(gx,gy);
	});
});
