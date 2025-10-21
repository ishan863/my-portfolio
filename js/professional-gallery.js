// Professional Image Gallery with Lightbox
class ProfessionalGallery {
    constructor() {
        this.lightbox = null;
        this.currentImageIndex = 0;
        this.images = [];
        this.init();
    }
    
    init() {
        this.createLightbox();
        this.setupGalleryEvents();
        this.setupKeyboardNavigation();
    }
    
    createLightbox() {
        // Create lightbox overlay
        this.lightbox = document.createElement('div');
        this.lightbox.className = 'professional-lightbox';
        this.lightbox.innerHTML = `
            <div class="lightbox-overlay" onclick="gallery.closeLightbox()"></div>
            <div class="lightbox-container">
                <button class="lightbox-close" onclick="gallery.closeLightbox()">
                    <i class="fas fa-times"></i>
                </button>
                <button class="lightbox-prev" onclick="gallery.previousImage()">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="lightbox-next" onclick="gallery.nextImage()">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <div class="lightbox-content">
                    <img class="lightbox-image" src="" alt="">
                    <div class="lightbox-info">
                        <h3 class="lightbox-title"></h3>
                        <p class="lightbox-description"></p>
                        <div class="lightbox-tech-stack"></div>
                        <div class="lightbox-links"></div>
                    </div>
                </div>
                <div class="lightbox-thumbnails"></div>
            </div>
        `;
        
        document.body.appendChild(this.lightbox);
        
        // Add styles
        this.addLightboxStyles();
    }
    
    addLightboxStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .professional-lightbox {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 10000;
                display: none;
                backdrop-filter: blur(10px);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .professional-lightbox.active {
                display: flex;
                opacity: 1;
            }
            
            .lightbox-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                cursor: pointer;
            }
            
