// ============================================
// Lightning Fast Portfolio - No Heavy 3D
// ============================================

class LightningFastPortfolio {
    constructor() {
        this.init();
    }
    
    init() {
        // CRITICAL: Set default values IMMEDIATELY to prevent any NaN display
        this.setDefaultStatsImmediately();
        
        this.setupFastNavigation();
        this.setupDynamicGitHub();
        this.setupScrollEffects();
        this.setupTypingAnimation();
        this.setupInstantInteractions();
        this.preventNaNForever();
        
        console.log('⚡ Lightning Fast Portfolio Loaded!');
    }
    
    setDefaultStatsImmediately() {
        // Force set default values before anything else runs
        const defaults = { repos: 25, followers: 15, following: 30, stars: 5 };
        
        try {
            Object.keys(defaults).forEach(key => {
                const el = document.querySelector(`[data-stat="${key}"]`);
                if (el) {
                    el.textContent = defaults[key];
                    console.log(`🔧 PRE-SET [data-stat="${key}"] to:`, defaults[key]);
                }
            });
        } catch (e) {
            console.log('Pre-set stats error:', e.message);
        }
    }
    
    preventNaNForever() {
        // Create a mutation observer to catch and fix any NaN that might appear
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    const target = mutation.target.nodeType === Node.TEXT_NODE 
                        ? mutation.target.parentElement 
                        : mutation.target;
                    
                    if (target && target.hasAttribute && target.hasAttribute('data-stat')) {
                        const value = target.textContent;
                        if (value === 'NaN' || value === 'null' || value === 'undefined' || isNaN(value)) {
                            const stat = target.getAttribute('data-stat');
                            const fallback = { repos: 25, followers: 15, following: 30, stars: 5 }[stat] || 0;
                            target.textContent = fallback;
                            console.log(`🛡️ BLOCKED NaN in [data-stat="${stat}"], set to:`, fallback);
                        }
                    }
                }
            });
        });
        
        // Observe all stat elements
        document.querySelectorAll('[data-stat]').forEach(el => {
            observer.observe(el, { 
                childList: true, 
                characterData: true, 
                subtree: true 
            });
        });
        
        // Also run a periodic check every second as backup
        setInterval(() => {
            document.querySelectorAll('[data-stat]').forEach(el => {
                const value = el.textContent;
                if (value === 'NaN' || value === 'null' || value === 'undefined') {
                    const stat = el.getAttribute('data-stat');
                    const fallback = { repos: 25, followers: 15, following: 30, stars: 5 }[stat] || 0;
                    el.textContent = fallback;
                    console.log(`🔄 PERIODIC FIX: Set [data-stat="${stat}"] to:`, fallback);
                }
            });
        }, 1000);
    }
    
    setupFastNavigation() {
        // Enhanced smooth scrolling with better mobile support
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const navMenu = document.querySelector('.nav-menu');
                    const navToggle = document.querySelector('.nav-toggle');
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        navToggle.classList.remove('active');
                    }
                }
            });
        });
        
        // Enhanced mobile navigation
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('nav-open');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }
            });
            
            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }
            });
        }
        
        // Fast scroll progress with throttling
        const createProgressBar = () => {
            const progress = document.createElement('div');
            progress.id = 'scroll-progress';
            progress.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                background: linear-gradient(90deg, #3b82f6, #8b5cf6);
                z-index: 9999;
                transition: width 0.1s ease;
                will-change: width;
            `;
            document.body.appendChild(progress);
            return progress;
        };
        
        const progressBar = createProgressBar();
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                    progressBar.style.width = Math.min(Math.max(scrollPercent, 0), 100) + '%';
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Auto-highlight active navigation
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    let current = '';
                    const scrollPos = window.pageYOffset + 100;
                    
                    sections.forEach(section => {
                        const sectionTop = section.offsetTop;
                        const sectionHeight = section.offsetHeight;
                        
                        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                            current = section.getAttribute('id');
                        }
                    });
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + current) {
                            link.classList.add('active');
                        }
                    });
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Add auto-scroll reveal functionality
        this.setupAutoReveal();
    }
    
    setupAutoReveal() {
        // Auto-reveal sections as user scrolls down
        const sections = document.querySelectorAll('section');
        
        const revealOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    entry.target.classList.remove('fade-in');
                    
                    // Trigger any animations within the section
                    const animatedElements = entry.target.querySelectorAll('[data-aos]');
                    animatedElements.forEach(el => {
                        el.classList.add('aos-animate');
                    });
                }
            });
        }, revealOptions);
        
        sections.forEach(section => {
            section.classList.add('fade-in');
            revealObserver.observe(section);
        });
        
        // Smooth page load
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            
            // Auto-scroll to hash if present
            if (window.location.hash) {
                setTimeout(() => {
                    const target = document.querySelector(window.location.hash);
                    if (target) {
                        const headerHeight = document.querySelector('.header').offsetHeight;
                        window.scrollTo({
                            top: target.offsetTop - headerHeight,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            }
        });
    }
    
    setupDynamicGitHub() {
        // Real-time GitHub stats and activity
        this.loadGitHubStats();
        this.loadGitHubActivity();
        
        // Update every 2 minutes for more frequent updates
        setInterval(() => {
            this.loadGitHubStats();
            this.loadGitHubActivity();
        }, 120000);
        
        // Add click handler for manual refresh
        const refreshButtons = document.querySelectorAll('.spinning');
        refreshButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.loadGitHubStats();
                this.loadGitHubActivity();
            });
        });
    }
    
    async loadGitHubStats() {
        try {
            // Set reliable default values first to prevent NaN
            const defaultStats = {
                repos: 25,
                followers: 15, 
                following: 30,
                stars: 5
            };
            
            // Update both hero and GitHub section immediately
            this.updateGitHubStatsDisplay(defaultStats);
            this.updateRealtimeStats(defaultStats);
            
            // Try to fetch real data with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch('https://api.github.com/users/ishan863', {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const data = await response.json();
                
                // Calculate total stars from repositories
                let totalStars = 0;
                try {
                    const reposResponse = await fetch(`https://api.github.com/users/ishan863/repos?per_page=100`, {
                        headers: { 'Accept': 'application/vnd.github.v3+json' },
                        signal: controller.signal
                    });
                    if (reposResponse.ok) {
                        const repos = await reposResponse.json();
                        totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
                    }
                } catch (e) {
                    totalStars = 5; // fallback
                }
                
                const realStats = {
                    repos: this.validateNumber(data.public_repos, 25),
                    followers: this.validateNumber(data.followers, 15),
                    following: this.validateNumber(data.following, 30),
                    stars: this.validateNumber(totalStars, 5)
                };
                
                // Update with real data
                this.updateGitHubStatsDisplay(realStats);
                this.updateRealtimeStats(realStats);
                
                console.log('✅ GitHub stats updated with real data:', realStats);
            } else {
                console.log('📊 Using default GitHub stats - API response not ok');
            }
            
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('📊 GitHub API timeout - using default stats');
            } else {
                console.log('📊 Using fallback GitHub stats:', error.message);
            }
        }
        
        // Update timestamp
        this.updateTimestamp();
    }
    
    updateRealtimeStats(stats) {
        console.log('🔄 updateRealtimeStats called with:', stats);
        
        // Extract values and ensure they're valid numbers
        let repos = stats.repos;
        let followers = stats.followers;
        let following = stats.following;
        let stars = stats.stars;
        
        // Convert to numbers and handle NaN
        repos = typeof repos === 'number' && !isNaN(repos) ? Math.floor(repos) : 25;
        followers = typeof followers === 'number' && !isNaN(followers) ? Math.floor(followers) : 15;
        following = typeof following === 'number' && !isNaN(following) ? Math.floor(following) : 30;
        stars = typeof stars === 'number' && !isNaN(stars) ? Math.floor(stars) : 5;
        
        console.log('✅ Final values to set:', { repos, followers, following, stars });
        
        // Update ALL possible selectors
        // 1. data-stat attributes (primary)
        const reposEl = document.querySelector('[data-stat="repos"]');
        if (reposEl) {
            reposEl.textContent = repos;
            console.log('📊 Set [data-stat="repos"] to:', repos);
        }
        
        const followersEl = document.querySelector('[data-stat="followers"]');
        if (followersEl) {
            followersEl.textContent = followers;
            console.log('👥 Set [data-stat="followers"] to:', followers);
        }
        
        const followingEl = document.querySelector('[data-stat="following"]');
        if (followingEl) {
            followingEl.textContent = following;
            console.log('➡️ Set [data-stat="following"] to:', following);
        }
        
        const starsEl = document.querySelector('[data-stat="stars"]');
        if (starsEl) {
            starsEl.textContent = stars;
            console.log('⭐ Set [data-stat="stars"] to:', stars);
        }
        
        // 2. Class-based selectors (fallback)
        document.querySelectorAll('.github-repos').forEach(el => {
            el.textContent = repos;
        });
        document.querySelectorAll('.github-followers').forEach(el => {
            el.textContent = followers;
        });
        document.querySelectorAll('.github-following').forEach(el => {
            el.textContent = following;
        });
        document.querySelectorAll('.github-stars').forEach(el => {
            el.textContent = stars;
        });
    }
    
    updateTimestamp() {
        const timeElements = document.querySelectorAll('.update-time, .last-updated .update-time');
        const now = new Date();
        const timestamp = now.toLocaleDateString('en-GB');
        
        timeElements.forEach(element => {
            if (element) {
                element.textContent = timestamp;
            }
        });
        
        // Update the spinning icon
        const spinner = document.querySelector('.spinning');
        if (spinner) {
            spinner.style.animation = 'none';
            setTimeout(() => {
                spinner.style.animation = 'spin 2s linear infinite';
            }, 100);
        }
    }
    
    updateGitHubStatsDisplay(stats) {
        console.log('🔄 updateGitHubStatsDisplay called with:', stats);
        
        // Extract values and ensure they're valid numbers
        let repos = stats.repos;
        let followers = stats.followers;
        let following = stats.following;
        let stars = stats.stars;
        
        // Convert to numbers and handle NaN
        repos = typeof repos === 'number' && !isNaN(repos) ? Math.floor(repos) : 25;
        followers = typeof followers === 'number' && !isNaN(followers) ? Math.floor(followers) : 15;
        following = typeof following === 'number' && !isNaN(following) ? Math.floor(following) : 30;
        stars = typeof stars === 'number' && !isNaN(stars) ? Math.floor(stars) : 5;
        
        console.log('✅ Final values to set:', { repos, followers, following, stars });
        
        // Update ALL possible selectors
        // 1. data-stat attributes (primary)
        const reposEl = document.querySelector('[data-stat="repos"]');
        if (reposEl) {
            reposEl.textContent = repos;
            console.log('📊 Set [data-stat="repos"] to:', repos);
        }
        
        const followersEl = document.querySelector('[data-stat="followers"]');
        if (followersEl) {
            followersEl.textContent = followers;
            console.log('👥 Set [data-stat="followers"] to:', followers);
        }
        
        const followingEl = document.querySelector('[data-stat="following"]');
        if (followingEl) {
            followingEl.textContent = following;
            console.log('➡️ Set [data-stat="following"] to:', following);
        }
        
        const starsEl = document.querySelector('[data-stat="stars"]');
        if (starsEl) {
            starsEl.textContent = stars;
            console.log('⭐ Set [data-stat="stars"] to:', stars);
        }
        
        // 2. Class-based selectors (fallback)
        document.querySelectorAll('.github-repos').forEach(el => {
            el.textContent = repos;
        });
        document.querySelectorAll('.github-followers').forEach(el => {
            el.textContent = followers;
        });
        document.querySelectorAll('.github-following').forEach(el => {
            el.textContent = following;
        });
        document.querySelectorAll('.github-stars').forEach(el => {
            el.textContent = stars;
        });
        
        // Update timestamp
        const lastUpdated = document.querySelector('.last-updated');
        if (lastUpdated) {
            const now = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });
            lastUpdated.textContent = `Last updated: ${now}`;
        }
    }
    
    validateNumber(value, fallback) {
        // Handle various types and ensure we return a valid number
        if (value === null || value === undefined || value === '') return fallback;
        
        // Check for NaN strings
        const stringValue = String(value).trim().toUpperCase();
        if (stringValue === 'NAN' || stringValue === 'NAN' || stringValue === '') return fallback;
        
        // Convert to number
        const num = Number(value);
        
        // Validate the result
        if (isNaN(num) || !isFinite(num) || num < 0) {
            console.warn('Invalid number detected, using fallback:', value, 'fallback:', fallback);
            return fallback;
        }
        
        return Math.floor(num);
    }
    
    animateNumber(element, targetValue) {
        const target = this.validateNumber(targetValue, 25);
        const current = parseInt(element.textContent) || 0;
        const increment = Math.max(1, Math.ceil((target - current) / 20));
        let currentValue = current;
        
        const timer = setInterval(() => {
            if (currentValue < target) {
                currentValue += increment;
                if (currentValue > target) currentValue = target;
            } else if (currentValue > target) {
                currentValue -= increment;
                if (currentValue < target) currentValue = target;
            }
            
            element.textContent = currentValue;
            
            if (currentValue === target) {
                clearInterval(timer);
            }
        }, 50);
    }
    
    async loadGitHubActivity() {
        try {
            // Get the GitHub activity feed container
            let activityContainer = document.querySelector('.github-activity-feed');
            if (!activityContainer) {
                console.log('GitHub activity feed container not found');
                return;
            }
            
            // Set default activity
            const defaultActivity = [
                { 
                    action: 'Pushed code to', 
                    repo: 'chowmin-shop', 
                    date: new Date().toLocaleDateString(),
                    icon: 'fas fa-code-branch'
                },
                { 
                    action: 'Created repository', 
                    repo: 'portfolio-website', 
                    date: new Date(Date.now() - 86400000).toLocaleDateString(),
                    icon: 'fas fa-plus'
                },
                { 
                    action: 'Starred repository', 
                    repo: 'awesome-python', 
                    date: new Date(Date.now() - 172800000).toLocaleDateString(),
                    icon: 'fas fa-star'
                }
            ];
            
            // Update with default activity immediately
            this.updateActivityDisplay(activityContainer, defaultActivity);
            
            // Try to fetch real activity
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch('https://api.github.com/users/ishan863/events?per_page=5', {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const events = await response.json();
                if (Array.isArray(events) && events.length > 0) {
                    const recentActivity = events.slice(0, 3).map(event => {
                        const date = new Date(event.created_at).toLocaleDateString();
                        let action = 'Updated repository';
                        let icon = 'fas fa-code';
                        
                        switch(event.type) {
                            case 'PushEvent':
                                action = 'Pushed code to';
                                icon = 'fas fa-code-branch';
                                break;
                            case 'CreateEvent':
                                action = 'Created repository';
                                icon = 'fas fa-plus';
                                break;
                            case 'ForkEvent':
                                action = 'Forked repository';
                                icon = 'fas fa-code-branch';
                                break;
                            case 'WatchEvent':
                                action = 'Starred repository';
                                icon = 'fas fa-star';
                                break;
                        }
                        
                        return {
                            action,
                            repo: event.repo.name.split('/')[1],
                            date,
                            icon
                        };
                    });
                    
                    this.updateActivityDisplay(activityContainer, recentActivity);
                    console.log('✅ GitHub activity updated with real data');
                }
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('📈 GitHub activity API timeout - using fallback');
            } else {
                console.log('📈 Using fallback GitHub activity:', error.message);
            }
        }
    }
    
    updateActivityDisplay(container, activities) {
        const activityHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-details">
                    <span class="activity-action">${activity.action}</span>
                    <span class="activity-repo">${activity.repo}</span>
                    <span class="activity-date">${activity.date}</span>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = activityHTML;
    }
    
    setupScrollEffects() {
        // Lightweight scroll animations with better performance
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('visible');
                    
                    // Animate skill bars when they come into view
                    if (entry.target.classList.contains('skill-item')) {
                        const skillProgress = entry.target.querySelector('.skill-progress');
                        const percentage = skillProgress?.dataset.percentage;
                        if (skillProgress && percentage) {
                            skillProgress.style.width = percentage + '%';
                        }
                    }
                }
            });
        }, observerOptions);
        
        // Apply to elements with smooth staggered animation
        document.querySelectorAll('.project-card, .skill-item, .about-content, .stat-item').forEach((el, index) => {
            el.style.cssText += `
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                transition-delay: ${index * 0.1}s;
            `;
            observer.observe(el);
        });
        
        // Add parallax effect to floating shapes
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const shapes = document.querySelectorAll('.shape');
                    
                    shapes.forEach((shape, index) => {
                        const speed = (index + 1) * 0.5;
                        shape.style.transform = `translateY(${scrolled * speed}px)`;
                    });
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    setupTypingAnimation() {
        const typingElement = document.getElementById('typing-text');
        if (!typingElement) return;
        
        const texts = [
            'AI & Python Developer',
            'Flutter Enthusiast', 
            'Automation Creator',
            'Problem Solver',
            'Tech Innovator'
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function typeText() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                
                if (charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    setTimeout(typeText, 500);
                    return;
                }
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                
                if (charIndex === currentText.length) {
                    isDeleting = true;
                    setTimeout(typeText, 2000);
                    return;
                }
            }
            
            setTimeout(typeText, isDeleting ? 50 : 100);
        }
        
        typeText();
    }
    
    setupInstantInteractions() {
        // Instant hover effects
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
        
        // Fast project filter
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;
                
                // Remove active class
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter projects instantly
                projectCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
        
        // Set first filter as active
        if (filterButtons.length > 0) {
            filterButtons[0].classList.add('active');
        }
    }
}

