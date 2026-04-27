// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a nav link
    document.querySelectorAll('.nav-menu li a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Smooth Scroll for Internal Links
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

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and feature elements
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.feature-card, .link-card, .staff-card, .graduate-card, .reason-card, .value-item'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Counter Animation for Statistics
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
};

// Observe stat numbers and animate when visible
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber && !statNumber.classList.contains('animated')) {
                const text = statNumber.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                const suffix = text.replace(/[0-9]/g, '');
                
                statNumber.classList.add('animated');
                animateCounter(statNumber, number);
                
                // Add suffix back after animation
                setTimeout(() => {
                    statNumber.textContent = number + suffix;
                }, 2000);
            }
        }
    });
}, observerOptions);

// Observe all stat cards
document.querySelectorAll('.stat-card').forEach(card => {
    statObserver.observe(card);
});

// Image lazy loading fallback
document.querySelectorAll('img').forEach(img => {
    img.loading = 'lazy';
});

// Add active class to current page in navigation
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-menu a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});

// Scroll to top button (optional enhancement)
const createScrollTopButton = () => {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-chevron-up"></i>';
    button.className = 'scroll-top-btn';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #2E86C1, #1B4F72);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
    `;
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-5px)';
        button.style.background = 'linear-gradient(135deg, #FDB913, #FFC533)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.background = 'linear-gradient(135deg, #2E86C1, #1B4F72)';
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });
    
    document.body.appendChild(button);
};

// Initialize scroll to top button
createScrollTopButton();

// Class Image Slider Functionality
function moveSlide(button, direction) {
    const slider = button.closest('.class-slider');
    const images = slider.querySelectorAll('.class-image');
    const dots = slider.querySelectorAll('.dot');
    
    let currentIndex = 0;
    images.forEach((img, index) => {
        if (img.classList.contains('active')) {
            currentIndex = index;
        }
    });
    
    // Remove active class from current image and dot
    images[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
    
    // Calculate new index
    let newIndex = currentIndex + direction;
    
    // Wrap around
    if (newIndex >= images.length) {
        newIndex = 0;
    } else if (newIndex < 0) {
        newIndex = images.length - 1;
    }
    
    // Add active class to new image and dot
    images[newIndex].classList.add('active');
    dots[newIndex].classList.add('active');
}

function currentSlide(dot, index) {
    const slider = dot.closest('.class-slider');
    const images = slider.querySelectorAll('.class-image');
    const dots = slider.querySelectorAll('.dot');
    
    // Remove active class from all images and dots
    images.forEach(img => img.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    
    // Add active class to selected image and dot
    images[index].classList.add('active');
    dots[index].classList.add('active');
}

// Auto-advance slides every 5 seconds (optional)
document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.class-slider');
    
    sliders.forEach(slider => {
        setInterval(() => {
            const nextBtn = slider.querySelector('.slider-btn.next');
            if (nextBtn) {
                moveSlide(nextBtn, 1);
            }
        }, 5000); // Change slide every 5 seconds
    });
});

// Toggle Class Members List
function toggleMembers(button) {
    const membersList = button.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (membersList.style.display === 'none' || membersList.style.display === '') {
        membersList.style.display = 'block';
        button.innerHTML = '<i class="fas fa-chevron-up"></i> Hide graduates of this class';
    } else {
        membersList.style.display = 'none';
        button.innerHTML = '<i class="fas fa-chevron-down"></i> View graduates of this class';
    }
}

let deferredInstallPrompt = null;

function isIosDevice() {
    return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isInstallSupportedContext() {
    return window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

function isStandaloneMode() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function createInstallAppButton() {
    if (document.querySelector('.install-app-btn')) {
        return document.querySelector('.install-app-btn');
    }

    const button = document.createElement('button');
    button.className = 'install-app-btn';
    button.type = 'button';
    button.innerHTML = '<i class="fas fa-mobile-alt"></i> Install App';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 30px;
        padding: 14px 18px;
        border: none;
        border-radius: 999px;
        background: linear-gradient(135deg, #FDB913, #f39c12);
        color: #102a43;
        font-weight: 700;
        font-size: 0.95rem;
        cursor: pointer;
        z-index: 1001;
        display: block;
        box-shadow: 0 10px 24px rgba(16, 42, 67, 0.22);
    `;

    button.addEventListener('click', async () => {
        if (deferredInstallPrompt) {
            deferredInstallPrompt.prompt();
            const promptEvent = deferredInstallPrompt;
            deferredInstallPrompt = null;
            button.style.display = 'none';

            try {
                await promptEvent.userChoice;
            } catch (error) {
                console.warn('Install prompt was dismissed or failed.', error);
            }

            return;
        }

        if (!isInstallSupportedContext()) {
            window.alert('App install is not available from a local file preview. Open the website from your live domain or localhost in a browser to install BRIDAPS.');
            return;
        }

        if (isIosDevice() && !isStandaloneMode()) {
            window.alert('On iPhone or iPad, tap Share in Safari, then choose Add to Home Screen to install this website as an app.');
            return;
        }

        window.alert('Install becomes available when your browser supports app installation for this site. Use Chrome or Edge on Android/Desktop, or Safari Add to Home Screen on iPhone.');
    });

    document.body.appendChild(button);
    return button;
}

function setupAppInstallPrompt() {
    const installButton = createInstallAppButton();

    if (isStandaloneMode()) {
        installButton.style.display = 'none';
        return;
    }

    installButton.style.display = 'block';

    if (!isInstallSupportedContext()) {
        installButton.innerHTML = '<i class="fas fa-mobile-alt"></i> Install BRIDAPS';
        installButton.title = 'Open this site on localhost or HTTPS to install it as an app.';
        return;
    }

    if (isIosDevice()) {
        installButton.innerHTML = '<i class="fas fa-mobile-alt"></i> Add BRIDAPS to Home Screen';
        installButton.title = 'Use Safari Share > Add to Home Screen.';
        return;
    }

    installButton.innerHTML = '<i class="fas fa-mobile-alt"></i> Install BRIDAPS';
    installButton.title = 'Install BRIDAPS as an app on this device.';

    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        deferredInstallPrompt = event;
        installButton.style.display = 'block';
        installButton.innerHTML = '<i class="fas fa-mobile-alt"></i> Install BRIDAPS';
        installButton.title = 'Install BRIDAPS as an app on this device.';
    });

    window.addEventListener('appinstalled', () => {
        deferredInstallPrompt = null;
        installButton.style.display = 'none';
    });
}

async function registerServiceWorker() {
    if (!('serviceWorker' in navigator) || window.location.protocol === 'file:') {
        return;
    }

    try {
        await navigator.serviceWorker.register('/sw.js');
    } catch (error) {
        console.warn('Service worker registration failed.', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupAppInstallPrompt();
    registerServiceWorker();
});

console.log('Brighter Day School website loaded successfully!');
