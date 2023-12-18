let prevScrollPos = window.pageYOffset;

window.onscroll = function() {
    let currentScrollPos = window.pageYOffset;

    if (prevScrollPos > currentScrollPos) {
        document.getElementById("sticky-header").style.top = "0";
    } else {
        document.getElementById("sticky-header").style.top = "-100px";
    }

    prevScrollPos = currentScrollPos;
};
