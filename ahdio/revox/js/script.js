$(function() {
    $.get("https://api.github.com/repos/andre-tm-hui/revox/releases/latest", function (json) {
        console.log(json.assets[0].browser_download_url);
        $("#download-button").attr("onclick", "window.location.href='" + json.assets[0].browser_download_url + "'");
    })
})