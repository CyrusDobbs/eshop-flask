function getViewport() {
    const width = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
    )
    if (width <= 576) return 1 // 'xs'
    if (width <= 768) return 2 // 'sm'
    if (width <= 992) return 3 // 'md'
    if (width <= 1200) return 4 // 'lg'
    if (width <= 1400) return 5 // 'xl'
    return 6 // 'xxl'
}


//Get the button
let mybutton = document.getElementById("btn-back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (
        (document.body.scrollTop > 20 ||
            document.documentElement.scrollTop > 20) && getViewport() >= 4
    ) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
mybutton.addEventListener("click", backToTop);

function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}