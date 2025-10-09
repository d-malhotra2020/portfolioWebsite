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
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                // Fallback for browsers that don't support smooth scrolling
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                } else {
                    // Fallback smooth scroll
                    const startingY = window.pageYOffset;
                    const diff = offsetTop - startingY;
                    const duration = 800;
                    let start;
                    
                    function animateScroll(timestamp) {
                        if (!start) start = timestamp;
                        const progress = timestamp - start;
                        const percent = Math.min(progress / duration, 1);
                        
                        window.scrollTo(0, startingY + diff * percent);
                        
                        if (progress < duration) {
                            window.requestAnimationFrame(animateScroll);
                        }
                    }
                    
                    window.requestAnimationFrame(animateScroll);
                }
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
                
                // Fallback for browsers that don't support smooth scrolling
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                } else {
                    // Fallback smooth scroll
                    const startingY = window.pageYOffset;
                    const diff = offsetTop - startingY;
                    const duration = 800;
                    let start;
                    
                    function animateScroll(timestamp) {
                        if (!start) start = timestamp;
                        const progress = timestamp - start;
                        const percent = Math.min(progress / duration, 1);
                        
                        window.scrollTo(0, startingY + diff * percent);
                        
                        if (progress < duration) {
                            window.requestAnimationFrame(animateScroll);
                        }
                    }
                    
                    window.requestAnimationFrame(animateScroll);
                }
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
});