// Advanced Animations Module
class AnimationController {
    constructor() {
        this.isAnimating = false;
        this.animations = new Map();
        this.observers = new Map();
        this.init();
    }
    
    init() {
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupParallaxEffects();
        this.setupMorphAnimations();
        this.setupFloatingElements();
        this.setupGlowEffects();
        this.setupTextAnimations();
    }
    
    // Scroll-based animations
    setupScrollAnimations() {
        const elements = document.querySelectorAll('[data-animate]');
        
        elements.forEach(element => {
            const animationType = element.dataset.animate;
            const delay = element.dataset.delay || 0;
            
            // Set initial state
            this.setInitialState(element, animationType);
            
            // Create intersection observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            this.animateElement(entry.target, animationType);
                        }, delay);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            observer.observe(element);
            this.observers.set(element, observer);
        });
    }
    
    setInitialState(element, type) {
        switch(type) {
            case 'fade-in-up':
                element.style.opacity = '0';
                element.style.transform = 'translateY(50px)';
                break;
            case 'fade-in-left':
                element.style.opacity = '0';
                element.style.transform = 'translateX(-50px)';
                break;
            case 'fade-in-right':
                element.style.opacity = '0';
                element.style.transform = 'translateX(50px)';
                break;
            case 'scale-in':
                element.style.opacity = '0';
                element.style.transform = 'scale(0.8)';
                break;
            case 'rotate-in':
                element.style.opacity = '0';
                element.style.transform = 'rotate(-10deg) scale(0.8)';
                break;
        }
        
        element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    animateElement(element, type) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0) translateX(0) scale(1) rotate(0)';
        
        // Add animation class for additional effects
        element.classList.add('animated');
        
        // Trigger callback if exists
        if (element.dataset.callback) {
            window[element.dataset.callback](element);
        }
    }
    
    // Hover animations
    setupHoverAnimations() {
        const hoverElements = document.querySelectorAll('[data-hover]');
        
        hoverElements.forEach(element => {
            const hoverType = element.dataset.hover;
            
            element.addEventListener('mouseenter', () => {
                this.applyHoverEffect(element, hoverType, true);
            });
            
            element.addEventListener('mouseleave', () => {
                this.applyHoverEffect(element, hoverType, false);
            });
        });
    }
    
    applyHoverEffect(element, type, isEntering) {
        switch(type) {
            case 'lift':
                element.style.transform = isEntering ? 'translateY(-10px)' : 'translateY(0)';
                element.style.boxShadow = isEntering ? 
                    '0 20px 40px rgba(0, 212, 255, 0.3)' : 
                    '0 10px 30px rgba(0, 0, 0, 0.3)';
                break;
            case 'glow':
                element.style.boxShadow = isEntering ? 
                    '0 0 30px rgba(0, 212, 255, 0.5)' : 
                    'none';
                break;
            case 'scale':
                element.style.transform = isEntering ? 'scale(1.05)' : 'scale(1)';
                break;
            case 'rotate':
                element.style.transform = isEntering ? 'rotate(5deg)' : 'rotate(0)';
                break;
            case 'tilt':
                this.applyTiltEffect(element, isEntering);
                break;
        }
    }
    
    applyTiltEffect(element, isActive) {
        if (isActive) {
            element.addEventListener('mousemove', this.handleTilt);
        } else {
            element.removeEventListener('mousemove', this.handleTilt);
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        }
    }
    
    handleTilt = (e) => {
        const element = e.currentTarget;
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    
    // Parallax effects
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.parallax || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
    
    // Morph animations
    setupMorphAnimations() {
        const morphElements = document.querySelectorAll('[data-morph]');
        
        morphElements.forEach(element => {
            const duration = element.dataset.morph || 8;
            element.style.animation = `morph ${duration}s ease-in-out infinite`;
        });
    }
    
    // Floating elements
    setupFloatingElements() {
        const floatElements = document.querySelectorAll('[data-float]');
        
        floatElements.forEach((element, index) => {
            const duration = element.dataset.float || 6;
            const delay = index * 0.5;
            
            element.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
        });
    }
    
    // Glow effects
    setupGlowEffects() {
        const glowElements = document.querySelectorAll('[data-glow]');
        
        glowElements.forEach(element => {
            const color = element.dataset.glow || 'var(--primary-color)';
            const intensity = element.dataset.intensity || 0.5;
            
            element.style.boxShadow = `0 0 20px ${color} ${intensity}`;
            
            // Pulsing glow effect
            if (element.dataset.pulse) {
                element.style.animation = 'glow 2s ease-in-out infinite alternate';
            }
        });
    }
    
    // Text animations
    setupTextAnimations() {
        // Typing effect
        const typingElements = document.querySelectorAll('[data-type]');
        
        typingElements.forEach(element => {
            const text = element.textContent;
            const speed = element.dataset.type || 50;
            
            element.textContent = '';
            this.typeText(element, text, speed);
        });
        
        // Gradient text animation
        const gradientTexts = document.querySelectorAll('[data-gradient]');
        
        gradientTexts.forEach(element => {
            const colors = element.dataset.gradient.split(',');
            const gradient = `linear-gradient(90deg, ${colors.join(', ')})`;
            
            element.style.background = gradient;
            element.style.backgroundClip = 'text';
            element.style.webkitBackgroundClip = 'text';
            element.style.webkitTextFillColor = 'transparent';
            element.style.backgroundSize = '200% 200%';
            element.style.animation = 'gradientShift 3s ease infinite';
        });
    }
    
    typeText(element, text, speed) {
        let index = 0;
        
        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }
    
    // Staggered animations
    staggerAnimate(elements, animationType, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                this.animateElement(element, animationType);
            }, index * delay);
        });
    }
    
    // Counter animation
    animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        updateCounter();
    }
    
    // Progress bar animation
    animateProgressBar(element, targetWidth, duration = 2000) {
        const progressBar = element.querySelector('.skill-progress');
        if (!progressBar) return;
        
        progressBar.style.transition = `width ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        
        setTimeout(() => {
            progressBar.style.width = targetWidth;
        }, 100);
    }
    
    // Page transitions
    pageTransition(type = 'fade') {
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        
        switch(type) {
            case 'fade':
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: var(--dark-bg);
                    z-index: 9999;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `;
                break;
            case 'slide':
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: var(--dark-bg);
                    z-index: 9999;
                    transition: left 0.3s ease;
                `;
                break;
        }
        
        document.body.appendChild(overlay);
        
        // Animate in
        requestAnimationFrame(() => {
            if (type === 'fade') {
                overlay.style.opacity = '1';
            } else {
                overlay.style.left = '0';
            }
        });
        
        // Animate out and remove
        setTimeout(() => {
            if (type === 'fade') {
                overlay.style.opacity = '0';
            } else {
                overlay.style.left = '100%';
            }
            
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 300);
        }, 500);
    }
    
    // Magnetic effect
    setupMagneticEffect(element) {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = 100;
            
            if (distance < maxDistance) {
                const force = (maxDistance - distance) / maxDistance;
                const moveX = (x / maxDistance) * force * 10;
                const moveY = (y / maxDistance) * force * 10;
                
                element.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    }
    
    // Cleanup
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        this.animations.clear();
    }
}

// Initialize animation controller
const animationController = new AnimationController();

// Export for use in other modules
window.AnimationController = AnimationController;
window.animationController = animationController;

// Additional animation utilities
class AnimationUtils {
    static createParticles(container, count = 50) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 1;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 2;
            
            particle.style.cssText = `
                position: absolute;
                left: ${x}%;
                top: ${y}%;
                width: ${size}px;
                height: ${size}px;
                background: var(--primary-color);
                border-radius: 50%;
                opacity: 0.6;
                animation: float ${duration}s ease-in-out ${delay}s infinite;
            `;
            
            container.appendChild(particle);
        }
    }
    
    static createWaveEffect(element, color = 'var(--primary-color)') {
        const wave = document.createElement('div');
        wave.className = 'wave-effect';
        
        wave.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: ${color};
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 1;
        `;
        
        element.appendChild(wave);
        
        // Animate wave
        wave.animate([
            { width: '0', height: '0', opacity: 0.5 },
            { width: '300px', height: '300px', opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => {
            element.removeChild(wave);
        };
    }
    
    static scrollToElement(element, duration = 1000) {
        const start = window.pageYOffset;
        const target = element.offsetTop - 80;
        const distance = target - start;
        let startTime = null;
        
        function animateScroll(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            window.scrollTo(0, start + distance * this.easeInOutCubic(progress));
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animateScroll);
            }
        }
        
        requestAnimationFrame(animateScroll);
    }
    
    static easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
}

// Export utilities
window.AnimationUtils = AnimationUtils;
