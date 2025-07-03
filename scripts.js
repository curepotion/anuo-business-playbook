// Bootstrap Navigation Handling
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, checking Chart.js availability...');
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded!');
        const chartContainer = document.querySelector('#market-growth-chart');
        if (chartContainer && chartContainer.parentElement) {
            chartContainer.parentElement.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-exclamation-triangle text-warning" style="font-size:3rem;"></i>
                    <h5 class="mt-3">Chart Loading Error</h5>
                    <p class="text-muted">Unable to load chart library</p>
                    <div class="mt-3">
                        <div class="row text-center">
                            <div class="col-2"><strong>2019</strong><br><span class="text-primary">NT$152B</span></div>
                            <div class="col-2"><strong>2020</strong><br><span class="text-warning">NT$140B</span></div>
                            <div class="col-2"><strong>2021</strong><br><span class="text-warning">NT$150B</span></div>
                            <div class="col-2"><strong>2022</strong><br><span class="text-warning">NT$160B</span></div>
                            <div class="col-2"><strong>2023</strong><br><span class="text-success">NT$175B</span></div>
                            <div class="col-2"><strong>2024</strong><br><span class="text-success fw-bold">NT$186.6B</span></div>
                        </div>
                    </div>
                </div>
            `;
        }
        return;
    }
    
    console.log('Chart.js is available, proceeding with initialization...');
    
    // Bootstrap navigation
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = document.querySelectorAll('section[id], div[id]'); // Include both sections and divs with IDs
    
    // Get navbar height for scroll offset
    const navbar = document.querySelector('.navbar.fixed-bottom');
    const navbarHeight = navbar ? navbar.offsetHeight : 80;
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - navbarHeight - 20; // Account for fixed navbar + extra padding
                window.scrollTo({
                    top: Math.max(0, offsetTop), // Ensure we don't scroll to negative values
                    behavior: 'smooth'
                });
            } else {
                console.warn(`Target section not found: ${targetId}`);
            }
        });
    });
    
    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + navbarHeight + 50; // Add navbar height and some buffer
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Check if we're near the bottom of the page
        const isNearBottom = scrollPosition + windowHeight >= documentHeight - 100;
        
        let activeSectionFound = false;
        
        // Check each section
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to corresponding nav link
                const activeLink = document.querySelector(`[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    activeSectionFound = true;
                }
            }
        });
        
        // Fallback: If no section is active and we're near the bottom, activate the last nav item
        if (!activeSectionFound && isNearBottom && navLinks.length > 0) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLinks[navLinks.length - 1].classList.add('active');
        }
        
        // Fallback: If no section is active and we're at the top, activate the first nav item
        if (!activeSectionFound && scrollPosition < 100 && navLinks.length > 0) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLinks[0].classList.add('active');
        }
    }
    
    // Listen for scroll events with throttling for better performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveNavLink, 10);
    });
    
    // Initialize active state on page load
    updateActiveNavLink();
    
    // Initialize chart
    initChart();
    
    // Initialize animations
    initAnimations();
    
    // Initialize animated counters
    initAnimatedCounters();
});

// Chart Initialization
function initChart() {
    const chartCanvas = document.getElementById('market-growth-chart');
    if (chartCanvas && typeof Chart !== 'undefined') {
        const ctx = chartCanvas.getContext('2d');
        
        // Destroy existing chart if it exists
        if (window.marketGrowthChart) {
            window.marketGrowthChart.destroy();
        }
        
        window.marketGrowthChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
                datasets: [{
                    label: 'Taiwan Fitness Market Size (NT$ Billion)',
                    data: [152, 140, 150, 160, 175, 186.6],
                    borderColor: '#EC3716',
                    backgroundColor: 'rgba(236, 55, 22, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#EC3716',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                size: 14,
                                weight: 'bold'
                            },
                            color: '#333'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#EC3716',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Market Size: NT$ ${context.parsed.y}B`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 130,
                        max: 200,
                        grid: {
                            color: 'rgba(0,0,0,0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                size: 12
                            },
                            color: '#666',
                            callback: function(value) {
                                return 'NT$ ' + value + 'B';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Market Size (NT$ Billion)',
                            font: {
                                size: 14,
                                weight: 'bold'
                            },
                            color: '#333'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                size: 12
                            },
                            color: '#666'
                        },
                        title: {
                            display: true,
                            text: 'Year',
                            font: {
                                size: 14,
                                weight: 'bold'
                            },
                            color: '#333'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                elements: {
                    point: {
                        hoverBackgroundColor: '#EC3716',
                        hoverBorderColor: '#fff'
                    }
                }
            }
        });
    } else {
        console.warn('Chart canvas not found or Chart.js not loaded');
    }
}

// Animation Initialization
function initAnimations() {
    // Animate cards on scroll
    const cards = document.querySelectorAll('.card');
    
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
}

// Animated Counters
function initAnimatedCounters() {
    const counters = document.querySelectorAll('#stat-market-size, #stat-growth-rate, #stat-penetration, #stat-gyms');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const isPercentage = finalValue.includes('%');
                const isDecimal = finalValue.includes('.');
                
                let startValue = 0;
                const increment = isDecimal ? 0.1 : 1;
                const duration = 2000;
                const stepTime = duration / (parseFloat(finalValue.replace(/[^\d.]/g, '')) / increment);
                
                const timer = setInterval(() => {
                    startValue += increment;
                    if (isPercentage) {
                        target.textContent = startValue.toFixed(1) + '%';
                    } else if (isDecimal) {
                        target.textContent = startValue.toFixed(1) + 'B';
                    } else {
                        target.textContent = Math.floor(startValue).toLocaleString();
                    }
                    
                    if (startValue >= parseFloat(finalValue.replace(/[^\d.]/g, ''))) {
                        target.textContent = finalValue;
                        clearInterval(timer);
                    }
                }, stepTime);
                
                counterObserver.unobserve(target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Scroll Progress Indicator
const progressBar = document.createElement('div');
progressBar.style.position = 'fixed';
progressBar.style.top = '0';
progressBar.style.left = '0';
progressBar.style.height = '4px';
progressBar.style.background = 'linear-gradient(90deg, #0d6efd 0%, #198754 100%)';
progressBar.style.zIndex = '1000';
progressBar.style.transition = 'width 0.3s ease';
progressBar.style.boxShadow = '0 2px 8px rgba(13, 110, 253, 0.3)';
document.body.appendChild(progressBar);

// Update progress bar on scroll
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    
    progressBar.style.width = scrollPercentage + '%';
}); 