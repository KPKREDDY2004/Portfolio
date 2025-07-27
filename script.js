document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');

    // --- Mobile Navigation Toggle ---
    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon between bars and times (X)
            burgerMenu.querySelector('i').classList.toggle('fa-bars');
            burgerMenu.querySelector('i').classList.toggle('fa-times');
        });

        // Close mobile nav when a link is clicked (for single-page sites)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    burgerMenu.querySelector('i').classList.remove('fa-times');
                    burgerMenu.querySelector('i').classList.add('fa-bars');
                }
            });
        });
    }

    // --- Smooth Scrolling for all internal links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Get the fixed header height to offset scrolling
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset - 20; // -20 for a little extra padding

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll-based Animations (Intersection Observer) ---
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target);
            } else {
                // Optional: Remove 'in-view' class if element scrolls out of view
                // entry.target.classList.remove('in-view');
            }
        });
    }, observerOptions);

    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Initial check for elements already in view on page load
    animateElements.forEach(element => {
        if (element.getBoundingClientRect().top < window.innerHeight) {
            element.classList.add('in-view');
        }
    });

    // --- Load More Projects Functionality ---
    const loadMoreBtn = document.getElementById('load-more-btn');
    // Select all projects that are initially hidden
    const hiddenProjects = document.querySelectorAll('.hidden-project-item');
    const projectsToShowPerClick = 3; // How many projects to show each time "Load More" is clicked
    let currentlyShownProjects = 0; // Keep track of how many are visible

    // Hide all initially hidden projects via JS
    hiddenProjects.forEach(project => {
        project.style.display = 'none';
    });

    // Function to show projects
    const showProjects = (startIndex, count) => {
        for (let i = startIndex; i < Math.min(startIndex + count, hiddenProjects.length); i++) {
            hiddenProjects[i].style.display = 'flex'; // Use flex to maintain column structure inside grid item
            // Re-trigger animation if needed for newly shown items (optional)
            if (!hiddenProjects[i].classList.contains('in-view')) {
                hiddenProjects[i].classList.add('in-view');
            }
        }
    };

    if (loadMoreBtn && hiddenProjects.length > 0) {
        // Show the first set of hidden projects (if any)
        // You might want to show none, or a small number initially
        // showProjects(0, projectsToShowPerClick); // Uncomment to show initial set
        // currentlyShownProjects += projectsToShowPerClick; // Update count

        // Handle button click
        loadMoreBtn.addEventListener('click', () => {
            const startIndex = currentlyShownProjects;
            showProjects(startIndex, projectsToShowPerClick);
            currentlyShownProjects += projectsToShowPerClick;

            // Hide button if all projects are shown
            if (currentlyShownProjects >= hiddenProjects.length) {
                loadMoreBtn.style.display = 'none';
            }
        });

        // If no hidden projects, hide the button initially
        // This makes sure the button doesn't show if you only have the initial 3 projects
        if (hiddenProjects.length === 0) {
             loadMoreBtn.style.display = 'none';
        }
    } else if (loadMoreBtn) {
        // If there are no hidden projects elements at all, ensure the button is hidden
        loadMoreBtn.style.display = 'none';
    }
});