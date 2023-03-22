// Get the navbar toggler icon element
var navbarToggler = document.querySelector(".navbar-toggler");

// Add a click event listener to the navbar toggler icon
navbarToggler.addEventListener("click", function () {
    // Get the navbar collapse element
    var navbarCollapse = document.querySelector(".navbar-collapse");

    // Toggle the "show" class to show/hide the navbar
    navbarCollapse.classList.toggle("show");
});

// get the navbar element
const navbar = document.querySelector('#navbarNav');

// add a click event listener to the window object
document.addEventListener('click', function (event) {
    // check if the clicked element is inside the navbar
    const isClickInsideNavbar = document.querySelector("body").contains(event.target);

    // if the clicked element is outside the navbar, close the navbar
    if (!isClickInsideNavbar) {
        // close the navbar by toggling the 'show' class
        navbar.classList.remove('show');
    }
});

document.querySelector("body").onselectstart = () => false;