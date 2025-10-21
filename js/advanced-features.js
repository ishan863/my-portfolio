// Advanced Portfolio Features & Enhancements
class PortfolioEnhancer {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupPreloader();
        this.setupScrollProgress();
        this.setupSmoothScroll();
        this.setupLazyLoading();
        this.setupAnimationOptimizations();
        this.setupPerformanceMonitoring();
        
        console.log('🚀 Portfolio Enhancer Activated!');
    }
    
    setupPreloader() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 1000);
        });
    }
    
    setupScrollProgress() {
        // Create scroll progress bar
        const progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6, #10b981);
            z-index: 9999;
            transition: width 0.1s ease;
            box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);
        `;
        document.body.appendChild(progressBar);
        
        // Update progress on scroll
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollTop = window.pageYOffset;
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const scrollPercent = (scrollTop / docHeight) * 100;
                    progressBar.style.width = scrollPercent + '%';
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    setupSmoothScroll() {
        // Enhanced smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    setupLazyLoading() {
        // Enhanced lazy loading for images
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    setupAnimationOptimizations() {
        // Pause animations when not visible
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                } else {
                    entry.target.style.animationPlayState = 'paused';
                }
            });
        });
        
        document.querySelectorAll('[data-aos]').forEach(el => {
            animationObserver.observe(el);
        });
    }
    
    setupPerformanceMonitoring() {
        // Monitor and optimize performance
        if (window.performance && window.performance.memory) {
            setInterval(() => {
                const memory = window.performance.memory;
                const usage = memory.usedJSHeapSize / memory.totalJSHeapSize;
                
                if (usage > 0.8) {
                    // High memory usage - reduce animations
                    document.documentElement.style.setProperty('--animation-speed', '0.5s');
                    console.warn('High memory usage detected - reducing animations');
                }
            }, 10000);
        }
    }
}

// Advanced Typing Animation
class AdvancedTypingAnimation {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.options = {
            typeSpeed: 100,
            deleteSpeed: 50,
            delayBetween: 2000,
            loop: true,
            cursor: '|',
            ...options
        };
        
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        
        this.init();
    }
    
    init() {
        this.element.innerHTML = `<span class="typed-text"></span><span class="cursor">${this.options.cursor}</span>`;
        this.textElement = this.element.querySelector('.typed-text');
        this.cursorElement = this.element.querySelector('.cursor');
        
        // Add cursor animation
        this.cursorElement.style.cssText = `
            animation: blink 1s infinite;
            color: #3b82f6;
        `;
        
        // Add blink animation if not exists
        if (!document.querySelector('#cursor-blink-style')) {
            const style = document.createElement('style');
            style.id = 'cursor-blink-style';
            style.textContent = `
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        this.type();
    }
    
    type() {
        if (this.isPaused) return;
        
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            this.textElement.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
            
            if (this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
                setTimeout(() => this.type(), this.options.delayBetween / 2);
                return;
            }
        } else {
            this.textElement.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
            
            if (this.currentCharIndex === currentText.length) {
                this.isDeleting = true;
                setTimeout(() => this.type(), this.options.delayBetween);
                return;
            }
        }
        
        const speed = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;
        setTimeout(() => this.type(), speed);
    }
    
    pause() {
        this.isPaused = true;
    }
    
    resume() {
        this.isPaused = false;
        this.type();
    }
}

// Interactive Background Effects
class InteractiveBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.mouse = { x: 0, y: 0 };
        this.trails = [];
        
        this.setupCanvas();
        this.addEventListeners();
        this.animate();
    }
    
    setupCanvas() {
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.3;
        `;
        document.body.appendChild(this.canvas);
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            // Add trail point
            this.trails.push({
                x: e.clientX,
                y: e.clientY,
                life: 1,
                color: `hsl(${Date.now() / 10 % 360}, 70%, 60%)`
            });
            
            // Limit trail length
            if (this.trails.length > 20) {
                this.trails.shift();
            }
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw trails
        for (let i = this.trails.length - 1; i >= 0; i--) {
            const trail = this.trails[i];
            trail.life -= 0.05;
            
            if (trail.life <= 0) {
                this.trails.splice(i, 1);
                continue;
            }
            
            this.ctx.beginPath();
            this.ctx.arc(trail.x, trail.y, trail.life * 5, 0, Math.PI * 2);
            this.ctx.fillStyle = trail.color.replace('60%', `${trail.life * 60}%`);
            this.ctx.fill();
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize all enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core enhancements
    new PortfolioEnhancer();
    
    // Initialize typing animation
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        new AdvancedTypingAnimation(typingElement, [
            'AI & Python Developer',
            'Flutter Enthusiast',
            'Automation Creator',
            'Problem Solver',
            'Tech Innovator'
        ]);
    }
    
    // Initialize interactive background (only on desktop)
    if (window.innerWidth > 768) {
        new InteractiveBackground();
    }
    
    console.log('✨ All Portfolio Enhancements Loaded!');
});

// Export for external use
window.PortfolioEnhancers = {
    PortfolioEnhancer,
    AdvancedTypingAnimation,
    InteractiveBackground
};