$(function() {
    $("#theme").change(function() {
        console.log("Changed");
        let theme = $(this).val().trim();
        switch (theme) {
            case "dark":
                $("#navigation-bar").attr("class", "navbar navbar-inverse");
                $("#svgFill").attr("fill", "#111");
                $("body").css("background-color", "#111");
                $("g > text").css("fill", "#EEE");
                $("g > line").css("stroke", "#FFF");                
                break;
            case "light":
                $("#navigation-bar").attr("class", "navbar navbar-default");
                $("#svgFill").attr("fill", "#EEE");
                $("body").css("background-color", "#EEE");
                $("g > text").css("fill", "#000");
                $("g > line").css("stroke", "#000"); 
                break;
            default:
                break;
        }
    });
});