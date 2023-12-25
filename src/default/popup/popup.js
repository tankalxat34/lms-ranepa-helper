
var manifestData = chrome.runtime.getManifest();
console.log(manifestData.version)

for (let element of document.querySelectorAll(".full-year")) {
    element.innerHTML = new Date().getFullYear()
}

for (let element of document.querySelectorAll(".helper-mark-version")) {
    element.innerHTML = manifestData.version
}


function main() {
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
    window.addEventListener('click', function (event) {
        // check if the clicked element is inside the navbar
        const isClickInsideNavbar = document.querySelector("body").contains(event.target);

        // if the clicked element is outside the navbar, close the navbar
        if (!isClickInsideNavbar) {
            // close the navbar by toggling the 'show' class
            navbar.classList.remove('show');
        }
    });

    document.querySelector("body").onselectstart = () => false;


    const request = new Request("https://api.github.com/repos/tankalxat34/lms-ranepa-helper/commits", {
        method: "GET"
    });

    fetch(request)
        .then(r => r.json())
        .then(data => {
            let element_list = document.querySelector("#helper-latest-changes");
            for (let i = 0; i < 5; i++) {
                element_list.innerHTML += `<li style="list-style-type: none;">${markdown('[**' + new Date(data[i].commit.committer.date).toLocaleString() + '**](' + 'https://github.com/tankalxat34/lms-ranepa-helper/tree/' + data[i].sha + '): ' + data[i].commit.message.split('\n')[0])}</li>`;
            }
        })
}

main();