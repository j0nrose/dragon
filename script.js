// Dragon's Realm - Interactive Features

// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const ctaButton = document.querySelector('.cta-button');
const contactForm = document.querySelector('.contact-form');
const dragonCards = document.querySelectorAll('.dragon-card');
const legendItems = document.querySelectorAll('.legend-item');

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// CTA Button scroll to contact
ctaButton.addEventListener('click', () => {
    const contactSection = document.getElementById('contact');
    const offsetTop = contactSection.offsetTop - 80;
    window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    }
});

// Dragon card hover effects with sound simulation
dragonCards.forEach((card, index) => {
    const dragonTypes = ['fire', 'ice', 'shadow'];
    const currentType = dragonTypes[index];
    
    card.addEventListener('mouseenter', () => {
        // Add glow effect
        card.style.boxShadow = `0 15px 40px rgba(139, 0, 0, 0.4), 0 0 30px ${getElementColor(currentType)}`;
        
        // Simulate dragon roar effect (visual feedback)
        card.style.transform = 'translateY(-10px) scale(1.02)';
        
        // Add particle effect simulation
        createParticleEffect(card, currentType);
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        removeParticleEffect(card);
    });
});

// Get element color based on dragon type
function getElementColor(type) {
    switch(type) {
        case 'fire': return 'rgba(255, 69, 0, 0.6)';
        case 'ice': return 'rgba(30, 144, 255, 0.6)';
        case 'shadow': return 'rgba(138, 43, 226, 0.6)';
        default: return 'rgba(255, 215, 0, 0.6)';
    }
}

// Create particle effect simulation
function createParticleEffect(element, type) {
    // Remove existing particles
    removeParticleEffect(element);
    
    const particles = document.createElement('div');
    particles.className = 'particle-container';
    particles.style.position = 'absolute';
    particles.style.top = '0';
    particles.style.left = '0';
    particles.style.width = '100%';
    particles.style.height = '100%';
    particles.style.pointerEvents = 'none';
    particles.style.overflow = 'hidden';
    particles.style.borderRadius = '15px';
    
    element.style.position = 'relative';
    element.appendChild(particles);
    
    // Create individual particles
    for (let i = 0; i < 5; i++) {
        setTimeout(() => createParticle(particles, type), i * 100);
    }
}

// Create individual particle
function createParticle(container, type) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.borderRadius = '50%';
    particle.style.backgroundColor = getElementColor(type).replace('0.6', '1');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animation = `particleFloat 2s ease-out forwards`;
    
    // Add particle animation CSS
    if (!document.querySelector('#particle-styles')) {
        const style = document.createElement('style');
        style.id = 'particle-styles';
        style.innerHTML = `
            @keyframes particleFloat {
                0% {
                    opacity: 1;
                    transform: translateY(0px) scale(0);
                }
                50% {
                    opacity: 0.8;
                    transform: translateY(-20px) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-40px) scale(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 2000);
}

// Remove particle effect
function removeParticleEffect(element) {
    const existingParticles = element.querySelector('.particle-container');
    if (existingParticles) {
        existingParticles.remove();
    }
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Set initial state and observe elements
const animatedElements = [...dragonCards, ...legendItems];
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    observer.observe(el);
});

// Add fadeInUp animation
const fadeInUpStyle = document.createElement('style');
fadeInUpStyle.innerHTML = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(fadeInUpStyle);

// Contact form handling
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Validate form
    if (!name || !email || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate form submission
    const submitButton = contactForm.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        showNotification('Your message has been sent to the Dragon Council!', 'success');
        contactForm.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Notification styles
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.background = type === 'success' ? 'linear-gradient(45deg, #28a745, #20c997)' : 
                                   type === 'error' ? 'linear-gradient(45deg, #dc3545, #fd7e14)' : 
                                   'linear-gradient(45deg, #17a2b8, #6f42c1)';
    notification.style.color = 'white';
    notification.style.padding = '1rem 1.5rem';
    notification.style.borderRadius = '10px';
    notification.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
    notification.style.zIndex = '10000';
    notification.style.fontSize = '1rem';
    notification.style.fontWeight = '600';
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'all 0.3s ease';
    notification.style.maxWidth = '300px';
    notification.style.wordWrap = 'break-word';
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Legend items hover effects
legendItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.background = 'linear-gradient(135deg, rgba(26, 26, 26, 0.9), rgba(139, 0, 0, 0.1))';
        item.style.borderLeftColor = '#ffd700';
        item.style.borderLeftWidth = '6px';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.background = 'rgba(26, 26, 26, 0.6)';
        item.style.borderLeftColor = '#ffd700';
        item.style.borderLeftWidth = '4px';
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const dragonSilhouette = document.querySelector('.dragon-silhouette');
    
    if (hero && dragonSilhouette) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
        dragonSilhouette.style.transform = `translateY(${rate * 1.2}px)`;
    }
});

// Dragon roar sound simulation (visual feedback)
function simulateDragonRoar(dragonType) {
    const body = document.body;
    const originalFilter = body.style.filter;
    
    // Flash effect based on dragon type
    switch(dragonType) {
        case 'fire':
            body.style.filter = 'hue-rotate(15deg) brightness(1.1)';
            break;
        case 'ice':
            body.style.filter = 'hue-rotate(200deg) brightness(0.9)';
            break;
        case 'shadow':
            body.style.filter = 'hue-rotate(270deg) contrast(1.2)';
            break;
    }
    
    setTimeout(() => {
        body.style.filter = originalFilter;
    }, 200);
}

// Add click handlers for dragon cards
dragonCards.forEach((card, index) => {
    const dragonTypes = ['fire', 'ice', 'shadow'];
    card.addEventListener('click', () => {
        simulateDragonRoar(dragonTypes[index]);
        
        // Add a subtle shake animation
        card.style.animation = 'dragonRoar 0.5s ease-in-out';
    });
});

// Add dragon roar animation
const roarStyle = document.createElement('style');
roarStyle.innerHTML = `
    @keyframes dragonRoar {
        0%, 100% { transform: translateY(-10px) scale(1.02); }
        25% { transform: translateY(-12px) scale(1.03) rotate(1deg); }
        75% { transform: translateY(-8px) scale(1.01) rotate(-1deg); }
    }
`;
document.head.appendChild(roarStyle);

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
    
    // Enter key on CTA button
    if (e.key === 'Enter' && e.target === ctaButton) {
        ctaButton.click();
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation to page elements
    const elements = document.querySelectorAll('section');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.8s ease-out';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Show welcome message
    setTimeout(() => {
        showNotification('Welcome to the Dragon\'s Realm!', 'success');
    }, 1000);
});

// Performance optimization: Throttle scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            scrollTimeout = null;
            // Scroll-dependent code here runs at most once per 16ms
        }, 16);
    }
});

// Error handling for missing elements
function safeQuerySelector(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
    }
    return element;
}

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    // Skip navigation for screen readers
    if (e.key === 'Tab' && e.shiftKey) {
        const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        }
    }
});

// Console easter egg for developers
console.log(`
    🐉 Welcome to Dragon's Realm! 🐉
    
    You've discovered the developer console!
    The dragons approve of your curiosity.
    
    May your code be bug-free and your dragons mighty!
    
    🔥❄️🌑
`);

// Export functions for testing (if in module environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        showNotification,
        simulateDragonRoar
    };
}