            .lightbox-container {
                position: relative;
                max-width: 95%;
                max-height: 95%;
                margin: auto;
                display: flex;
                flex-direction: column;
                background: white;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                transform: scale(0.8);
                transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .professional-lightbox.active .lightbox-container {
                transform: scale(1);
            }
            
            .lightbox-close {
                position: absolute;
                top: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: rgba(0, 0, 0, 0.7);
                border: none;
                border-radius: 50%;
                color: white;
                font-size: 20px;
                cursor: pointer;
                z-index: 10001;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .lightbox-close:hover {
                background: rgba(220, 38, 38, 0.9);
                transform: scale(1.1);
            }
            
            .lightbox-prev, .lightbox-next {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 60px;
                height: 60px;
                background: rgba(0, 0, 0, 0.7);
                border: none;
                border-radius: 50%;
                color: white;
                font-size: 24px;
                cursor: pointer;
                z-index: 10001;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .lightbox-prev {
                left: 20px;
            }
            
            .lightbox-next {
                right: 20px;
            }
            
            .lightbox-prev:hover, .lightbox-next:hover {
                background: rgba(59, 130, 246, 0.9);
                transform: translateY(-50%) scale(1.1);
            }
            
            .lightbox-content {
                display: flex;
                height: 80vh;
                background: white;
            }
            
            .lightbox-image {
                flex: 1;
                width: 60%;
                height: 100%;
                object-fit: cover;
                border-radius: 0;
            }
            
            .lightbox-info {
                flex: 1;
                width: 40%;
                padding: 40px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            }
            
            .lightbox-title {
                font-size: 2.5rem;
                font-weight: 700;
                margin-bottom: 20px;
                background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .lightbox-description {
                font-size: 1.1rem;
                line-height: 1.8;
                color: #475569;
                margin-bottom: 30px;
            }
            
            .lightbox-tech-stack {
                margin-bottom: 30px;
            }
            
            .tech-tag {
                display: inline-block;
                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 500;
                margin: 5px 10px 5px 0;
                box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
            }
            
            .lightbox-links {
                display: flex;
                gap: 15px;
            }
            
            .lightbox-btn {
                padding: 12px 24px;
                border: none;
                border-radius: 10px;
                font-weight: 600;
                text-decoration: none;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
            }
            
            .lightbox-btn.primary {
                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                color: white;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
            }
            
            .lightbox-btn.secondary {
                background: white;
                color: #3b82f6;
                border: 2px solid #3b82f6;
            }
            
            .lightbox-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(59, 130, 246, 0.5);
            }
            
            .lightbox-thumbnails {
                padding: 20px;
                background: #f1f5f9;
                display: flex;
                gap: 15px;
                justify-content: center;
                overflow-x: auto;
            }
            
            .lightbox-thumbnail {
                width: 80px;
                height: 60px;
                object-fit: cover;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 3px solid transparent;
            }
            
            .lightbox-thumbnail:hover {
                transform: scale(1.1);
                border-color: #3b82f6;
            }
            
            .lightbox-thumbnail.active {
                border-color: #3b82f6;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
            }
            
            @media (max-width: 768px) {
                .lightbox-content {
                    flex-direction: column;
                    height: auto;
                }
                
                .lightbox-image {
                    width: 100%;
                    height: 50vh;
                }
                
                .lightbox-info {
                    width: 100%;
                    padding: 20px;
                }
                
                .lightbox-title {
                    font-size: 1.8rem;
                }
                
                .lightbox-prev, .lightbox-next {
                    width: 50px;
                    height: 50px;
                    font-size: 20px;
                }
                
                .lightbox-prev {
                    left: 10px;
                }
                
                .lightbox-next {
                    right: 10px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    setupGalleryEvents() {
        // Add click events to all project images
        document.querySelectorAll('.project-image, .gallery-item').forEach((img, index) => {
            img.addEventListener('click', (e) => {
                e.preventDefault();
                this.openLightbox(img, index);
            });
        });
    }
    
    openLightbox(img, index) {
        this.currentImageIndex = index;
        
        // Get project data
        const projectData = this.getProjectData(img);
        
        // Update lightbox content
        const lightboxImg = this.lightbox.querySelector('.lightbox-image');
        const lightboxTitle = this.lightbox.querySelector('.lightbox-title');
        const lightboxDesc = this.lightbox.querySelector('.lightbox-description');
        const lightboxTech = this.lightbox.querySelector('.lightbox-tech-stack');
        const lightboxLinks = this.lightbox.querySelector('.lightbox-links');
        
        lightboxImg.src = projectData.image;
        lightboxImg.alt = projectData.title;
        lightboxTitle.textContent = projectData.title;
        lightboxDesc.textContent = projectData.description;
        
        // Add tech stack
        lightboxTech.innerHTML = projectData.tech.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');
        
        // Add links
        lightboxLinks.innerHTML = `
            ${projectData.demo ? `<a href="${projectData.demo}" target="_blank" class="lightbox-btn primary">
                <i class="fas fa-external-link-alt"></i> Live Demo
            </a>` : ''}
            ${projectData.github ? `<a href="${projectData.github}" target="_blank" class="lightbox-btn secondary">
                <i class="fab fa-github"></i> View Code
            </a>` : ''}
        `;
        
        // Show lightbox
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    getProjectData(img) {
        // Extract project data from DOM or predefined data
        const projectCard = img.closest('.project-card');
        
        return {
            image: img.src || img.dataset.src,
            title: projectCard?.querySelector('.project-title')?.textContent || 'Project Title',
            description: projectCard?.querySelector('.project-description')?.textContent || 'Project description goes here.',
            tech: ['Python', 'AI', 'Machine Learning'], // Default or extract from data attributes
            demo: projectCard?.querySelector('.project-demo')?.href || '#',
            github: projectCard?.querySelector('.project-github')?.href || '#'
        };
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (this.lightbox.classList.contains('active')) {
                switch(e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.previousImage();
                        break;
                    case 'ArrowRight':
                        this.nextImage();
                        break;
                }
            }
        });
    }
    
    previousImage() {
        // Implementation for previous image navigation
        console.log('Previous image');
    }
    
    nextImage() {
        // Implementation for next image navigation
        console.log('Next image');
    }
}

// Testimonials Carousel
class TestimonialsCarousel {
    constructor() {
        this.currentSlide = 0;
        this.testimonials = [
            {
                name: "Sarah Johnson",
                role: "Product Manager at TechCorp",
                image: "https://randomuser.me/api/portraits/women/44.jpg",
                text: "Goura's AI solutions transformed our workflow. His attention to detail and innovative approach made our project a huge success."
            },
            {
                name: "Michael Chen",
                role: "CTO at StartupXYZ",
                image: "https://randomuser.me/api/portraits/men/32.jpg",
                text: "Working with Goura was exceptional. His Python automation tools saved us countless hours and improved our efficiency dramatically."
            },
            {
                name: "Emily Rodriguez",
                role: "Data Scientist at DataFlow",
                image: "https://randomuser.me/api/portraits/women/68.jpg",
                text: "Goura's machine learning models exceeded our expectations. His expertise in AI development is truly remarkable."
            }
        ];
        this.init();
    }
    
    init() {
        this.createCarousel();
        this.startAutoplay();
    }
    
    createCarousel() {
        const testimonialSection = document.querySelector('#testimonials');
        if (!testimonialSection) return;
        
        const carousel = document.createElement('div');
        carousel.className = 'testimonials-carousel';
        carousel.innerHTML = `
            <div class="carousel-container">
                <div class="carousel-slides">
                    ${this.testimonials.map((testimonial, index) => `
                        <div class="testimonial-slide ${index === 0 ? 'active' : ''}">
                            <div class="testimonial-content">
                                <div class="quote-icon">
                                    <i class="fas fa-quote-left"></i>
                                </div>
                                <p class="testimonial-text">"${testimonial.text}"</p>
                                <div class="testimonial-author">
                                    <img src="${testimonial.image}" alt="${testimonial.name}" class="author-image">
                                    <div class="author-info">
                                        <h4 class="author-name">${testimonial.name}</h4>
                                        <p class="author-role">${testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="carousel-indicators">
                    ${this.testimonials.map((_, index) => `
                        <button class="indicator ${index === 0 ? 'active' : ''}" data-slide="${index}"></button>
                    `).join('')}
                </div>
            </div>
        `;
        
        testimonialSection.appendChild(carousel);
        this.addCarouselStyles();
        this.setupCarouselEvents();
    }
    
    addCarouselStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .testimonials-carousel {
                max-width: 800px;
                margin: 0 auto;
                position: relative;
            }
            
            .carousel-container {
                position: relative;
                overflow: hidden;
                border-radius: 20px;
                background: white;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            }
            
            .carousel-slides {
                display: flex;
                transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .testimonial-slide {
                min-width: 100%;
                padding: 40px;
                opacity: 0;
                transition: opacity 0.5s ease;
            }
            
            .testimonial-slide.active {
                opacity: 1;
            }
            
            .testimonial-content {
                text-align: center;
            }
            
            .quote-icon {
                font-size: 3rem;
                color: #3b82f6;
                margin-bottom: 20px;
            }
            
            .testimonial-text {
                font-size: 1.2rem;
                line-height: 1.8;
                color: #475569;
                margin-bottom: 30px;
                font-style: italic;
            }
            
            .testimonial-author {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 20px;
            }
            
            .author-image {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                object-fit: cover;
                border: 3px solid #3b82f6;
            }
            
            .author-info {
                text-align: left;
            }
            
            .author-name {
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 5px;
            }
            
            .author-role {
                color: #64748b;
                font-size: 0.9rem;
            }
            
            .carousel-indicators {
                display: flex;
                justify-content: center;
                gap: 10px;
                padding: 20px;
                background: #f8fafc;
            }
            
            .indicator {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: none;
                background: #cbd5e1;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .indicator.active {
                background: #3b82f6;
                transform: scale(1.3);
            }
            
            .indicator:hover {
                background: #64748b;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    setupCarouselEvents() {
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
    }
    
    goToSlide(index) {
        const slides = document.querySelectorAll('.testimonial-slide');
        const indicators = document.querySelectorAll('.indicator');
        
        // Remove active classes
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active classes
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        this.currentSlide = index;
    }
    
    startAutoplay() {
        setInterval(() => {
            this.currentSlide = (this.currentSlide + 1) % this.testimonials.length;
            this.goToSlide(this.currentSlide);
        }, 5000); // Change slide every 5 seconds
    }
}

// Initialize gallery and carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.gallery = new ProfessionalGallery();
    new TestimonialsCarousel();
    
    console.log('🎨 Professional Gallery & Testimonials Initialized!');
});

// Export for external use
window.ProfessionalComponents = {
    ProfessionalGallery,
    TestimonialsCarousel
};