var lastScroll = 0;

$(window).on("scroll", (event) => {
    var scroll = $(this).scrollTop();
    if ($('#navbarNav').attr('class').search('show') >= 0) return;
    if (scroll > lastScroll) {
        // downscroll
        $('#navbar').css("top", "-64px");
    } else {
        // upscroll
        $('#navbar').css("top", "0");
    }
    lastScroll = scroll;
})

$(document).on("click", (event) => {
    if ($('#navbarNav').attr('class').search('show') < 0) return;
    console.log($(event.target).attr('class'));
    if ($(event.target).attr('class') != undefined) {
        if ($(event.target).attr('class').search("nav-item") >= 0) return;
        if ($(event.target).attr('class').search("navbar-collapse") >= 0) return;
        if ($(event.target).attr('class').search("navbar-container") >= 0) return;
        if ($(event.target).attr('class').search("navbar") >= 0) return;
    }
    console.log('collapse');
    $('.collapse').collapse('hide');
})