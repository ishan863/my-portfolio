// ============================================
// Global Variables and Configuration
// ============================================
const config = {
    typewriter: {
        texts: [
            "AI & Python Developer",
            "Flutter Enthusiast", 
            "Automation Creator",
            "Desktop App Developer",
            "Bot Developer",
            "Web Developer"
        ],
        typeSpeed: 100,
        deleteSpeed: 50,
        delayBetweenTexts: 2000
    },
    
    animations: {
        duration: 1000,
        delay: 100,
        easing: 'ease-in-out'
    },
    
    theme: {
        storageKey: 'portfolio-theme',
        default: 'light'
    },
    
    visitorCounter: {
        storageKey: 'portfolio-visitor-count',
        increment: true
    }
};

// ============================================
// DOM Content Loaded Event
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ============================================
// App Initialization
// ============================================
function initializeApp() {
    // Initialize all components
    initPreloader();
    initTheme();
    initNavigation();
    initTypewriter();
    initScrollAnimations();
    initProjectFilters();
    initSkillBars();
    initContactForm();
    initBackToTop();
    initVisitorCounter();
    initStatCounters();
    
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: config.animations.duration,
            delay: config.animations.delay,
            easing: config.animations.easing,
            once: true,
            mirror: false
        });
    }
    
    console.log('🚀 Portfolio initialized successfully!');
}

// ============================================
// Preloader
// ============================================
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 1000);
        });
    }
}

// ============================================
// Theme Management
// ============================================
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Get saved theme or default to system preference
    let currentTheme = localStorage.getItem(config.theme.storageKey);
    if (!currentTheme) {
        currentTheme = prefersDark.matches ? 'dark' : 'light';
    }
    
    // Apply theme
    applyTheme(currentTheme);
    
    // Theme toggle event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Listen for system theme changes
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem(config.theme.storageKey)) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem(config.theme.storageKey, newTheme);
}

function applyTheme(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle?.querySelector('i');
    
    document.documentElement.setAttribute('data-theme', theme);
    
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.content = theme === 'dark' ? '#111827' : '#1e40af';
    }
}

// ============================================
// Navigation
// ============================================
function initNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu?.classList.remove('active');
            navToggle?.classList.remove('active');
        });
    });
    
    // Header scroll effect
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (header) {
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide/show header on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 500) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Active nav link highlighting
    initActiveNavigation();
}

function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                updateActiveNavLink(sectionId);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
    
    function updateActiveNavLink(sectionId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
}

// ============================================
// Typewriter Effect
// ============================================
function initTypewriter() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;
    
    function type() {
        const currentText = config.typewriter.texts[textIndex];
        
        if (isWaiting) {
            setTimeout(type, config.typewriter.delayBetweenTexts);
            isWaiting = false;
            return;
        }
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? config.typewriter.deleteSpeed : config.typewriter.typeSpeed;
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = config.typewriter.delayBetweenTexts;
            isDeleting = true;
            isWaiting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % config.typewriter.texts.length;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    // Start the typewriter effect
    setTimeout(type, 1000);
}

