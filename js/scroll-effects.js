// Scroll Effects Module
class ScrollEffects {
    constructor() {
        this.sections = [];
        this.scrollElements = [];
        this.parallaxElements = [];
        this.progressBars = [];
        this.counters = [];
        this.isScrolling = false;
        this.lastScrollY = 0;
        this.init();
    }
    
    init() {
        this.setupSections();
        this.setupScrollElements();
        this.setupParallax();
        this.setupProgressBars();
        this.setupCounters();
        this.setupScrollDirection();
        this.setupRevealAnimations();
        this.setupStickyElements();
        this.setupScrollIndicators();
    }
    
    setupSections() {
        this.sections = document.querySelectorAll('section[id]');
    }
    
    setupScrollElements() {
        // Elements that animate on scroll
        this.scrollElements = document.querySelectorAll('[data-scroll]');
        
        this.scrollElements.forEach(element => {
            const animationType = element.dataset.scroll;
            const threshold = element.dataset.threshold || 0.1;
            const delay = element.dataset.delay || 0;
            
            // Set initial state
            this.setScrollInitialState(element, animationType);
            
            // Create intersection observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            this.triggerScrollAnimation(entry.target, animationType);
                        }, delay);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: threshold,
                rootMargin: '0px 0px -50px 0px'
            });
            
            observer.observe(element);
        });
    }
    
    setScrollInitialState(element, type) {
        element.style.opacity = '0';
        element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        switch(type) {
            case 'fade-up':
                element.style.transform = 'translateY(60px)';
                break;
            case 'fade-down':
                element.style.transform = 'translateY(-60px)';
                break;
            case 'fade-left':
                element.style.transform = 'translateX(-60px)';
                break;
            case 'fade-right':
                element.style.transform = 'translateX(60px)';
                break;
            case 'scale-up':
                element.style.transform = 'scale(0.8)';
                break;
            case 'rotate-in':
                element.style.transform = 'rotate(-15deg) scale(0.8)';
                break;
            case 'flip-in':
                element.style.transform = 'perspective(1000px) rotateY(-90deg)';
                break;
        }
    }
    
    triggerScrollAnimation(element, type) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0) translateX(0) scale(1) rotate(0) rotateY(0)';
        
        // Add animation class
        element.classList.add('scroll-animated');
        
        // Trigger custom animation
        if (element.dataset.animation) {
            this.executeCustomAnimation(element, element.dataset.animation);
        }
    }
    
    setupParallax() {
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', this.throttle(() => {
            const scrolled = window.pageYOffset;
            
            this.parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const direction = element.dataset.direction || 'vertical';
                
                if (direction === 'vertical') {
                    const yPos = -(scrolled * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                } else if (direction === 'horizontal') {
                    const xPos = -(scrolled * speed);
                    element.style.transform = `translateX(${xPos}px)`;
                } else if (direction === 'both') {
                    const xPos = -(scrolled * speed * 0.5);
                    const yPos = -(scrolled * speed);
                    element.style.transform = `translate(${xPos}px, ${yPos}px)`;
                }
            });
        }, 16));
    }
    
    setupProgressBars() {
        this.progressBars = document.querySelectorAll('.skill-item');
        
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProgressBars(entry.target);
                    progressObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        this.progressBars.forEach(bar => {
            progressObserver.observe(bar);
        });
    }
    
    animateProgressBars(container) {
        const progressBars = container.querySelectorAll('.skill-progress');
        
        progressBars.forEach((bar, index) => {
            setTimeout(() => {
                const targetWidth = bar.style.getPropertyValue('--progress');
                bar.style.width = targetWidth;
                bar.style.transition = 'width 2s cubic-bezier(0.4, 0, 0.2, 1)';
                
                // Animate percentage counter
                const percentageElement = bar.parentElement.querySelector('.skill-percentage');
                if (percentageElement) {
                    const targetValue = parseInt(percentageElement.textContent);
                    this.animateCounter(percentageElement, targetValue, 2000);
                }
            }, index * 200);
        });
    }
    
    setupCounters() {
        this.counters = document.querySelectorAll('[data-counter]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.counter);
                    const duration = entry.target.dataset.duration || 2000;
                    this.animateCounter(entry.target, target, duration);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        this.counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
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
                element.textContent = target + (element.dataset.suffix || '');
            }
        };
        
        updateCounter();
    }
    
    setupScrollDirection() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop) {
                document.body.classList.add('scrolling-down');
                document.body.classList.remove('scrolling-up');
            } else {
                document.body.classList.add('scrolling-up');
                document.body.classList.remove('scrolling-down');
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    setupRevealAnimations() {
        const revealElements = document.querySelectorAll('[data-reveal]');
        
        revealElements.forEach(element => {
            const threshold = element.dataset.threshold || 0.1;
            const stagger = element.dataset.stagger || 0;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (stagger) {
                            this.staggerReveal(entry.target, stagger);
                        } else {
                            entry.target.classList.add('revealed');
                        }
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: threshold
            });
            
            observer.observe(element);
        });
    }
    
    staggerReveal(container, delay) {
        const children = container.children;
        
        Array.from(children).forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('revealed');
            }, index * delay);
        });
    }
    
    setupStickyElements() {
        const stickyElements = document.querySelectorAll('[data-sticky]');
        
        stickyElements.forEach(element => {
            const offset = element.dataset.offset || 0;
            const parent = element.parentElement;
            
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        element.style.position = 'sticky';
                        element.style.top = offset + 'px';
                        element.style.zIndex = '100';
                    } else {
                        element.style.position = 'static';
                    }
                },
                {
                    root: null,
                    threshold: [0, 1]
                }
            );
            
            observer.observe(parent);
        });
    }
    
    setupScrollIndicators() {
        // Active section highlighting for navigation
        window.addEventListener('scroll', this.throttle(() => {
            const scrollY = window.pageYOffset;
            
            this.sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    // Remove active class from all links
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Add active class to current link
                    if (navLink) {
                        navLink.classList.add('active');
                    }
                }
            });
        }, 16));
    }
    
    executeCustomAnimation(element, animationName) {
        switch(animationName) {
            case 'bounce-in':
                element.style.animation = 'bounceIn 1s ease-out';
                break;
            case 'elastic':
                element.style.animation = 'elastic 1s ease-out';
                break;
            case 'shake':
                element.style.animation = 'shake 0.5s ease-in-out';
                break;
            case 'pulse':
                element.style.animation = 'pulse 2s ease-in-out infinite';
                break;
            case 'wiggle':
                element.style.animation = 'wiggle 0.5s ease-in-out';
                break;
            case 'flip':
                element.style.animation = 'flip 1s ease-in-out';
                break;
            case 'zoom':
                element.style.animation = 'zoomIn 0.5s ease-out';
                break;
        }
        
        // Remove animation after completion
        setTimeout(() => {
            element.style.animation = '';
        }, 2000);
    }
    
    // Scroll-based visibility
    setupScrollVisibility() {
        const elements = document.querySelectorAll('[data-visibility]');
        
        elements.forEach(element => {
            const threshold = parseFloat(element.dataset.visibility) || 0.1;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        element.classList.add('visible');
                    } else {
                        element.classList.remove('visible');
                    }
                });
            }, {
                threshold: threshold
            });
            
            observer.observe(element);
        });
    }
    
    // Scroll-based opacity
    setupScrollOpacity() {
        const elements = document.querySelectorAll('[data-opacity]');
        
        window.addEventListener('scroll', this.throttle(() => {
            const scrollY = window.pageYOffset;
            
            elements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top + scrollY;
                const elementHeight = rect.height;
                const windowHeight = window.innerHeight;
                
                const distance = windowHeight - (elementTop - scrollY);
                const opacity = Math.max(0, Math.min(1, distance / windowHeight));
                
                element.style.opacity = opacity;
            });
        }, 16));
    }
    
    // Scroll-based scale
    setupScrollScale() {
        const elements = document.querySelectorAll('[data-scale]');
        
        window.addEventListener('scroll', this.throttle(() => {
            const scrollY = window.pageYOffset;
            
            elements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top + scrollY;
                const windowHeight = window.innerHeight;
                
                const distance = Math.abs(windowHeight / 2 - (elementTop - scrollY));
                const scale = Math.max(0.8, Math.min(1.2, 1 - distance / windowHeight));
                
                element.style.transform = `scale(${scale})`;
            });
        }, 16));
    }
    
    // Utility functions
    throttle(func, limit) {
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
    
    // Cleanup
    destroy() {
        // Remove all event listeners and observers
        this.scrollElements = [];
        this.parallaxElements = [];
        this.progressBars = [];
        this.counters = [];
        this.sections = [];
    }
}

