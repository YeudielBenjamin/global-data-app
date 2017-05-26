$(function() {
    $("#theme").change(function() {
        console.log("Changed");
        let theme = $(this).val().trim();
        switch (theme) {
            case "dark":
                $("#navigation-bar").attr("class", "navbar navbar-inverse");
                $("#svgFill").attr("fill", "#111");
                $("body").css("background-color", "#111");
                break;
            case "light":
                $("#navigation-bar").attr("class", "navbar navbar-default");
                $("#svgFill").attr("fill", "#EEE");
                $("body").css("background-color", "#EEE");
                break;
            default:
                break;
        }
    });
});