// ============================================
// Scroll Animations
// ============================================
function initScrollAnimations() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.getElementById('header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const parallaxElements = document.querySelectorAll('.hero-content');
    
    if (hero && parallaxElements.length > 0) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${parallax}px)`;
            });
        });
    }
}

// ============================================
// Project Filters
// ============================================
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterButtons.length === 0 || projectCards.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    // Trigger animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ============================================
// Skill Bars Animation
// ============================================
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    if (skillBars.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const percentage = progressBar.getAttribute('data-percentage');
                
                // Animate the progress bar
                setTimeout(() => {
                    progressBar.style.width = percentage + '%';
                }, 200);
                
                observer.unobserve(progressBar);
            }
        });
    }, {
        threshold: 0.5
    });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// ============================================
// Stat Counters Animation
// ============================================
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5
    });
    
    statNumbers.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50; // 50 steps
    const duration = 2000; // 2 seconds
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current);
    }, stepTime);
}

// ============================================
// Contact Form
// ============================================
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        try {
            // Get form data
            const formData = new FormData(contactForm);
            
            // For demo purposes, we'll simulate a successful submission
            // In real implementation, you would send this to your backend or Formspree
            await simulateFormSubmission(formData);
            
            // Show success message
            showNotification('Message sent successfully!', 'success');
            contactForm.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
    
    // Add floating label effect
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on page load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
}

async function simulateFormSubmission(formData) {
    // Simulate API call delay
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form data:', Object.fromEntries(formData));
            resolve();
        }, 2000);
    });
}

// ============================================
// Notification System
// ============================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--bg-color);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-lg);
                box-shadow: var(--shadow-lg);
                padding: 1rem;
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                max-width: 300px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                border-left: 4px solid #10b981;
            }
            
            .notification-error {
                border-left: 4px solid #ef4444;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                margin-left: auto;
                color: var(--text-light);
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove after 5 seconds
    const autoRemove = setTimeout(() => removeNotification(notification), 5000);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    return icons[type] || icons.info;
}

// ============================================
// Back to Top Button
// ============================================
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (!backToTopButton) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// Visitor Counter
// ============================================
function initVisitorCounter() {
    const visitorCountElement = document.getElementById('visitor-count');
    
    if (!visitorCountElement) return;
    
    // Get current count from localStorage
    let count = parseInt(localStorage.getItem(config.visitorCounter.storageKey)) || 0;
    
    // Check if this is a new session (simplified approach)
    const lastVisit = localStorage.getItem('portfolio-last-visit');
    const now = Date.now();
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
    
    if (!lastVisit || (now - parseInt(lastVisit)) > oneHour) {
        count += 1;
        localStorage.setItem(config.visitorCounter.storageKey, count.toString());
        localStorage.setItem('portfolio-last-visit', now.toString());
    }
    
    // Animate the counter
    animateVisitorCounter(visitorCountElement, count);
}

function animateVisitorCounter(element, targetCount) {
    let currentCount = 0;
    const increment = Math.ceil(targetCount / 20);
    const duration = 1000;
    const stepTime = duration / 20;
    
    const timer = setInterval(() => {
        currentCount += increment;
        
        if (currentCount >= targetCount) {
            currentCount = targetCount;
            clearInterval(timer);
        }
        
        element.textContent = currentCount.toLocaleString();
    }, stepTime);
}

// ============================================
// Keyboard Navigation
// ============================================
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // ESC key closes mobile menu
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            
            if (navMenu?.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle?.classList.remove('active');
            }
        }
        
        // Ctrl/Cmd + K for quick navigation (optional feature)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            // You could implement a quick navigation modal here
        }
    });
}

// ============================================
// Performance Optimization
// ============================================
function initPerformanceOptimizations() {
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Debounced scroll handler
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleScroll, 10);
    });
}

function handleScroll() {
    // Optimized scroll handling
    const scrollY = window.pageYOffset;
    
    // Update any scroll-dependent elements here
    updateScrollProgress(scrollY);
}

function updateScrollProgress(scrollY) {
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = (scrollY / documentHeight) * 100;
    
    // You could add a scroll progress indicator here
    document.documentElement.style.setProperty('--scroll-progress', `${scrollProgress}%`);
}

// ============================================
// Error Handling
// ============================================
window.addEventListener('error', (e) => {
    console.error('Portfolio Error:', e.error);
    // You could send error reports to your analytics service here
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    // Handle unhandled promise rejections
});

// ============================================
// Utility Functions
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function isMobile() {
    return window.innerWidth <= 768;
}

function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

function isDesktop() {
    return window.innerWidth > 1024;
}

// ============================================
// Portfolio Analytics (Optional)
// ============================================
function trackEvent(eventName, eventData = {}) {
    // You can implement Google Analytics, Mixpanel, or other analytics here
    console.log('Event tracked:', eventName, eventData);
    
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
}

// Track page interactions
document.addEventListener('click', (e) => {
    const target = e.target;
    
    // Track button clicks
    if (target.matches('.btn')) {
        const buttonText = target.textContent.trim();
        trackEvent('button_click', { button_text: buttonText });
    }
    
    // Track project card clicks
    if (target.closest('.project-card')) {
        const projectTitle = target.closest('.project-card').querySelector('.project-title')?.textContent;
        trackEvent('project_view', { project_name: projectTitle });
    }
    
    // Track social link clicks
    if (target.closest('.social-link')) {
        const platform = target.closest('.social-link').href;
        trackEvent('social_click', { platform });
    }
});

// ============================================
// Export for external use
// ============================================
window.Portfolio = {
    config,
    showNotification,
    trackEvent,
    toggleTheme,
    isMobile,
    isTablet,
    isDesktop
};

// ============================================
// Development helpers
// ============================================
if (process?.env?.NODE_ENV === 'development') {
    // Development-only code
    window.portfolioDebug = {
        config,
        reinitialize: initializeApp,
        testNotification: () => showNotification('Test notification', 'success'),
        testError: () => showNotification('Test error', 'error')
    };
}