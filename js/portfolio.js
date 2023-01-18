const r = document.querySelector(":root");

const carousel = document.querySelector(".carousel");
const items = document.querySelectorAll(".item");
const nextButton = document.getElementById("carouselNext");
const previousButton = document.getElementById("carouselPrevious");

const dotTemplate = '<li class="list-inline-item"><i class="dot fa-solid fa-circle"></i></li>'
var dots = [];

let current = 2;

nextButton.addEventListener("click", () => carouselSet(current + 1));
previousButton.addEventListener("click", () => carouselSet(current - 1));

function carouselSet(newPosition) {
    dots[current].classList.remove("selected-dot");
    current = newPosition < 0 ? items.length - 1 : newPosition % items.length;
    dots[current].classList.add("selected-dot");

    for (let i = 0; i < items.length; i++) {
        let itemIndex = (i + current) % items.length;
        items[itemIndex].classList.remove("curr");
        items[itemIndex].classList.remove("next");
        items[itemIndex].classList.remove("prev");
        items[itemIndex].classList.remove("right");
        items[itemIndex].classList.remove("left");

        if (i <= 0) {
            items[itemIndex].classList.add("curr");
        } else if (i <= 1) {
            items[itemIndex].classList.add("next");
        } else if (i <= items.length / 2) {
            items[itemIndex].classList.add("right");
        } else if (i <= items.length - 2) {
            items[itemIndex].classList.add("left");
        } else {
            items[itemIndex].classList.add("prev");
        }
    }
}

let dragStartPoint = 0;
let carouselDragging = false;

function dragStart(event) {
    dragStartPoint = event.clientX;
    carouselDragging = true;
}

function dragEnd(event) {
    if (!carouselDragging) return;
    carouselDragging = false;

    let diff = dragStartPoint - event.clientX;
    if (Math.abs(diff) < window.innerWidth / 4) return;

    if (diff > 0) {
        carouselSet(current+1);
    } else {
        carouselSet(current-1);
    }
}

function onResize() {
    if (window.innerWidth <= 575) {
        r.style.setProperty("--carousel-height", "70vh");
        r.style.setProperty("--carousel-height-item-curr", "90%");
        r.style.setProperty("--carousel-height-item", "75%");
    } else {
        r.style.setProperty("--carousel-height", "400px");
        r.style.setProperty("--carousel-height-item-curr", "75%");
        r.style.setProperty("--carousel-height-item", "40%");
    }
}

$(function() {
    let dotsHtml = "";
    for (let i = 0; i < items.length; i++) {
        dotsHtml += dotTemplate;
    }
    $("#carousel-dots").append(dotsHtml);
    dots = document.querySelectorAll(".dot");
    $(".dot").on("click", (event) => {
        console.log('click');
        for (let i = 0; i < dots.length; i++) {
            if (event.target == dots[i]) {
                carouselSet(i);
                break;
            }
        }
    })

    carouselSet(0);
    onResize();
});

$(window).on("resize", function() {
    onResize();
});

$('#highlights').on("mousedown", (event) => {
    dragStart(event);
});

$('#highlights').on("mouseup", (event) => {
    dragEnd(event);
});