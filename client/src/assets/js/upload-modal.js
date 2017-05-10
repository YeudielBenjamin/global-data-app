$(function(){
    $("input:file").change(function (){
        var fileSelected = $(this).val() != "";

        if (fileSelected){
            var fileName = $(this).val().split('\\');
            fileName = fileName[fileName.length-1];
        }
        else{
            fileName = "";
        }
        $("#fileName").val(fileName);
        $("#uploadButton").prop("disabled", !fileSelected);
    });
});