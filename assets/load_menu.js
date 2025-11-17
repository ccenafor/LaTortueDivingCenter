document.addEventListener('DOMContentLoaded', function() {
    fetch('menu.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('menu-placeholder').innerHTML = data;
            document.body.classList.add('has-fixed-nav');

            // Re-attach event listeners for the burger menu after content is loaded
            var t = document.getElementById('menuToggle');
            var p = document.getElementById('mpanel');
            if (t && p) {
                t.addEventListener('click', function() {
                    p.classList.toggle('open');
                });
                p.querySelectorAll('a').forEach(function(a) {
                    a.addEventListener('click', function() {
                        p.classList.remove('open');
                    });
                });
            }

            // Set active class for current page
            var path = window.location.pathname.split("/").pop();
            if (path === "") {
                path = "index.html";
            }
            var navLinks = document.querySelectorAll('.nav-links a, .mpanel .links a');
            navLinks.forEach(function(link) {
                if (link.getAttribute('href') === path) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
            
            var header = document.querySelector('header.nav');
            function updateNavState() {
                if (!header) return;
                if (window.scrollY > 90) {
                    header.classList.remove('nav-transparent');
                } else {
                    header.classList.add('nav-transparent');
                }
            }
            updateNavState();
            window.addEventListener('scroll', updateNavState);
        })
        .catch(error => console.error('Error loading menu:', error));
});