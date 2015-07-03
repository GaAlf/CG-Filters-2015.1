$(function() {
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

});
