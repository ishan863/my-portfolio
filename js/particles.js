// ============================================
// Particle System for Hero Background
// ============================================

class ParticleSystem {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.warn('Particles canvas not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.animationId = null;
        
        // Configuration
        this.config = {
            particleCount: this.getParticleCount(),
            particleSize: { min: 1, max: 3 },
            speed: { min: 0.1, max: 0.5 },
            colors: [
                'rgba(30, 64, 175, 0.6)',   // Primary blue
                'rgba(59, 130, 246, 0.6)',  // Accent blue
                'rgba(245, 158, 11, 0.6)',  // Secondary gold
                'rgba(139, 92, 246, 0.6)',  // Purple
                'rgba(16, 185, 129, 0.6)'   // Green
            ],
            connections: {
                enabled: true,
                distance: 120,
                opacity: 0.2
            },
            mouse: {
                radius: 150,
                repel: false,
                attract: true
            },
            responsiveBreakpoints: {
                mobile: 768,
                tablet: 1024
            },
            ...options
        };
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    getParticleCount() {
        const width = window.innerWidth;
        if (width < 768) return 30;      // Mobile
        if (width < 1024) return 60;     // Tablet
        return 100;                      // Desktop
    }
    
    setupCanvas() {
        this.resizeCanvas();
        
        // Set canvas styles
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
    }
    
    resizeCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Update particle count based on new size
        const newCount = this.getParticleCount();
        if (newCount !== this.config.particleCount) {
            this.config.particleCount = newCount;
            this.createParticles();
        }
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(new Particle(this.canvas, this.config));
        }
    }
    
    bindEvents() {
        // Resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.resizeCanvas();
        }, 250));
        
        // Mouse move handler
        this.canvas.parentElement.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        // Mouse leave handler
        this.canvas.parentElement.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
        
        // Visibility change handler (pause when tab is not visible)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });
        
        // Draw connections
        if (this.config.connections.enabled) {
            this.drawConnections();
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const particle1 = this.particles[i];
                const particle2 = this.particles[j];
                
                const distance = this.getDistance(particle1, particle2);
                
                if (distance < this.config.connections.distance) {
                    const opacity = (1 - distance / this.config.connections.distance) * this.config.connections.opacity;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle1.x, particle1.y);
                    this.ctx.lineTo(particle2.x, particle2.y);
                    this.ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    getDistance(particle1, particle2) {
        const dx = particle1.x - particle2.x;
        const dy = particle1.y - particle2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    resume() {
        if (!this.animationId) {
            this.animate();
        }
    }
    
    destroy() {
        this.pause();
        this.particles = [];
        if (this.canvas && this.canvas.parentElement) {
            this.canvas.parentElement.removeChild(this.canvas);
        }
    }
    
    // Utility methods
    debounce(func, wait) {
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
}

// ============================================
// Particle Class
// ============================================
class Particle {
    constructor(canvas, config) {
        this.canvas = canvas;
        this.config = config;
        
        this.reset();
        
        // Particle properties
        this.size = this.randomBetween(config.particleSize.min, config.particleSize.max);
        this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
        this.speed = this.randomBetween(config.speed.min, config.speed.max);
        
        // Movement properties
        this.vx = (Math.random() - 0.5) * this.speed;
        this.vy = (Math.random() - 0.5) * this.speed;
        
        // Original position for mouse interaction
        this.originalX = this.x;
        this.originalY = this.y;
        
        // Animation properties
        this.opacity = Math.random() * 0.8 + 0.2;
        this.opacityDirection = Math.random() > 0.5 ? 1 : -1;
        
        // Floating animation
        this.floatOffset = Math.random() * Math.PI * 2;
        this.floatSpeed = this.randomBetween(0.005, 0.02);
        this.floatAmplitude = this.randomBetween(0.5, 2);
    }
    
    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
    }
    
    update(mouse) {
        // Update original position
        this.originalX += this.vx;
        this.originalY += this.vy;
        
        // Wrap around edges
        if (this.originalX < 0) this.originalX = this.canvas.width;
        if (this.originalX > this.canvas.width) this.originalX = 0;
        if (this.originalY < 0) this.originalY = this.canvas.height;
        if (this.originalY > this.canvas.height) this.originalY = 0;
        
        // Set current position to original
        this.x = this.originalX;
        this.y = this.originalY;
        
        // Add floating animation
        this.floatOffset += this.floatSpeed;
        this.y += Math.sin(this.floatOffset) * this.floatAmplitude;
        
        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.config.mouse.radius) {
                const force = (this.config.mouse.radius - distance) / this.config.mouse.radius;
                const angle = Math.atan2(dy, dx);
                
                if (this.config.mouse.attract) {
                    this.x += Math.cos(angle) * force * 5;
                    this.y += Math.sin(angle) * force * 5;
                } else if (this.config.mouse.repel) {
                    this.x -= Math.cos(angle) * force * 10;
                    this.y -= Math.sin(angle) * force * 10;
                }
            }
        }
        
        // Update opacity for twinkling effect
        this.opacity += this.opacityDirection * 0.01;
        if (this.opacity <= 0.2 || this.opacity >= 1) {
            this.opacityDirection *= -1;
        }
        
        // Boundary check after mouse interaction
        if (this.x < 0 || this.x > this.canvas.width || 
            this.y < 0 || this.y > this.canvas.height) {
            this.x = this.originalX;
            this.y = this.originalY;
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        // Set particle properties
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        
        // Draw particle with glow effect
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 2
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        
        // Draw main particle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add subtle glow
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.size * 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }
}

