const r = document.querySelector(":root");

// Infinite circular carousel
const carousel = document.querySelector(".carousel");
const items = document.querySelectorAll(".item");
const carouselRadius = 100;
var carouselPositions = [];
var current = 0;

function carouselSet(newPosition) {
    // update the dots, text size
    if (items.length > 1) dots[current].classList.remove("selected-dot");
    items[current].classList.remove("curr");
    items[current].style.setProperty("pointer-events", "none");
    current = newPosition < 0 ? items.length - 1 : newPosition % items.length;
    if (items.length > 1) dots[current].classList.add("selected-dot");
    items[current].classList.add("curr");

    // move and update all items
    for (let i = 0; i < items.length; i++) {
        let itemIndex = (i + current) % items.length;

        items[itemIndex].style.zIndex = Math.round(100 - carouselPositions[i][1] * 100);
        items[itemIndex].style.transform = "translate(" + (-50 + carouselPositions[i][0] * carouselRadius).toString() + "%, -50%)";

        items[itemIndex].style.height = isSmall ? 90 * (1 - carouselPositions[i][1]) + "%" : 80 * (1 - carouselPositions[i][1]) + "%";
        items[itemIndex].style.width = isSmall ? 90 * (1 - carouselPositions[i][1]) + "%" : 600 * (1 - carouselPositions[i][1]) + "px";
        items[itemIndex].style.opacity = 1 - carouselPositions[i][1];
    }

    $('.curr').on('click', () => {
        // redirect somewhere
        console.log('item clicked');
    })

    setTimeout(() => {
        items[current].style.setProperty("pointer-events", "all");
    }, 500);
}

function generateCarouselPositions() {
    // x = rcos0, y = rsin0
    // offset by 3/4 * 2PI, bring circle/oval in range 0 <= y <= 1
    for (let i = 0; i < items.length; i++) {
        let angle = 3 * 2 * Math.PI / 4 + 2 * Math.PI * i / items.length;
        // cache positions for quick access
        carouselPositions.push([Math.cos(angle), 0.3 * Math.sin(angle) + 0.3]);
    }
}

// Drag to change items on carousel
var dragStartPoint = 0;
var carouselDragging = false;

function dragStart(event) {
    dragStartPoint = event.clientX;
    carouselDragging = true;
}

function dragEnd(event) {
    if (!carouselDragging) return;

    // check if drag is intentional
    let diff = dragStartPoint - event.clientX;
    if (Math.abs(diff) < window.innerWidth / 4) return;

    if (diff > 0) {
        carouselSet(current+1);
    } else {
        carouselSet(current-1);
    }
    carouselDragging = false;
}

// Dot indicator for carousel position
const dotTemplate = '<li class="list-inline-item"><i class="dot fa-solid fa-circle"></i></li>'
var dots = [];

function initDots() {
    // generate corresponding number of dots
    let dotsHtml = "";
    for (let i = 0; i < items.length; i++) {
        dotsHtml += dotTemplate;
    }
    $("#carousel-dots").append(dotsHtml);
    // add listener for dragging to next slide
    dots = document.querySelectorAll(".dot");
    $(".dot").on("click", (event) => {
        for (let i = 0; i < dots.length; i++) {
            if (event.target == dots[i]) {
                carouselSet(i);
                break;
            }
        }
    })
}

// Item generator using sql.js and an html template
const itemTemplate = '';

// Resize handling
var isSmall = false;

function onResize() {
    // dynamically change carousel item height when window reaches the bootstrap sm width threshold
    if (window.innerWidth <= 575) {
        r.style.setProperty("--carousel-height", "70vh");
        r.style.setProperty("--carousel-image-height", "50%");
        r.style.setProperty("--align-about-text", "center");
        r.style.setProperty("--align-contact-text", "center");
        isSmall = true;
    } else {
        r.style.setProperty("--carousel-height", "400px");
        r.style.setProperty("--carousel-image-height", "100%");
        r.style.setProperty("--align-about-text", "right");
        r.style.setProperty("--align-contact-text", "left");
        isSmall = false;
    }
    carouselSet(current);
}

// Setup font-size for carousel
function setupCarouselFont() {
    if (items.length <= 1) return;
    let scalar = 0.75 * (1 - carouselPositions[1][1]) / 0.9;
    r.style.setProperty("--bg-h3-size", (parseInt(getComputedStyle(r).getPropertyValue("--curr-h3-size").slice(0, -2)) * scalar).toString() + "em");
    r.style.setProperty("--bg-h4-size", (parseInt(getComputedStyle(r).getPropertyValue("--curr-h4-size").slice(0, -2)) * scalar).toString() + "em");
    r.style.setProperty("--bg-p-size", (parseInt(getComputedStyle(r).getPropertyValue("--curr-p-size").slice(0, -2)) * scalar).toString() + "em");
    r.style.setProperty("--bg-ul-size", (parseInt(getComputedStyle(r).getPropertyValue("--curr-ul-size").slice(0, -2)) * scalar).toString() + "em");
}

// Setup on page-load and various event listeners
$(function() {
    if (items.length > 1) {
        initDots();
    } else {
        $('#carouselNext').hide();
        $('#carouselPrevious').hide();
    }

    generateCarouselPositions();
    setupCarouselFont();
    onResize();
    carouselSet(0);
});

$(window).on("resize", function() {
    onResize();
});

$('#highlights').on("mousedown", (event) => {
    dragStart(event);
});

$('#highlights').on("mouseup", (event) => {
    carouselDragging = false;
});

$('#highlights').on("mousemove", (event) => {
    dragEnd(event);
});

$('#carouselNext').on("click", () => carouselSet(current + 1));
$('#carouselPrevious').on("click", () => carouselSet(current - 1));