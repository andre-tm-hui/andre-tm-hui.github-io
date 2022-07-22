var targetTxt = 'ANDRE HUI';
var alphabetSequence = '-ABCDEFGHIJKLMNOPQRSTUVWXYZ ';

function loadName() {
    var currName = document.getElementById("name").innerHTML;
    if (currName != targetTxt) {
        for (let i = 0; i < targetTxt.length; i++) {
            if (currName.charAt(i) != targetTxt.charAt(i)) {
                var alphaIx = alphabetSequence.indexOf(currName.charAt(i));
                var targAlphaIx = alphabetSequence.indexOf(targetTxt.charAt(i));

                var plusDist = 0;
                var minusDist = 0;

                if (targAlphaIx > alphaIx) {
                    plusDist = targAlphaIx - alphaIx;
                    minusDist = alphaIx + alphabetSequence.length - targAlphaIx;
                } else {
                    plusDist = targAlphaIx - (alphaIx - alphabetSequence.length);
                    minusDist = alphaIx - targAlphaIx;
                }

                if (minusDist < plusDist) {
                    alphaIx--;
                    if (alphaIx < 0) {
                        alphaIx += alphabetSequence.length;
                    }
                } else {
                    alphaIx++;
                }
                document.getElementById("name").innerHTML = currName.substring(0, i) + alphabetSequence.charAt(alphaIx) + currName.substring(i + 1, targetTxt.length);
                break;
            }
        }
    }
    setTimeout(loadName, 65);
};

$(document).ready(function () {
    setTimeout(loadName, 200)
});

(function ($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#sideNav'
  });

    

})(jQuery); // End of use strict