$(function() {

	var width = $('#initial_canvas').width();
	var height = $('#initial_canvas').height();

	var selectArea = [0,0,width,height];

	var getPixel = function(pos,data){
		
		var pixel = [];
		for(var i=3; i>=0; i--){
			pixel.push(data[pos+i]);
		}
		return pixel;
	};

	var putPixel = function(pos,pixel,data){
		for(var i=0; i<3; i++){
			data[pos+i] = pixel[i];
		}

		return data;
	}

	function loadImage(inputOrigin,e){

		var file = e.target.files[0],
			imageType = /image.*/;

		if (!file.type.match(imageType))
			return;

		var reader = new FileReader();
		reader.onload = function(e){
			var $img = $('<img>', { src: e.target.result});
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
		loadImage('#initial_canvas2',e,"");       
	});

	var hidden_tools = function(){
		$("#tools_filters").addClass("hidden");
		$("#tools_crop").addClass("hidden");
		$("#tools_addImages").addClass("hidden");
		$("#tools_subImages").addClass("hidden");
		$("#tools_blendImages").addClass("hidden");
		$("#tools_resize").addClass("hidden");
		$("#tools_scale").addClass("hidden");
	};

	var hidden_secondInput = function(){
		$("#second_input").addClass("hidden");
		$("#second_canvas").addClass("hidden");
	};

	var show_secondInput = function(){
		$("#second_input").removeClass();
		$("#second_canvas").removeClass();
	};

	$("#tools_control").change(function(e){
		var tool = $("#tools_control").val();
		hidden_tools();
		show_secondInput();
		hidden_secondInput();
		
		switch(tool){
			case "filters":
				$("#tools_filters").removeClass();
				break;
			case "cropImage":
				$("#tools_crop").removeClass();
				break;
			case "addImages":
				show_secondInput();
				$("#tools_addImages").removeClass();
				break;
			case "subImages":
				show_secondInput();
				$("#tools_subImages").removeClass();
				break;
			case "blendImages":
				show_secondInput();
				$("#tools_blendImages").removeClass();
				break;
			case "resizeImage":
				$("#tools_resize").removeClass();
				break;
			case "scaleImage":
				$("#tools_scale").removeClass();
				break;
		}
	});

	var invertColors = function() {

		var initial_canvas = $('#initial_canvas')[0].getContext('2d');
		var result_canvas = $('#result_canvas')[0].getContext('2d');
		result_canvas.clearRect(0,0,width,height);

    	var totalImageData = initial_canvas.getImageData(0,0,width,height);
    	var initialImageData = initial_canvas.getImageData(selectArea[0],selectArea[1],selectArea[2],selectArea[3]);
    	var finalImageData = result_canvas.getImageData(selectArea[0],selectArea[1],selectArea[2],selectArea[3]);

		for (var i = 0; i < finalImageData.data.length; i+=4) {
			finalImageData.data[i] = 255 - initialImageData.data[i];
			finalImageData.data[i+1] = 255 - initialImageData.data[i+1];
			finalImageData.data[i+2] = 255 - initialImageData.data[i+2];
			finalImageData.data[i+3] = 255;
		};

		result_canvas.putImageData(totalImageData,0,0);
		result_canvas.putImageData(finalImageData,selectArea[0],selectArea[1]);

	};

	var blackNwhite = function() {
		var initial_canvas = $('#initial_canvas')[0].getContext('2d');
		var result_canvas = $('#result_canvas')[0].getContext('2d');
		result_canvas.clearRect(0,0,width,height);

    	var totalImageData = initial_canvas.getImageData(0,0,width,height);
    	var initialImageData = initial_canvas.getImageData(selectArea[0],selectArea[1],selectArea[2],selectArea[3]);
    	var finalImageData = result_canvas.getImageData(selectArea[0],selectArea[1],selectArea[2],selectArea[3]);

		for (var i = 0; i < finalImageData.data.length; i+=4) {
			//RED=30%, GREEN=59% and BLUE=11%
			var d = initialImageData.data[i]*0.3 + initialImageData.data[i+1]*0.59 + initialImageData.data[i+2]*0.11;
			finalImageData.data[i] = d;
			finalImageData.data[i+1] = d;
			finalImageData.data[i+2] = d;
			finalImageData.data[i+3] = 255;
		};

		result_canvas.putImageData(totalImageData,0,0);
		result_canvas.putImageData(finalImageData,selectArea[0],selectArea[1]);
	};

	var sepia = function() {
		var initial_canvas = $('#initial_canvas')[0].getContext('2d');
		var result_canvas = $('#result_canvas')[0].getContext('2d');
		result_canvas.clearRect(0,0,width,height);

    	var totalImageData = initial_canvas.getImageData(0,0,width,height);
    	var initialImageData = initial_canvas.getImageData(selectArea[0],selectArea[1],selectArea[2],selectArea[3]);
    	var finalImageData = result_canvas.getImageData(selectArea[0],selectArea[1],selectArea[2],selectArea[3]);

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

		result_canvas.putImageData(totalImageData,0,0);
		result_canvas.putImageData(finalImageData,selectArea[0],selectArea[1]);
	};

	var addImage = function() {
		var initial_canvas = $('#initial_canvas')[0].getContext('2d');
		var initial_canvas2 = $('#initial_canvas2')[0].getContext('2d');
		var result_canvas = $('#result_canvas')[0].getContext('2d');

    	var initialImageData = initial_canvas.getImageData(0,0,width,height);
    	var finalImageData = initial_canvas2.getImageData(0,0,width,height);

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

	var subImage = function() {
		var initial_canvas = $('#initial_canvas')[0].getContext('2d');
		var initial_canvas2 = $('#initial_canvas2')[0].getContext('2d');
		var result_canvas = $('#result_canvas')[0].getContext('2d');

    	var initialImageData = initial_canvas.getImageData(0,0,width,height);
    	var finalImageData = initial_canvas2.getImageData(0,0,width,height);

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


	var boxFiltering = function(kernel,lineSize) {

        if(lineSize%2 == 0 || kernel.length != (lineSize*lineSize)) return;

		var initial_canvas = $('#initial_canvas')[0].getContext('2d');
		var result_canvas = $('#result_canvas')[0].getContext('2d');
		
		result_canvas.clearRect(0,0,width,height);

		var denominator = 0;
		for(var k=0; k<kernel.length; k++) denominator += kernel[k];
		if(denominator == 0) denominator = 1;

		var initialImageData = initial_canvas.getImageData(0,0,width,height);

		result_canvas.putImageData(initialImageData,0,0);
		result_canvas.clearRect(selectArea[0],selectArea[1],selectArea[2],selectArea[3]);
		
		var finalImageData = result_canvas.getImageData(0,0,width,height);

        var halfLineSize = (lineSize/2)|0;
        var temp1 = 0;
        var temp2 = 0;

		for(var l=selectArea[1]; l<selectArea[3]; l++) {
			for(var c=selectArea[0]; c<selectArea[2]; c++) {
                
				finalImageData.data[4*(c+(l*width))+3] = 255;

				var red = 0, green = 0, blue = 0;
                var partialWeight = 0;
				for (var k=0; k<kernel.length; k++) {
					var x = c, y = l;

                    temp1 = (k/lineSize)|0; 
					if(temp1 < halfLineSize) y -= halfLineSize - temp1;
					else if(temp1 > halfLineSize) y += temp1 - halfLineSize;

                    temp2 = k%lineSize;
					if(temp2 < halfLineSize) x -= halfLineSize - temp2;
					else if(temp2 > halfLineSize) x += temp2 - halfLineSize;

                    if(x < 0 || x >= width || y < 0 || y >= height ){
                        partialWeight += kernel[k];   
                        continue;
                    }

					var r = initialImageData.data[4*(x+(y*width))];
					var g = initialImageData.data[4*(x+(y*width))+1];
					var b = initialImageData.data[4*(x+(y*width))+2];

					red += r * kernel[k];
					green += g * kernel[k];
					blue += b * kernel[k];
				};

				finalImageData.data[4*(c+(l*width))] = red / (denominator-partialWeight);
				finalImageData.data[4*(c+(l*width))+1] = green / (denominator-partialWeight);
				finalImageData.data[4*(c+(l*width))+2] = blue / (denominator-partialWeight);
				
			};
		};

		result_canvas.putImageData(finalImageData,0,0);

	};

	var boxFiltering2Kernels = function(kernel1, kernel2,lineSize) {

		var initial_canvas = $('#initial_canvas')[0].getContext('2d');
		var result_canvas = $('#result_canvas')[0].getContext('2d');
		
		result_canvas.clearRect(0,0,width,height);

		var denominator1 = 0, denominator2 = 0;
		for(var k=0; k<kernel1.length; k++) denominator1 += kernel1[k];
		if(denominator1 == 0) denominator1 = 1;

		for(var k=0; k<kernel2.length; k++) denominator2 += kernel2[k];
		if(denominator2 == 0) denominator2 = 1;

		var initialImageData = initial_canvas.getImageData(0,0,width,height);
		var finalImageData = result_canvas.getImageData(0,0,width,height);

		var halfLineSize = (lineSize/2)|0;
        var temp1 = 0;
        var temp2 = 0;

		for(var l=1; l<height-1; l++) {
			for(var c=1; c<width-1; c++) {
		
				finalImageData.data[4*(c+(l*width))+3] = 255;

				var red1 = 0, green1 = 0, blue1 = 0;
				var red2 = 0, green2 = 0, blue2 = 0;
                var partialWeight1 = 0;
                var partialWeight2 = 0;
				for (var k=0; k<kernel1.length; k++) {
					var x = c, y = l;

					temp1 = (k/lineSize)|0; 
					if(temp1 < halfLineSize) y -= halfLineSize - temp1;
					else if(temp1 > halfLineSize) y += temp1 - halfLineSize;

                    temp2 = k%lineSize;
					if(temp2 < halfLineSize) x -= halfLineSize - temp2;
					else if(temp2 > halfLineSize) x += temp2 - halfLineSize;

                    if(x < 0 || x >= width || y < 0 || y >= height ){
                        partialWeight1 += kernel1[k];
                        partialWeight2 += kernel2[k];
                        continue;
                    }

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

				finalImageData.data[4*(c+(l*width))] = Math.round(Math.sqrt(Math.pow(red1 / (denominator1-partialWeight1),2) + Math.pow(red2 / (denominator2-partialWeight2),2)));
				finalImageData.data[4*(c+(l*width))+1] = Math.round(Math.sqrt(Math.pow(green1 / (denominator1-partialWeight1),2) + Math.pow(green2 / (denominator2-partialWeight2),2)));
				finalImageData.data[4*(c+(l*width))+2] = Math.round(Math.sqrt(Math.pow(blue1 / (denominator1-partialWeight1),2) + Math.pow(blue2 / (denominator2-partialWeight2),2)));
				
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

	var blendImage = function(firstWeight, secondWeight){
		if(firstWeight+secondWeight != 1.0) return;

		var initial_canvas = $('#initial_canvas')[0].getContext('2d');
		var initial_canvas2 = $('#initial_canvas2')[0].getContext('2d');
		var result_canvas = $('#result_canvas')[0].getContext('2d');

    	var initialImageData = initial_canvas.getImageData(0,0,width,height);
    	var finalImageData = initial_canvas2.getImageData(0,0,width,height);

		for (var i = 0; i < finalImageData.data.length; i+=4) {

			var d = firstWeight*initialImageData.data[i] + secondWeight*finalImageData.data[i];
			finalImageData.data[i] = Math.max(d,0.0);

			d = firstWeight*initialImageData.data[i+1] + secondWeight*finalImageData.data[i+1];
			finalImageData.data[i+1] = Math.max(d,0.0);

			d = firstWeight*initialImageData.data[i+2] + secondWeight*finalImageData.data[i+2];
			finalImageData.data[i+2] = Math.max(d,0.0);

			finalImageData.data[i+3] = 255;
		};

		result_canvas.putImageData(finalImageData,0,0);
	};

	

	/*var bilinearInterpolation = function(newWidth,newHeight){

		if(newWidth < width || newHeight < height) return;

		var initial_canvas = $('#initial_canvas')[0].getContext('2d');
		var result_canvas = $('#result_canvas')[0].getContext('2d');

    	var initialImageData = initial_canvas.getImageData(0,0,width,height);
    	var finalImageData = result_canvas.createImageData(newWidth,newHeight);

		var col_proportion = newWidth/width;
		var lin_proportion = newHeight/height;

		for(var l=0; l<height-1; l++) {
			for(var c=0; c<width-1; c++) {

				var pixel1 = getPixel(4*(c+(l*width)),initialImageData.data);
				var pixel2 = getPixel(4*(c+1+(l*width)),initialImageData.data);
				var pixel3 = getPixel(4*(c+((l+1)*width)),initialImageData.data);
				var pixel4 = getPixel(4*(c+1+((l+1)*width)),initialImageData.data);

				for(var x=0; x<lin_proportion; x++){
					for(var y=0; y<col_proportion; y++){
						var col = col_proportion*c + y;
						var lin = lin_proportion*l + x;

						if(col < 0 || col >= newWidth || lin < 0 || lin >= newHeight ) continue;

						var pos = 4*(width*lin + col);

						var p1 = y*(1/col_proportion);
						var p2 = 1 - p1;
						var p3 = x*(1/lin_proportion);
						var p4 = 1 - p3;

						var inter1 = [0,0,0,0];
						inter1[0] = p2*pixel1[0] + p1*pixel2[0];
						inter1[1] = p2*pixel1[1] + p1*pixel2[1];
						inter1[2] = p2*pixel1[2] + p1*pixel2[2];
						
						var inter2 = [0,0,0,0];
						inter2[0] = p2*pixel3[0] + p1*pixel4[0];
						inter2[1] = p2*pixel1[1] + p1*pixel2[1];
						inter2[2] = p2*pixel1[2] + p1*pixel2[2];
						
						var inter3 = [0,0,0,0];
						inter3[0] = p4*inter1[0] + p3*inter2[0];
						inter3[1] = p4*inter1[1] + p3*inter2[1];
						inter3[2] = p4*inter1[2] + p3*inter2[2];

						inter3[0] = Math.round(inter3[0]);
						inter3[1] = Math.round(inter3[1]);
						inter3[2] = Math.round(inter3[2]);
						
						finalImageData.data[pos] = inter3[0];
						finalImageData.data[pos+1] = inter3[1];
						finalImageData.data[pos+2] = inter3[2];
						finalImageData.data[pos+3] = 255;
						
					}
				}
			}
		}
		
		result_canvas.putImageData(finalImageData,0,0);
	};*/

	var getSelectionBox = function(img,selection){

		console.log('width: ' + selection.width + '; height: ' + selection.height);
		selectArea[0] = selection.x1;
		selectArea[1] = selection.y1;
		selectArea[2] = selection.width;
		selectArea[3] = selection.height;

		if( selectArea[2] == 0 || selectArea[3] == 0 ) selectArea = [0,0,width,height];

		console.log("select area: "+selectArea);
	};

	$('#initial_canvas').imgAreaSelect({
        handles: true,
        onSelectEnd: getSelectionBox
    });

	$('#initial_canvas2').imgAreaSelect({
        handles: true,
        onSelectEnd: getSelectionBox
    });

	$('#blur_filter').on('click',function(e){
		var size = parseInt($('#convolutionSize').val());
		var blur = [];
		half = size*size/2|0;
		for(var k=0; k<(size*size); k++){
			if(k == half)blur.push(2);
			else blur.push(1);
		}

		boxFiltering(blur,size);
	});

	var pascalTriangle = function(level){
		
		if(level == 0) return [1];
		
		var list = pascalTriangle(level-1);

		var newList = [1];

		for(var i=0; i<list.length-1; i++){
			var val = list[i] + list[i+1];
			newList.push(val);
		}
		newList.push(1);

		return newList;
	};

	$('#gaussianBlur_filter').on('click',function(e){
		var radius = parseInt($('#gaussian_radius').val());
		if(radius < 1) return;
		
		var size = 2*radius+1;
		var gaussianBlur = [];
		binomium = pascalTriangle(2*radius);
		weight = 0;
		for(var i=0; i<size; i++){
			weight += binomium[i];
		}

		for(var k=0; k<(size*size); k++){
			var val = binomium[k%size]*binomium[(k/size)|0];
			val = val/weight;
			gaussianBlur.push(val);
		};

		boxFiltering(gaussianBlur,size);
	});

	$('#sharpening_filter').on('click',function(e){
		var sharpening = [-1,-1,-1,-1,9,-1,-1,-1,-1];
		boxFiltering(sharpening,3);
	});

	$('#unsharpening_filter').on('click',function(e){
		var unsharpening = [1,4,6,4,1,4,16,24,16,4,6,24,-476,24,6,4,16,24,16,4,1,4,6,4,1];
		boxFiltering(unsharpening,5);
	});

	$('#raised_filter').on('click',function(e){
		var raised = [0,0,-2,0,2,0,1,0,0];
		boxFiltering(raised,3);
	});

	$('#motion_blur_filter').on('click',function(e){
		var motion_blur = [0,0,1,0,0,0,1,0,0];
		boxFiltering(motion_blur,3);
	});

	$('#laplacian_filter').on('click',function(e){
		var laplacian = [-1,-1,-1,-1,8,-1,-1,-1,-1];
		boxFiltering(laplacian,3);
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
		boxFiltering(dynamic_matrix,3);
	});

	$('#crop_btn').on('click',function(e){
		var result_canvas = $('#result_canvas')[0].getContext('2d');
		result_canvas.clearRect(0,0,width,height);
		crop(selectArea[0],selectArea[1],selectArea[2],selectArea[3]);
	});

	$('#sobel_filter').on('click',function(e){
		gx = [-1,0,1,-2,0,2,-1,0,1];
		gy = [1,2,1,0,0,0,-1,-2,-1];
		boxFiltering2Kernels(gx,gy,3);
	});

	$('#addImages_btn').on('click',function(e){
		addImage();
	});

	$('#subImages_btn').on('click',function(e){
		subImage();
	});
	
	$('#firtsImageWeight').change(function(e){
		var first = parseInt($('#firtsImageWeight').val());

		if(first < 0){
			$('#firtsImageWeight').val("0");
			$('#secondImageWeight').val("100");
			return;
		}

		if(first > 100){
			$('#firtsImageWeight').val("100");
			$('#secondImageWeight').val("0");
			return;
		}

		$('#secondImageWeight').val((100-first));

	});

	$('#secondImageWeight').change(function(e){
		var second = parseInt($('#secondImageWeight').val());

		if(second < 0){
			$('#firtsImageWeight').val("100");
			$('#secondImageWeight').val("0");
			return;
		}

		if(second > 100){
			$('#firtsImageWeight').val("0");
			$('#secondImageWeight').val("100");
			return;
		}

		$('#firtsImageWeight').val((100-second));
	});

	$('#blendImages_btn').on('click',function(e){
		var firstWeight = $('#firtsImageWeight').val();
		var secondWeight = $('#secondImageWeight').val();

		firstWeight = parseFloat(firstWeight)/100;
		secondWeight = parseFloat(secondWeight)/100;

		if(firstWeight < 0.0 || firstWeight > 1.0 || secondWeight < 0.0 || secondWeight > 1.0) return;

		blendImage(firstWeight,secondWeight);
	});
});
