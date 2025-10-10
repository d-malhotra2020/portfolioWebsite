document.addEventListener('DOMContentLoaded', function() {
    // Video carousel functionality
    var videoPlayer = document.getElementById('videoPlayer');
    var videos = ['VideoFiles/rocket_launch.mp4', 'VideoFiles/satellite.mp4', 'VideoFiles/CIA.mp4',
        'VideoFiles/hubble_telescope.mp4', 'VideoFiles/codingprogramming.mp4', 'VideoFiles/coding.mp4', 'VideoFiles/algorithm.mp4'];
    var currentVideoIndex = 0;

    videoPlayer.src = videos[currentVideoIndex];
    videoPlayer.play();

    videoPlayer.addEventListener('ended', function() {
        currentVideoIndex++;
        if (currentVideoIndex >= videos.length) {
            currentVideoIndex = 0;
        }
        videoPlayer.src = videos[currentVideoIndex];
        videoPlayer.play();
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    console.log('Found nav links:', navLinks.length);
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Nav link clicked:', this.getAttribute('href'));
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            console.log('Target section found:', targetSection);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                // Use browser smooth scroll
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
            } else {
                console.error('Target section not found for:', targetId);
            }
        });
    });

    // CTA button smooth scroll
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                // Custom smooth scroll animation
                const startingY = window.pageYOffset;
                const diff = offsetTop - startingY;
                const duration = 1000;
                let start = null;
                
                function animateScroll(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const percent = Math.min(progress / duration, 1);
                    
                    // Easing function for smoother animation
                    const easeInOutQuart = percent < 0.5 
                        ? 8 * percent * percent * percent * percent 
                        : 1 - 8 * (--percent) * percent * percent * percent;
                    
                    window.scrollTo(0, startingY + diff * easeInOutQuart);
                    
                    if (progress < duration) {
                        window.requestAnimationFrame(animateScroll);
                    }
                }
                
                window.requestAnimationFrame(animateScroll);
            }
        });
    }

    // Navigation highlighting on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.section');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos <= bottom) {
                // Remove active class from all nav links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current section's nav link
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Let the form submit naturally to Formspree
            // Don't prevent default - let it submit
            
            // If form action contains YOUR_FORM_ID, show setup message
            if (contactForm.action.includes('YOUR_FORM_ID')) {
                e.preventDefault();
                alert('Contact form not yet configured. Please set up Formspree first!');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }
            
            // For successful Formspree submission, they'll redirect back
            // We'll handle the success state when they return
        });
        
        // Check if user returned from successful Formspree submission
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
        
        if (urlParams.get('success') === 'true' || hashParams.get('success') === 'true') {
            // Show success message
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';
            
            // Scroll to contact section if not already there
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Reset after 7 seconds
            setTimeout(() => {
                contactForm.style.display = 'flex';
                formSuccess.style.display = 'none';
                contactForm.reset();
                // Clean up URL
                const cleanUrl = window.location.origin + window.location.pathname + '#contact';
                window.history.replaceState({}, document.title, cleanUrl);
            }, 7000);
        }
    }

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check for saved theme preference or default to 'dark'
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        body.classList.add('light-theme');
        themeToggle.textContent = '☀️';
        themeToggle.setAttribute('title', 'Switch to Dark Mode');
    } else {
        themeToggle.textContent = '🌙';
        themeToggle.setAttribute('title', 'Switch to Light Mode');
    }
    
    themeToggle.addEventListener('click', function() {
        // Add switching animation
        themeToggle.classList.add('switching');
        
        // Prevent multiple clicks during animation
        themeToggle.disabled = true;
        
        setTimeout(() => {
            body.classList.toggle('light-theme');
            
            if (body.classList.contains('light-theme')) {
                themeToggle.textContent = '☀️';
                themeToggle.setAttribute('title', 'Switch to Dark Mode');
                localStorage.setItem('theme', 'light');
                console.log('Switched to light theme');
                
            } else {
                themeToggle.textContent = '🌙';
                themeToggle.setAttribute('title', 'Switch to Light Mode');
                localStorage.setItem('theme', 'dark');
                console.log('Switched to dark theme');
            }
            
            // Remove animation class and re-enable button
            setTimeout(() => {
                themeToggle.classList.remove('switching');
                themeToggle.disabled = false;
            }, 200);
        }, 150);
    });

    // Skill bars animation
    function animateSkillBars() {
        const skillFills = document.querySelectorAll('.skill-fill');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillFill = entry.target;
                    const width = skillFill.getAttribute('data-width');
                    
                    // Trigger animation
                    setTimeout(() => {
                        skillFill.style.width = width + '%';
                        skillFill.classList.add('animated');
                    }, 200);
                    
                    // Stop observing once animated
                    observer.unobserve(skillFill);
                }
            });
        }, {
            threshold: 0.5
        });

        skillFills.forEach(skillFill => {
            observer.observe(skillFill);
        });
    }

    // Initialize skill bar animations
    animateSkillBars();

    // Project filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.display = 'block';
                } else {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }
            });
        });
    });

    // Scroll animations with performance optimization
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing once animated to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll(
        '.fade-in, .slide-in-left, .slide-in-right, .scale-in, .stagger-animation'
    );

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Hero section should animate immediately on page load
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('visible');
        }, 500);
    }
});

// Timeline expandable details functionality
function toggleTimelineDetails(button) {
    const timelineContent = button.closest('.timeline-content');
    const details = timelineContent.querySelector('.timeline-details');
    const expandText = button.querySelector('.expand-text');
    const isExpanded = button.classList.contains('expanded');
    
    if (isExpanded) {
        // Collapse
        details.style.display = 'none';
        button.classList.remove('expanded');
        details.classList.remove('expanded');
        expandText.textContent = 'View Details';
    } else {
        // Expand
        details.style.display = 'block';
        button.classList.add('expanded');
        details.classList.add('expanded');
        expandText.textContent = 'Hide Details';
        
        // Smooth scroll animation
        setTimeout(() => {
            details.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 100);
    }
}