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

	var boxFiltering = function(kernel) {

		var initial_canvas = $('#initial_canvas')[0].getContext('2d');
		var result_canvas = $('#result_canvas')[0].getContext('2d');

		var denominator = 0;
		for(var k=0; k<kernel.length; k++) denominator += kernel[k];

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

	$('#blur_filter').on('click',function(e){
		smothing = [1,1,1,1,2,1,1,1,1];
		boxFiltering(smothing);
	});

	$('#sharpening_filter').on('click',function(e){
		smothing = [-1,-1,-1,-1,9,-1,-1,-1,-1];
		boxFiltering(smothing);
	});

});
