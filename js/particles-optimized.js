// ============================================
// Ultra-Fast Particle System for Hero Background
// ============================================

class UltraFastParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) {
            console.warn('Particles canvas not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.animationId = null;
        this.isVisible = true;
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticles();
        this.addEventListeners();
        this.animate();
        
        console.log('🚀 Ultra-Fast Particle System Initialized');
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            pointer-events: none;
            will-change: auto;
        `;
    }
    
    createParticles() {
        const particleCount = Math.min(60, Math.floor(this.canvas.width * this.canvas.height / 15000));
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.4 + 0.2,
                color: this.getRandomColor()
            });
        }
    }
    
    getRandomColor() {
        const colors = [
            '59, 130, 246',   // Blue
            '139, 92, 246',   // Purple
            '16, 185, 129',   // Green
            '245, 158, 11',   // Yellow
            '239, 68, 68'     // Red
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });
        
        let mouseTimeout;
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(() => {
                this.mouseX = 0;
                this.mouseY = 0;
            }, 3000);
        });
        
        // Pause when not visible
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
        });
    }
    
    updateParticles() {
        if (!this.isVisible) return;
        
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Mouse interaction (simplified)
            if (this.mouseX > 0 && this.mouseY > 0) {
                const dx = this.mouseX - particle.x;
                const dy = this.mouseY - particle.y;
                const distance = dx * dx + dy * dy; // Skip sqrt for performance
                
                if (distance < 10000) { // 100px squared
                    const force = (10000 - distance) / 10000;
                    particle.vx += dx * force * 0.0005;
                    particle.vy += dy * force * 0.0005;
                }
            }
            
            // Boundary wrapping
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Velocity damping
            particle.vx *= 0.998;
            particle.vy *= 0.998;
        }
    }
    
    drawParticles() {
        // Clear canvas efficiently
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Batch drawing operations
        this.ctx.globalCompositeOperation = 'lighter';
        
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, 6.28318); // 2 * Math.PI
            this.ctx.fillStyle = `rgba(${particle.color}, ${particle.opacity})`;
            this.ctx.fill();
            
            // Draw connections (only for nearby particles)
            for (let j = i + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = dx * dx + dy * dy; // Skip sqrt
                
                if (distance < 8100) { // 90px squared
                    const opacity = (8100 - distance) / 8100 * 0.2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = `rgba(${particle.color}, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
        
        this.ctx.globalCompositeOperation = 'source-over';
    }
    
    animate() {
        this.updateParticles();
        this.drawParticles();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Minimal fallback for very low-end devices
class MinimalParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            pointer-events: none;
        `;
        
        // Just create a nice gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
        gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.05)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.1)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        console.log('💫 Minimal Particle System (Gradient) Initialized');
    }
}

// Smart initialization based on device capability
function initializeParticleSystem() {
    try {
        // Check device capabilities
        const isLowEnd = navigator.hardwareConcurrency <= 2 || 
                        navigator.deviceMemory <= 2 ||
                        /Android.*(4\.|5\.|6\.)/.test(navigator.userAgent);
        
        if (isLowEnd) {
            window.particleSystem = new MinimalParticleSystem();
        } else {
            window.particleSystem = new UltraFastParticleSystem();
        }
    } catch (error) {
        console.warn('Particle system initialization failed:', error);
        // Create simple gradient fallback
        const canvas = document.getElementById('particles-canvas');
        if (canvas) {
            canvas.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))';
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeParticleSystem);
} else {
    // DOM is already ready
    setTimeout(initializeParticleSystem, 100);
}

// Export for external use
window.UltraFastParticleSystem = UltraFastParticleSystem;
window.MinimalParticleSystem = MinimalParticleSystem;