// Initialize scroll effects
const scrollEffects = new ScrollEffects();

// Export for use in other modules
window.ScrollEffects = ScrollEffects;
window.scrollEffects = scrollEffects;

// Additional scroll utilities
class ScrollUtils {
    static scrollToTop(duration = 1000) {
        const start = window.pageYOffset;
        const startTime = performance.now();
        
        function animateScroll(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            window.scrollTo(0, start * (1 - this.easeInOutCubic(progress)));
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        }
        
        requestAnimationFrame(animateScroll);
    }
    
    static scrollToElement(element, duration = 1000, offset = 80) {
        const start = window.pageYOffset;
        const target = element.offsetTop - offset;
        const distance = target - start;
        const startTime = performance.now();
        
        function animateScroll(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            window.scrollTo(0, start + distance * this.easeInOutCubic(progress));
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        }
        
        requestAnimationFrame(animateScroll);
    }
    
    static easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    static getScrollProgress() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        return scrolled;
    }
    
    static isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        const verticalThreshold = windowHeight * threshold;
        const horizontalThreshold = windowWidth * threshold;
        
        return (
            rect.top <= windowHeight - verticalThreshold &&
            rect.bottom >= verticalThreshold &&
            rect.left <= windowWidth - horizontalThreshold &&
            rect.right >= horizontalThreshold
        );
    }
    
    static getElementVisibility(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        const elementTop = rect.top;
        const elementBottom = rect.bottom;
        const elementHeight = rect.height;
        
        if (elementTop >= windowHeight || elementBottom <= 0) {
            return 0;
        }
        
        const visibleTop = Math.max(0, elementTop);
        const visibleBottom = Math.min(windowHeight, elementBottom);
        const visibleHeight = visibleBottom - visibleTop;
        
        return visibleHeight / elementHeight;
    }
}

// Export utilities
window.ScrollUtils = ScrollUtils;
