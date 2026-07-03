// ==========================================
// MAIN.JS
// MS-CIT Portfolio Hub
// Common JavaScript
// ==========================================

// ================================
// MOBILE MENU
// ================================

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector("#navLinks");

if (menuBtn && navLinks) {

    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

}

// ================================
// ACTIVE NAV LINK
// ================================

const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll(".nav-links a").forEach(link => {

    if (link.getAttribute("href") === currentPage) {

        link.classList.add("active");

    }

});

// ================================
// SCROLL TO TOP
// ================================

window.addEventListener("load", () => {
    window.scrollTo(0, 0);
});