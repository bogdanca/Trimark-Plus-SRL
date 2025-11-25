// ============================================
// NAVIGATION
// ============================================

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveNav() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', setActiveNav);

// ============================================
// SMOOTH SCROLLING
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// SCROLL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate elements on scroll
const animateOnScroll = document.querySelectorAll('.service-card, .pricing-card, .contact-card, .about-feature, .stat-box');

animateOnScroll.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s ease-out';
    observer.observe(element);
});

// ============================================
// HERO STATS COUNTER ANIMATION
// ============================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/[^0-9]/g, ''));
                if (number && !stat.dataset.animated) {
                    stat.dataset.animated = 'true';
                    stat.textContent = '0';
                    animateCounter(stat, number);
                    // Add back the text after animation
                    setTimeout(() => {
                        stat.textContent = text;
                    }, 2000);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

const aboutStats = document.querySelectorAll('.stat-value');
aboutStats.forEach(stat => {
    const statBox = stat.closest('.stat-box');
    if (statBox) {
        statsObserver.observe(statBox);
    }
});

// ============================================
// FORM HANDLING
// ============================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Get submit button
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <svg class="btn-icon animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-opacity="0.25"/>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75"/>
            </svg>
            <span>Se trimite...</span>
        `;
        
        // Simulate form submission (replace with actual API call)
        try {
            // Here you would normally send data to your server
            // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) });
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Success message
            showNotification('Mulțumim! Vă vom contacta în curând.', 'success');
            contactForm.reset();
            
        } catch (error) {
            // Error message
            showNotification('A apărut o eroare. Vă rugăm încercați din nou.', 'error');
        } finally {
            // Restore button
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    });
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <svg class="notification-icon" viewBox="0 0 24 24" fill="none">
                ${type === 'success' 
                    ? '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
                    : '<path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
                }
            </svg>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <svg viewBox="0 0 24 24" fill="none">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    `;
    
    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                max-width: 400px;
                padding: 1rem 1.5rem;
                background: rgba(15, 15, 30, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 1rem;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                z-index: 10000;
                animation: slideInRight 0.3s ease-out;
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
                gap: 0.75rem;
                color: white;
            }
            
            .notification-icon {
                width: 24px;
                height: 24px;
                flex-shrink: 0;
            }
            
            .notification-success .notification-icon {
                color: #10b981;
            }
            
            .notification-error .notification-icon {
                color: #ef4444;
            }
            
            .notification-close {
                background: none;
                border: none;
                padding: 0.25rem;
                cursor: pointer;
                color: rgba(255, 255, 255, 0.6);
                transition: color 0.2s ease;
                display: flex;
                align-items: center;
            }
            
            .notification-close:hover {
                color: white;
            }
            
            .notification-close svg {
                width: 20px;
                height: 20px;
            }
            
            .animate-spin {
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @media (max-width: 768px) {
                .notification {
                    left: 20px;
                    right: 20px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ============================================
// PARALLAX EFFECT FOR GRADIENT ORBS
// ============================================
const gradientOrbs = document.querySelectorAll('.gradient-orb');

window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    gradientOrbs.forEach((orb, index) => {
        const speed = (index + 1) * 20;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        
        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// ============================================
// PRICING CARD HOVER EFFECT
// ============================================
const pricingCards = document.querySelectorAll('.pricing-card');

pricingCards.forEach(card => {
    card.addEventListener('mouseenter', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Add spotlight effect CSS
const spotlightStyle = document.createElement('style');
spotlightStyle.textContent = `
    .pricing-card::after {
        content: '';
        position: absolute;
        top: var(--mouse-y, 50%);
        left: var(--mouse-x, 50%);
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .pricing-card:hover::after {
        opacity: 1;
    }
`;
document.head.appendChild(spotlightStyle);

// ============================================
// ENHANCED SERVICE CARDS 3D TILT EFFECT
// ============================================
const serviceCards = document.querySelectorAll('.service-card');
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let deviceOrientationSupported = false;

// Variables for gyroscope data
let currentGamma = 0; // Left to right tilt in degrees
let currentBeta = 0;  // Front to back tilt in degrees

// Desktop: Mouse movement tilt
serviceCards.forEach(card => {
    let bounds;
    
    card.addEventListener('mouseenter', () => {
        bounds = card.getBoundingClientRect();
    });
    
    card.addEventListener('mousemove', (e) => {
        if (isMobile) return; // Skip on mobile
        
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const leftX = mouseX - bounds.x;
        const topY = mouseY - bounds.y;
        const centerX = leftX - bounds.width / 2;
        const centerY = topY - bounds.height / 2;
        
        const rotateX = (centerY / bounds.height) * -15; // Max 15deg tilt
        const rotateY = (centerX / bounds.width) * 15;
        
        // Calculate distance from center for scale effect
        const distance = Math.sqrt(centerX ** 2 + centerY ** 2);
        const maxDistance = Math.sqrt((bounds.width / 2) ** 2 + (bounds.height / 2) ** 2);
        const scale = 1 + (distance / maxDistance) * 0.03;
        
        card.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            scale3d(${scale}, ${scale}, ${scale})
            translateZ(10px)
        `;
        
        // Add glow effect based on mouse position
        const glowX = (leftX / bounds.width) * 100;
        const glowY = (topY / bounds.height) * 100;
        card.style.setProperty('--glow-x', `${glowX}%`);
        card.style.setProperty('--glow-y', `${glowY}%`);
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        setTimeout(() => {
            card.style.transition = 'transform 0.1s ease-out, background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease';
        }, 500);
    });
});

// Mobile: Gyroscope/Device Orientation tilt
if (isMobile) {
    // Request permission for iOS 13+
    const requestPermission = async () => {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const permission = await DeviceOrientationEvent.requestPermission();
                if (permission === 'granted') {
                    deviceOrientationSupported = true;
                    startGyroscope();
                }
            } catch (error) {
                console.log('Device orientation permission denied');
            }
        } else {
            // Non-iOS or older iOS
            deviceOrientationSupported = true;
            startGyroscope();
        }
    };
    
    // Start gyroscope listener
    const startGyroscope = () => {
        window.addEventListener('deviceorientation', handleOrientation, true);
    };
    
    // Handle device orientation
    const handleOrientation = (event) => {
        // Smooth the values
        currentGamma = event.gamma; // -90 to 90 (left to right)
        currentBeta = event.beta;   // -180 to 180 (front to back)
        
        // Apply tilt to all service cards
        serviceCards.forEach(card => {
            // Limit the rotation for better UX
            const maxTilt = 20;
            const rotateY = Math.max(-maxTilt, Math.min(maxTilt, currentGamma * 0.8));
            const rotateX = Math.max(-maxTilt, Math.min(maxTilt, (currentBeta - 90) * -0.5));
            
            // Add subtle scale based on tilt intensity
            const tiltIntensity = Math.abs(rotateX) + Math.abs(rotateY);
            const scale = 1 + (tiltIntensity / 100);
            
            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
                scale3d(${scale}, ${scale}, ${scale})
                translateZ(5px)
            `;
        });
    };
    
    // Auto-start on mobile or add a trigger
    // For better UX, we'll start automatically on mobile
    setTimeout(() => {
        requestPermission();
    }, 1000);
    
    // Add a subtle indicator for mobile users
    if (window.innerWidth <= 768) {
        const tiltIndicator = document.createElement('div');
        tiltIndicator.className = 'tilt-indicator';
        tiltIndicator.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Tilt your phone to interact</span>
        `;
        document.body.appendChild(tiltIndicator);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            tiltIndicator.style.opacity = '0';
            setTimeout(() => tiltIndicator.remove(), 500);
        }, 5000);
    }
}

// Add dynamic glow effect CSS
const tiltGlowStyle = document.createElement('style');
tiltGlowStyle.textContent = `
    .service-card::after {
        content: '';
        position: absolute;
        top: var(--glow-y, 50%);
        left: var(--glow-x, 50%);
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, rgba(30, 64, 175, 0.15) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
        border-radius: 50%;
    }
    
    .service-card:hover::after {
        opacity: 1;
    }
    
    .tilt-indicator {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1.5rem;
        background: rgba(30, 64, 175, 0.9);
        backdrop-filter: blur(10px);
        border-radius: 50px;
        color: white;
        font-size: 0.875rem;
        font-weight: 600;
        box-shadow: 0 8px 24px rgba(30, 64, 175, 0.4);
        z-index: 9999;
        animation: slideUpFade 0.5s ease-out;
        transition: opacity 0.5s ease;
    }
    
    .tilt-indicator svg {
        width: 24px;
        height: 24px;
        animation: tiltIcon 2s ease-in-out infinite;
    }
    
    @keyframes slideUpFade {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes tiltIcon {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-10deg); }
        75% { transform: rotate(10deg); }
    }
`;
document.head.appendChild(tiltGlowStyle);

// ============================================
// FLOATING ANIMATION FOR BADGES
// ============================================
const floatingBadges = document.querySelectorAll('.floating-badge');

floatingBadges.forEach((badge, index) => {
    // Randomize animation duration for more organic feel
    const duration = 3 + Math.random() * 2;
    badge.style.animationDuration = `${duration}s`;
});

// ============================================
// LAZY LOADING IMAGES (if you add images later)
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Debounce function for scroll events
function debounce(func, wait = 10) {
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

// Use debounced scroll handler
const debouncedScrollHandler = debounce(() => {
    setActiveNav();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================

// Add keyboard navigation for cards
document.querySelectorAll('.service-card, .pricing-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    
    card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const link = card.querySelector('a');
            if (link) link.click();
        }
    });
});

// Focus visible styles
const focusStyle = document.createElement('style');
focusStyle.textContent = `
    *:focus-visible {
        outline: 2px solid #6366f1;
        outline-offset: 2px;
    }
    
    button:focus-visible,
    a:focus-visible {
        outline: 2px solid #6366f1;
        outline-offset: 4px;
    }
`;
document.head.appendChild(focusStyle);

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log('%c🚚 Trimark Plus ', 'background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; font-size: 20px; padding: 10px 20px; border-radius: 8px;');
console.log('%cPeste 20 de ani de experiență în transport și mutări!', 'color: #6366f1; font-size: 14px; font-weight: bold;');
console.log('%cContactați-ne pentru o ofertă personalizată: +40 722 000 000', 'color: #94a3b8; font-size: 12px;');

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Set initial active nav link
    setActiveNav();
    
    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');
    
    // Preload critical resources
    const preloadLinks = document.querySelectorAll('link[rel="preload"]');
    console.log(`Preloaded ${preloadLinks.length} resources`);
});

// Log page load time
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`%cPage loaded in ${Math.round(loadTime)}ms`, 'color: #10b981; font-weight: bold;');
});
