// Navigation Handling
const navLinks = document.querySelectorAll('.sidebar-nav nav ul li a');
const floatingNavToggle = document.getElementById('floating-nav-toggle');
const sidebarNav = document.getElementById('sidebar-nav');

// Floating Navigation Toggle
floatingNavToggle.addEventListener('click', () => {
    sidebarNav.classList.toggle('active');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebarNav.contains(e.target) && !floatingNavToggle.contains(e.target)) {
            sidebarNav.classList.remove('active');
        }
    }
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        targetSection.scrollIntoView({ behavior: 'smooth' });
        
        // Close mobile sidebar after navigation
        if (window.innerWidth <= 768) {
            sidebarNav.classList.remove('active');
        }
    });
});

// Intersection Observer for Animations
const sections = document.querySelectorAll('.chapter');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Scroll Progress Indicator
const progressBar = document.createElement('div');
progressBar.style.position = 'fixed';
progressBar.style.top = '0';
progressBar.style.left = '0';
progressBar.style.height = '5px';
progressBar.style.background = 'linear-gradient(90deg, #EC3716 0%, #FF5A3C 100%)';
progressBar.style.zIndex = '1000';
progressBar.style.transition = 'width 0.3s ease';
progressBar.style.boxShadow = '0 2px 8px rgba(236, 55, 22, 0.3)';
document.body.appendChild(progressBar);

// Navigation Progress Tracking
const navProgressFill = document.getElementById('nav-progress-fill');
const navProgressText = document.getElementById('nav-progress-text');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    
    // Update main progress bar
    progressBar.style.width = scrollPercentage + '%';
    
    // Update navigation progress
    if (navProgressFill && navProgressText) {
        navProgressFill.style.width = scrollPercentage + '%';
        navProgressText.textContent = Math.round(scrollPercentage) + '%';
    }
    
    // Update active navigation link
    updateActiveNavLink();
});

// Update Active Navigation Link
function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 100;
    
    navLinks.forEach(link => {
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const sectionTop = targetSection.offsetTop;
            const sectionBottom = sectionTop + targetSection.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}

// Load JavaScript loaded class for animations
window.addEventListener('DOMContentLoaded', () => {
    // Add JavaScript loaded class for animations
    document.body.classList.add('js-loaded');
});

// Chart Initialization
function initMarketGrowthChart() {
    const ctx = document.getElementById('market-growth-chart');
    if (!ctx) return;
    
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
            datasets: [{
                label: 'Market Value (NTD Billion)',
                data: [152, 140, 150, 160, 175, 186.6],
                borderColor: '#EC3716',
                backgroundColor: 'rgba(236, 55, 22, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                }
            }
        }
    });
}

// Initialize chart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMarketGrowthChart();
});

// Smooth reveal animations for cards
const cards = document.querySelectorAll('.info-card, .competitor-card, .model-card, .strategy-item');

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    cardObserver.observe(card);
});

// Add stagger effect to grid items
function addStaggerEffect() {
    const gridItems = document.querySelectorAll('.stats-grid .stat-item, .competitors-grid .competitor-card, .revenue-models .model-card, .strategy-grid .strategy-item');
    
    gridItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });
}

// Initialize stagger effect
document.addEventListener('DOMContentLoaded', addStaggerEffect); 