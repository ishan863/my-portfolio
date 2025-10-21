// Advanced 3D Particle System with Three.js
class Advanced3DParticles {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        this.init();
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
        this.camera.position.z = 1000;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.zIndex = '-1';
        this.renderer.domElement.style.pointerEvents = 'none';
        
        // Add to DOM
        const container = document.getElementById('particle-container') || document.body;
        container.appendChild(this.renderer.domElement);
        
        // Create particles
        this.createParticles();
        
        // Add event listeners
        this.addEventListeners();
        
        // Start animation
        this.animate();
    }
    
    createParticles() {
        const particleCount = 800;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        const color = new THREE.Color();
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Position
            positions[i3] = (Math.random() - 0.5) * 2000;
            positions[i3 + 1] = (Math.random() - 0.5) * 2000;
            positions[i3 + 2] = (Math.random() - 0.5) * 2000;
            
            // Color gradient from blue to purple
            const hue = 0.6 + Math.random() * 0.2; // Blue to purple
            const saturation = 0.7 + Math.random() * 0.3;
            const lightness = 0.5 + Math.random() * 0.3;
            color.setHSL(hue, saturation, lightness);
            
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // Size
            sizes[i] = Math.random() * 3 + 1;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Create material
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                mouseX: { value: 0 },
                mouseY: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                varying float vAlpha;
                uniform float time;
                uniform float mouseX;
                uniform float mouseY;
                
                void main() {
                    vColor = color;
                    
                    vec3 pos = position;
                    
                    // Wave motion
                    pos.y += sin(time * 0.001 + pos.x * 0.01) * 10.0;
                    pos.x += cos(time * 0.001 + pos.y * 0.01) * 5.0;
                    
                    // Mouse interaction
                    float mouseDistance = distance(vec2(pos.x, pos.y), vec2(mouseX, mouseY));
                    float mouseEffect = 1.0 / (1.0 + mouseDistance * 0.001);
                    pos.z += mouseEffect * 50.0;
                    
                    // Alpha based on distance from center
                    float centerDistance = length(pos.xy) / 1000.0;
                    vAlpha = 1.0 - smoothstep(0.0, 1.0, centerDistance);
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vAlpha;
                
                void main() {
                    float r = length(gl_PointCoord - vec2(0.5));
                    if (r > 0.5) discard;
                    
                    float alpha = (1.0 - r * 2.0) * vAlpha * 0.8;
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(particles, material);
        this.scene.add(this.particles);
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize(), false);
        document.addEventListener('mousemove', (event) => this.onMouseMove(event), false);
    }
    
    onWindowResize() {
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    onMouseMove(event) {
        this.mouseX = (event.clientX - this.windowHalfX) * 2;
        this.mouseY = (event.clientY - this.windowHalfY) * 2;
        
        if (this.particles && this.particles.material.uniforms) {
            this.particles.material.uniforms.mouseX.value = this.mouseX;
            this.particles.material.uniforms.mouseY.value = this.mouseY;
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now();
        
        // Update particle system
        if (this.particles && this.particles.material.uniforms) {
            this.particles.material.uniforms.time.value = time;
            this.particles.rotation.y = time * 0.00005;
        }
        
        // Camera movement
        this.camera.position.x += (this.mouseX * 0.5 - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouseY * 0.5 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// 3D Floating Elements
class Floating3DElements {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.objects = [];
        this.init();
    }
    
    init() {
        // Create scene for floating elements
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.z = 300;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(200, 200);
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '50%';
        this.renderer.domElement.style.right = '5%';
        this.renderer.domElement.style.transform = 'translateY(-50%)';
        this.renderer.domElement.style.zIndex = '10';
        this.renderer.domElement.style.pointerEvents = 'none';
        this.renderer.domElement.style.borderRadius = '15px';
        this.renderer.domElement.style.opacity = '0.8';
        
        // Add to DOM
        document.body.appendChild(this.renderer.domElement);
        
        // Create 3D objects
        this.create3DObjects();
        
        // Start animation
        this.animate();
    }
    
    create3DObjects() {
        // Create various 3D shapes representing skills
        const geometries = [
            new THREE.BoxGeometry(30, 30, 30),
            new THREE.SphereGeometry(20, 16, 16),
            new THREE.ConeGeometry(15, 30, 8),
            new THREE.TorusGeometry(15, 5, 8, 16),
            new THREE.OctahedronGeometry(20)
        ];
        
        const colors = [
            0x3b82f6, // Blue
            0x8b5cf6, // Purple  
            0x06b6d4, // Cyan
            0x10b981, // Green
            0xf59e0b  // Yellow
        ];
        
        geometries.forEach((geometry, index) => {
            const material = new THREE.MeshPhongMaterial({
                color: colors[index],
                transparent: true,
                opacity: 0.8,
                shininess: 100
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100
            );
            
            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            this.objects.push(mesh);
            this.scene.add(mesh);
        });
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(50, 50, 50);
        this.scene.add(pointLight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotate objects
        this.objects.forEach((obj, index) => {
            obj.rotation.x += 0.01 + index * 0.002;
            obj.rotation.y += 0.015 + index * 0.001;
            
            // Floating motion
            obj.position.y += Math.sin(Date.now() * 0.001 + index) * 0.5;
        });
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Enhanced Scroll Animations
class ScrollAnimations {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.progressBar = this.createProgressBar();
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.handleScroll());
        this.handleScroll(); // Initial call
    }
    
    createProgressBar() {
        const progress = document.createElement('div');
        progress.id = 'scroll-progress';
        progress.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            z-index: 9999;
            transition: width 0.3s ease;
            box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);
        `;
        document.body.appendChild(progress);
        return progress;
    }
    
    handleScroll() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // Update progress bar
        this.progressBar.style.width = scrollPercent + '%';
        
        // Parallax effect for sections
        this.sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const speed = 0.5 + index * 0.1;
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = -(scrollTop * speed);
                section.style.transform = `translateY(${yPos}px)`;
            }
        });
    }
}

// Advanced Navigation with Smooth Scrolling
class AdvancedNavigation {
    constructor() {
        this.nav = document.querySelector('.navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        this.init();
    }
    
    init() {
        this.setupSmoothScrolling();
        this.setupActiveSection();
        this.setupNavbarBehavior();
    }
    
    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    setupActiveSection() {
        window.addEventListener('scroll', () => {
            let current = '';
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                
                if (window.pageYOffset >= sectionTop && 
                    window.pageYOffset < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
        });
    }
    
    setupNavbarBehavior() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                this.nav.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                this.nav.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
            
            // Add background on scroll
            if (scrollTop > 50) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
        });
    }
}

// Initialize all 3D systems when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if Three.js is available
    if (typeof THREE !== 'undefined') {
        // Initialize 3D systems
        new Advanced3DParticles();
        new Floating3DElements();
        
        console.log('🎨 3D Visual Systems Initialized!');
    } else {
        console.warn('Three.js not loaded, falling back to 2D particles');
    }
    
    // Initialize enhanced navigation and animations
    new ScrollAnimations();
    new AdvancedNavigation();
    
    console.log('🚀 Enhanced Portfolio Systems Active!');
});

// Export for external use
window.PortfolioEnhancer = {
    Advanced3DParticles,
    Floating3DElements,
    ScrollAnimations,
    AdvancedNavigation
};