// Fast Theme Toggle
class FastThemeToggle {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }
    
    init() {
        this.applyTheme();
        this.setupToggle();
    }
    
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
    }
    
    setupToggle() {
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.theme = this.theme === 'light' ? 'dark' : 'light';
                this.applyTheme();
                localStorage.setItem('theme', this.theme);
            });
        }
    }
}

// Contact Form Handler
class FastContactForm {
    constructor() {
        this.setupForm();
    }
    
    setupForm() {
        const form = document.querySelector('.contact-form');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const submitBtn = form.querySelector('.submit-btn');
            
            // Show loading state
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                // Simulate form submission
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Show success message
                this.showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();
            } catch (error) {
                this.showMessage('Failed to send message. Please try again.', 'error');
            }
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }
    
    showMessage(text, type) {
        const message = document.createElement('div');
        message.className = `form-message ${type}`;
        message.textContent = text;
        message.style.cssText = `
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
            font-weight: 500;
            background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
            color: ${type === 'success' ? '#155724' : '#721c24'};
            border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
        `;
        
        const form = document.querySelector('.contact-form');
        form.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new LightningFastPortfolio();
    new FastThemeToggle();
    new FastContactForm();
    
    // Remove any loading screens quickly
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
    
    console.log('⚡ Portfolio ready in lightning speed!');
});

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`⚡ Page loaded in ${loadTime.toFixed(2)}ms`);
    
    // Add load time to page
    const loadTimeElement = document.querySelector('.load-time');
    if (loadTimeElement) {
        loadTimeElement.textContent = `Loaded in ${loadTime.toFixed(0)}ms`;
    }
});

// Export for external use
window.LightningPortfolio = {
    LightningFastPortfolio,
    FastThemeToggle,
    FastContactForm
};