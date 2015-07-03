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

	var boxFiltering = function() {

		var initial_canvas = $('#initial_canvas')[0].getContext('2d');
		var result_canvas = $('#result_canvas')[0].getContext('2d');

		for(var l=0; l<height; l++){
			for(var c=0; c<width; c++){
				var pixel_data = initial_canvas.getImageData(c,l,1,1);
				pixel_data.data[1] = 0;
				//massive processing here.
				result_canvas.putImageData(pixel_data,c,l);
			}
		}
	}

	$('#blur_filter').on('click',function(e){
		boxFiltering();
	});

});