// ============================================
// Alternative Simple Particle System
// ============================================
class SimpleParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.createSimpleParticles();
        this.animate();
    }
    
    setupCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        window.addEventListener('resize', () => {
            const rect = this.canvas.parentElement.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
        });
    }
    
    createSimpleParticles() {
        const particleCount = window.innerWidth < 768 ? 20 : 50;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// Initialize Particle System
// ============================================
function initParticleSystem() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        console.log('Particle system disabled due to user preference for reduced motion');
        return;
    }
    
    // Check device capabilities
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    const isMobile = window.innerWidth <= 768;
    
    try {
        if (isLowEndDevice || isMobile) {
            // Use simple particle system for low-end devices
            window.particleSystem = new SimpleParticleSystem('particles-canvas');
        } else {
            // Use full particle system for capable devices
            window.particleSystem = new ParticleSystem('particles-canvas', {
                particleCount: 80,
                connections: {
                    enabled: true,
                    distance: 100,
                    opacity: 0.15
                },
                mouse: {
                    radius: 120,
                    attract: true,
                    repel: false
                }
            });
        }
        
        console.log('✨ Particle system initialized');
    } catch (error) {
        console.warn('Failed to initialize particle system:', error);
        
        // Fallback: hide canvas if particles fail
        const canvas = document.getElementById('particles-canvas');
        if (canvas) {
            canvas.style.display = 'none';
        }
    }
}

// ============================================
// Theme Integration
// ============================================
function updateParticlesForTheme(theme) {
    if (!window.particleSystem || !window.particleSystem.config) return;
    
    const darkColors = [
        'rgba(59, 130, 246, 0.4)',   // Blue
        'rgba(139, 92, 246, 0.4)',   // Purple
        'rgba(16, 185, 129, 0.4)',   // Green
        'rgba(245, 158, 11, 0.4)',   // Gold
        'rgba(236, 72, 153, 0.4)'    // Pink
    ];
    
    const lightColors = [
        'rgba(30, 64, 175, 0.6)',    // Primary blue
        'rgba(59, 130, 246, 0.6)',   // Accent blue
        'rgba(245, 158, 11, 0.6)',   // Secondary gold
        'rgba(139, 92, 246, 0.6)',   // Purple
        'rgba(16, 185, 129, 0.6)'    // Green
    ];
    
    const colors = theme === 'dark' ? darkColors : lightColors;
    
    if (window.particleSystem.particles) {
        window.particleSystem.particles.forEach(particle => {
            particle.color = colors[Math.floor(Math.random() * colors.length)];
        });
    }
}

// ============================================
// Auto-initialize when DOM is ready
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticleSystem);
} else {
    initParticleSystem();
}

// ============================================
// Export for external use
// ============================================
window.ParticleSystem = ParticleSystem;
window.SimpleParticleSystem = SimpleParticleSystem;
window.initParticleSystem = initParticleSystem;
window.updateParticlesForTheme = updateParticlesForTheme;