document.addEventListener('DOMContentLoaded', function() {
    // Page loader
    const pageLoader = document.getElementById('pageLoader');
    
    // Hide loader after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            pageLoader.classList.add('hidden');
        }, 800);
    });
    
    // Fallback: hide loader after 3 seconds if load event doesn't fire
    setTimeout(() => {
        pageLoader.classList.add('hidden');
    }, 3000);
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

    // Scroll progress indicator and navigation highlighting
    const scrollProgress = document.getElementById('scrollProgress');
    
    window.addEventListener('scroll', function() {
        // Update scroll progress
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
        
        // Navigation highlighting
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
        
        // Parallax effect for video background
        const video = document.getElementById('videoPlayer');
        if (video) {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            video.style.transform = `translate(-50%, -50%) translateY(${parallax}px)`;
        }
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
        updateGitHubStatsTheme('light');
    } else {
        themeToggle.textContent = '🌙';
        themeToggle.setAttribute('title', 'Switch to Light Mode');
        updateGitHubStatsTheme('dark');
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
                updateGitHubStatsTheme('light');
                console.log('Switched to light theme');
                
            } else {
                themeToggle.textContent = '🌙';
                themeToggle.setAttribute('title', 'Switch to Light Mode');
                localStorage.setItem('theme', 'dark');
                updateGitHubStatsTheme('dark');
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

    // Initialize typing animation
    initTypeWriter();
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

// GitHub stats theme updater with fallbacks
function updateGitHubStatsTheme(theme) {
    const username = 'd-malhotra2020';
    const accentColor = '4CAF50';
    const lightAccentColor = '2E7D32';
    
    // Get all GitHub stat images
    const githubHeatmap = document.querySelector('.github-heatmap');
    const githubStreak = document.querySelector('.github-streak');
    const githubLanguages = document.querySelector('.github-languages');
    
    if (theme === 'light') {
        // Light theme URLs with better parameters
        if (githubHeatmap) {
            githubHeatmap.src = `https://ghchart.rshah.org/${lightAccentColor}/${username}`;
            githubHeatmap.onerror = () => handleImageError(githubHeatmap, 'heatmap');
        }
        if (githubStreak) {
            // Using a more reliable streak service
            githubStreak.src = `https://streak-stats.demolab.com/?user=${username}&theme=default&background=ffffff&stroke=${lightAccentColor}&ring=${lightAccentColor}&fire=${lightAccentColor}&currStreakLabel=333333&sideLabels=333333&currStreakNum=${lightAccentColor}&sideNums=${lightAccentColor}&dates=666666`;
            githubStreak.onerror = () => handleImageError(githubStreak, 'streak');
        }
        if (githubLanguages) {
            githubLanguages.src = `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=default&hide_border=false&bg_color=ffffff&text_color=333333&title_color=${lightAccentColor}&border_color=${lightAccentColor}&cache_seconds=86400`;
            githubLanguages.onerror = () => handleImageError(githubLanguages, 'languages');
        }
    } else {
        // Dark theme URLs with better parameters
        if (githubHeatmap) {
            githubHeatmap.src = `https://ghchart.rshah.org/${accentColor}/${username}`;
            githubHeatmap.onerror = () => handleImageError(githubHeatmap, 'heatmap');
        }
        if (githubStreak) {
            // Using a more reliable streak service
            githubStreak.src = `https://streak-stats.demolab.com/?user=${username}&theme=dark&background=0d1117&stroke=${accentColor}&ring=${accentColor}&fire=${accentColor}&currStreakLabel=ffffff&sideLabels=ffffff&currStreakNum=${accentColor}&sideNums=${accentColor}&dates=cccccc`;
            githubStreak.onerror = () => handleImageError(githubStreak, 'streak');
        }
        if (githubLanguages) {
            githubLanguages.src = `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=dark&hide_border=false&bg_color=0d1117&text_color=ffffff&title_color=${accentColor}&border_color=${accentColor}&cache_seconds=86400`;
            githubLanguages.onerror = () => handleImageError(githubLanguages, 'languages');
        }
    }
}

// Handle image loading errors with fallbacks
function handleImageError(img, type) {
    const container = img.parentElement;
    const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    
    // Remove broken image
    img.style.display = 'none';
    
    // Create fallback content
    let fallbackContent = '';
    
    switch (type) {
        case 'heatmap':
            fallbackContent = `
                <div class="github-fallback">
                    <div class="fallback-icon">📊</div>
                    <div class="fallback-text">
                        <h5>GitHub Activity</h5>
                        <p>Visit my <a href="https://github.com/d-malhotra2020" target="_blank">GitHub profile</a> to see my contribution history</p>
                    </div>
                </div>
            `;
            break;
        case 'streak':
            fallbackContent = `
                <div class="github-fallback">
                    <div class="fallback-icon">🔥</div>
                    <div class="fallback-text">
                        <h5>Coding Consistency</h5>
                        <p>Regular contributor maintaining consistent development activity</p>
                        <p>Committed to continuous learning and improvement</p>
                    </div>
                </div>
            `;
            break;
        case 'languages':
            fallbackContent = `
                <div class="github-fallback">
                    <div class="fallback-icon">💻</div>
                    <div class="fallback-text">
                        <h5>Programming Languages</h5>
                        <div class="fallback-languages">
                            <span class="lang-tag">Python</span>
                            <span class="lang-tag">JavaScript</span>
                            <span class="lang-tag">HTML/CSS</span>
                            <span class="lang-tag">Java</span>
                        </div>
                    </div>
                </div>
            `;
            break;
    }
    
    container.innerHTML = fallbackContent;
    container.classList.add('fallback-active');
}

// Typing animation for hero subtitle
function initTypeWriter() {
    const typedTextElement = document.getElementById('typed-text');
    const cursor = document.querySelector('.typing-cursor');
    
    if (!typedTextElement) return;
    
    const phrases = [
        'specializes in full-stack development',
        'builds scalable web applications',
        'optimizes system performance',
        'implements AI/ML solutions',
        'architects cloud infrastructure',
        'automates testing pipelines',
        'debugs complex problems',
        'codes in Python & JavaScript'
    ];
    
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let isWaiting = false;
    
    function typeWriter() {
        const currentPhrase = phrases[currentPhraseIndex];
        
        if (isWaiting) {
            // Wait period between phrases
            setTimeout(() => {
                isWaiting = false;
                isDeleting = true;
                typeWriter();
            }, 2000);
            return;
        }
        
        if (!isDeleting) {
            // Typing forward
            if (currentCharIndex < currentPhrase.length) {
                typedTextElement.textContent = currentPhrase.substring(0, currentCharIndex + 1);
                currentCharIndex++;
                setTimeout(typeWriter, 50 + Math.random() * 50); // Variable speed for natural feel
            } else {
                // Finished typing current phrase
                isWaiting = true;
                typeWriter();
            }
        } else {
            // Deleting backwards
            if (currentCharIndex > 0) {
                typedTextElement.textContent = currentPhrase.substring(0, currentCharIndex - 1);
                currentCharIndex--;
                setTimeout(typeWriter, 30); // Faster deletion
            } else {
                // Finished deleting, move to next phrase
                isDeleting = false;
                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                setTimeout(typeWriter, 500); // Brief pause before starting next phrase
            }
        }
    }
    
    // Start the animation after a short delay to allow page to load
    setTimeout(() => {
        typeWriter();
    }, 1000);
}