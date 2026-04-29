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

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function encodePublicPath(url) {
    if (!url) {
        return url;
    }

    return encodeURI(url).replace(/#/g, '%23');
}

function resolveHomeNewsImageUrl(imageUrl) {
    const fallbackImage = 'BRIDAPS IMAGES/School logo.png';
    if (!imageUrl) {
        return fallbackImage;
    }

    const normalized = String(imageUrl).trim().replace(/\\/g, '/');
    if (!normalized) {
        return fallbackImage;
    }

    if (/^https?:\/\//i.test(normalized) || normalized.startsWith('/')) {
        return encodePublicPath(normalized);
    }

    return encodePublicPath(`/${normalized.replace(/^\.\//, '')}`);
}

function getStoredLatestHomeNews() {
    try {
        const storedValue = window.localStorage.getItem('bridaps-latest-home-news');
        return storedValue ? JSON.parse(storedValue) : null;
    } catch (error) {
        console.warn('Unable to read cached home news:', error);
        return null;
    }
}

function storeLatestHomeNews(article) {
    try {
        window.localStorage.setItem('bridaps-latest-home-news', JSON.stringify(article));
    } catch (error) {
        console.warn('Unable to cache home news:', error);
    }
}

function renderLatestHomeNews(latestNewsContainer, latestArticle) {
    const publishedDate = latestArticle.published_date
        ? new Date(latestArticle.published_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
        : 'Latest update';
    const excerpt = latestArticle.excerpt || 'Read the latest school update on our news page.';
    const category = latestArticle.category || 'School News';
    const authorName = latestArticle.author_name || latestArticle.author || 'Administration';
    const imageUrl = resolveHomeNewsImageUrl(latestArticle.image_url);

    latestNewsContainer.innerHTML = `
        <article class="news-card home-news-card" id="home-news-${latestArticle.id || 'latest'}">
            <div class="news-image">
                <img src="${imageUrl}" alt="${escapeHtml(latestArticle.title || 'Latest school news')}" loading="lazy">
            </div>
            <div class="news-content">
                <div class="news-top-meta">
                    <div class="news-category">
                        <i class="fas fa-tag"></i> ${escapeHtml(category)}
                    </div>
                    <div class="news-inline-date">
                        <i class="fas fa-calendar-alt"></i> ${publishedDate}
                    </div>
                </div>
                <h3 class="news-title">${escapeHtml(latestArticle.title || 'Latest school news')}</h3>
                <p class="news-excerpt">${escapeHtml(excerpt)}</p>
                <p class="home-news-author"><i class="fas fa-user"></i> by ${escapeHtml(authorName)}</p>
                <a href="news.html${latestArticle.id ? `#news-${latestArticle.id}` : ''}" class="home-news-link-inline">
                    <i class="fas fa-arrow-right"></i> Read this article on the news page
                </a>
            </div>
        </article>
    `;
}

async function loadLatestHomeNews() {
    const latestNewsContainer = document.getElementById('homeLatestNews');
    if (!latestNewsContainer) {
        return;
    }

    try {
        const response = await fetch('/news/api/articles');
        if (!response.ok) {
            throw new Error(`Failed to load latest news: ${response.status}`);
        }

        const articles = await response.json();
        const latestArticle = Array.isArray(articles) ? articles[0] : null;

        if (!latestArticle) {
            latestNewsContainer.innerHTML = `
                <article class="news-card home-news-card">
                    <div class="home-news-empty">
                        <i class="fas fa-newspaper" style="font-size: 2.25rem; margin-bottom: 0.75rem; opacity: 0.45;"></i>
                        <p>No news article has been published yet. Visit the news page for future updates.</p>
                    </div>
                </article>
            `;
            return;
        }

        const articleResponse = await fetch(`/news/api/articles/${latestArticle.id}`);
        if (!articleResponse.ok) {
            throw new Error(`Failed to load latest article: ${articleResponse.status}`);
        }

        const articleWithViewUpdate = await articleResponse.json();

        storeLatestHomeNews(articleWithViewUpdate);
        renderLatestHomeNews(latestNewsContainer, articleWithViewUpdate);
    } catch (error) {
        console.error('Error loading latest home news:', error);
        const storedArticle = getStoredLatestHomeNews();
        if (storedArticle) {
            renderLatestHomeNews(latestNewsContainer, storedArticle);
            return;
        }

        latestNewsContainer.innerHTML = `
            <article class="news-card home-news-card">
                <div class="home-news-empty">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 0.75rem; color: #c0392b;"></i>
                    <p>Latest news could not be loaded right now. You can still open the full news page.</p>
                </div>
            </article>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadLatestHomeNews();
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

function isEmbeddedBrowser() {
    return /electron/i.test(window.navigator.userAgent);
}

function showInstallGuide() {
    let overlay = document.querySelector('.install-guide-overlay');

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'install-guide-overlay';
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(16, 42, 67, 0.72);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px 16px;
            z-index: 2000;
        `;

        const card = document.createElement('div');
        card.style.cssText = `
            width: min(100%, 460px);
            border-radius: 24px;
            background: #ffffff;
            color: #102a43;
            padding: 22px 20px;
            box-shadow: 0 24px 48px rgba(16, 42, 67, 0.24);
        `;

        const title = document.createElement('h3');
        title.textContent = 'BRIDAPS APP Installation Guide';
        title.style.cssText = 'margin:0 0 10px; font-size:1.15rem;';

        const intro = document.createElement('p');
        intro.textContent = 'Use the steps below to install BRIDAPS APP on iPhone or Android.';
        intro.style.cssText = 'margin:0 0 14px; line-height:1.5; font-size:0.95rem;';

        const androidTitle = document.createElement('h4');
        androidTitle.textContent = 'Android';
        androidTitle.style.cssText = 'margin:0 0 8px; font-size:1rem;';

        const androidSteps = document.createElement('ol');
        androidSteps.style.cssText = 'margin:0 0 16px; padding-left:20px; line-height:1.6; font-size:0.95rem;';
        androidSteps.innerHTML = '<li>Open this site in Chrome or Edge.</li><li>Tap Install when your browser shows the install prompt.</li><li>If no prompt appears, open the browser menu and tap Install app or Add to Home screen.</li><li>Confirm to finish installing BRIDAPS APP.</li>';

        const iphoneTitle = document.createElement('h4');
        iphoneTitle.textContent = 'iPhone / iPad';
        iphoneTitle.style.cssText = 'margin:0 0 8px; font-size:1rem;';

        const iphoneSteps = document.createElement('ol');
        iphoneSteps.style.cssText = 'margin:0; padding-left:20px; line-height:1.6; font-size:0.95rem;';
        iphoneSteps.innerHTML = '<li>Open this site in Safari.</li><li>Tap the Share button.</li><li>Scroll down and tap Add to Home Screen.</li><li>Tap Add at the top-right to finish installing BRIDAPS APP.</li>';

        const note = document.createElement('p');
        note.textContent = 'Safari cannot open the Add to Home Screen screen directly from a website.';
        note.style.cssText = 'margin:14px 0 0; line-height:1.5; font-size:0.9rem; color:#486581;';

        const actions = document.createElement('div');
        actions.style.cssText = 'display:flex; justify-content:flex-end; gap:10px; margin-top:18px;';

        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.textContent = 'Close';
        closeButton.style.cssText = `
            border: none;
            border-radius: 999px;
            background: #102a43;
            color: #ffffff;
            padding: 10px 16px;
            font-weight: 700;
            cursor: pointer;
        `;

        const hideGuide = () => {
            overlay.style.display = 'none';
        };

        closeButton.addEventListener('click', hideGuide);
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                hideGuide();
            }
        });

        actions.appendChild(closeButton);
        card.appendChild(title);
        card.appendChild(intro);
        card.appendChild(androidTitle);
        card.appendChild(androidSteps);
        card.appendChild(iphoneTitle);
        card.appendChild(iphoneSteps);
        card.appendChild(note);
        card.appendChild(actions);
        overlay.appendChild(card);
        document.body.appendChild(overlay);
    }

    overlay.style.display = 'flex';
}

async function handleInstallAction(triggerButton) {
    if (deferredInstallPrompt) {
        const promptEvent = deferredInstallPrompt;
        deferredInstallPrompt = null;

        try {
            await promptEvent.prompt();
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
        window.alert('Direct install is not available on this device. Use the Installation guide button.');
        return;
    }

    if (isEmbeddedBrowser()) {
        window.alert('Direct install is not available in this browser. Use the Installation guide button.');
        return;
    }

    window.alert('Install is not available in this browser session right now.');
}

function closeMobileMenu() {
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

function createMobileInstallBanner() {
    if (document.querySelector('.mobile-install-banner')) {
        return document.querySelector('.mobile-install-banner');
    }

    const banner = document.createElement('div');
    banner.className = 'mobile-install-banner';
    banner.style.cssText = `
        position: sticky;
        top: env(safe-area-inset-top, 0px);
        left: 0;
        right: 0;
        margin-top: 0;
        z-index: 1001;
        display: none;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        width: auto;
        padding: 8px 12px;
        border-radius: 0;
        background: linear-gradient(135deg, #102a43, #1B4F72);
        color: #ffffff;
        box-shadow: 0 6px 14px rgba(16, 42, 67, 0.18);
    `;

    const text = document.createElement('div');
    text.style.cssText = 'display:flex; flex:1; flex-direction:column; align-items:flex-start; gap:4px; min-width:0;';
    text.innerHTML = '<strong style="font-size:0.88rem; line-height:1.1;">Install BRIDAPS APP</strong><span style="font-size:0.74rem; opacity:0.88; line-height:1.2;">Save the school website as an app on your phone.</span>';

    const guideButton = document.createElement('button');
    guideButton.type = 'button';
    guideButton.className = 'mobile-install-guide-btn';
    guideButton.style.cssText = `
        border: 1px solid rgba(255, 255, 255, 0.35);
        border-radius: 999px;
        background: transparent;
        color: #ffffff;
        font-size: 0.72rem;
        font-weight: 600;
        padding: 4px 9px;
        cursor: pointer;
        white-space: nowrap;
        flex-shrink: 0;
    `;
    guideButton.textContent = 'Installation guide';
    guideButton.addEventListener('click', showInstallGuide);

    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'mobile-install-banner-btn';
    action.style.cssText = `
        border: none;
        border-radius: 999px;
        background: #FDB913;
        color: #102a43;
        font-weight: 700;
        padding: 8px 12px;
        cursor: pointer;
        white-space: nowrap;
        flex-shrink: 0;
    `;
    action.textContent = 'Install';
    action.addEventListener('click', () => handleInstallAction(action));

    text.appendChild(guideButton);
    banner.appendChild(text);
    banner.appendChild(action);

    const navbar = document.querySelector('.navbar');
    if (navbar && navbar.parentNode) {
        navbar.parentNode.insertBefore(banner, navbar.nextSibling);
    } else {
        document.body.insertBefore(banner, document.body.firstChild);
    }

    return banner;
}

function setupAppInstallPrompt() {
    const banner = createMobileInstallBanner();
    const navbar = document.querySelector('.navbar');

    const updateBannerPlacement = () => {
        if (!banner) {
            return;
        }

        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        banner.style.marginTop = `${Math.max(navbarHeight - 6, 0)}px`;
    };

    const setInstallLabels = (label, title) => {
        if (banner) {
            const bannerButton = banner.querySelector('.mobile-install-banner-btn');
            if (bannerButton) {
                bannerButton.textContent = label.startsWith('Add') ? 'Add Now' : 'Install';
                bannerButton.title = title;
            }
        }
    };

    const showBanner = () => {
        if (banner) {
            updateBannerPlacement();
            banner.style.display = 'flex';
        }
    };

    if (isStandaloneMode()) {
        if (banner) {
            banner.style.display = 'none';
        }
        return;
    }

    showBanner();
    window.addEventListener('resize', updateBannerPlacement);
    window.addEventListener('load', showBanner);

    if (!isInstallSupportedContext()) {
        setInstallLabels('Install BRIDAPS APP', 'Open this site on localhost or HTTPS to install it as an app.');
        return;
    }

    if (isIosDevice()) {
        setInstallLabels('Install BRIDAPS APP', 'Use Safari Share > Add to Home Screen.');
        return;
    }

    setInstallLabels('Install BRIDAPS APP', 'Install BRIDAPS as an app on this device.');

    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        deferredInstallPrompt = event;
        setInstallLabels('Install BRIDAPS APP', 'Install BRIDAPS as an app on this device.');
        showBanner();
    });

    window.addEventListener('appinstalled', () => {
        deferredInstallPrompt = null;
        if (banner) {
            banner.style.display = 'none';
        }
    });
}

async function registerServiceWorker() {
    if (!('serviceWorker' in navigator) || window.location.protocol === 'file:') {
        return;
    }

    try {
        await navigator.serviceWorker.register('/sw.js?v=20260429');
    } catch (error) {
        console.warn('Service worker registration failed.', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupAppInstallPrompt();
    registerServiceWorker();
});

console.log('Brighter Day School website loaded successfully!');
