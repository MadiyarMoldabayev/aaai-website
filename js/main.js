// Neural Network Visualization
class NeuralNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.createNodes();
        this.createConnections();
        this.animate();
    }
    
    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
    
    createNodes() {
        const nodeCount = 15;
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: 3 + Math.random() * 2,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }
    }
    
    createConnections() {
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.connections.push({
                        from: i,
                        to: j,
                        opacity: 1 - distance / 150
                    });
                }
            }
        }
    }
    
    update() {
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        
        // Draw connections
        this.connections.forEach(conn => {
            const from = this.nodes[conn.from];
            const to = this.nodes[conn.to];
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                this.ctx.globalAlpha = conn.opacity * 0.3;
                this.ctx.beginPath();
                this.ctx.moveTo(from.x, from.y);
                this.ctx.lineTo(to.x, to.y);
                this.ctx.stroke();
            }
        });
        
        // Draw nodes
        this.ctx.globalAlpha = 0.8;
        this.nodes.forEach(node => {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.ctx.globalAlpha = 1;
    }
    
    animate() {
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Particle System
class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.particleCount = 30;
        this.init();
    }
    
    init() {
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        this.container.appendChild(particle);
        this.particles.push(particle);
    }
}

// Typing Animation
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Counter Animation
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K+';
    }
    return Math.floor(num) + '+';
}

// Progress Bar Animation
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        setTimeout(() => {
            bar.style.width = progress + '%';
        }, 500);
    });
}

// Data Visualization
function createDataVisualization(canvas, type) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    
    ctx.strokeStyle = 'rgba(0, 102, 204, 0.6)';
    ctx.fillStyle = 'rgba(0, 102, 204, 0.2)';
    ctx.lineWidth = 2;
    
    if (type === 'line') {
        drawLineChart(ctx, width, height);
    } else if (type === 'bar') {
        drawBarChart(ctx, width, height);
    } else if (type === 'pie') {
        drawPieChart(ctx, width, height);
    }
}

function drawLineChart(ctx, width, height) {
    const points = 8;
    const data = [];
    for (let i = 0; i < points; i++) {
        data.push(Math.random() * 0.6 + 0.2);
    }
    
    ctx.beginPath();
    const stepX = width / (points - 1);
    data.forEach((value, i) => {
        const x = i * stepX;
        const y = height - (value * height);
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    
    // Fill area
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
}

function drawBarChart(ctx, width, height) {
    const bars = 6;
    const barWidth = width / bars - 10;
    const stepX = width / bars;
    
    for (let i = 0; i < bars; i++) {
        const barHeight = (Math.random() * 0.7 + 0.2) * height;
        const x = i * stepX + 5;
        const y = height - barHeight;
        
        ctx.fillRect(x, y, barWidth, barHeight);
    }
}

function drawPieChart(ctx, width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    const slices = 4;
    const data = [0.3, 0.25, 0.25, 0.2];
    
    let currentAngle = -Math.PI / 2;
    data.forEach((value, i) => {
        const sliceAngle = value * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();
        currentAngle += sliceAngle;
    });
}

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnToggle = navToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#home') {
            e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinksArray = Array.from(navLinks);

    function highlightNavLink() {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop - 100 && scrollY < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });

        navLinksArray.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink(); // Call once on load

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.08)';
        }

        lastScroll = currentScroll;
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.news-card, .conference-card, .publication-item, .resource-card, .about-text, .stat-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Simple validation
            if (!name || !email || !subject || !message) {
                showFormMessage('Пожалуйста, заполните все поля.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('Пожалуйста, введите действительный адрес электронной почты.', 'error');
                return;
            }

            // Simulate form submission (replace with actual form handling)
            showFormMessage('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.', 'success');
            contactForm.reset();
        });
    }

    function showFormMessage(message, type) {
        // Remove existing message if any
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message-${type}`;
        messageEl.textContent = message || (type === 'success' ? 'Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.' : 'Пожалуйста, заполните все поля.');
        messageEl.style.cssText = `
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 8px;
            font-weight: 500;
            animation: fadeIn 0.3s ease-out;
        `;

        if (type === 'success') {
            messageEl.style.backgroundColor = '#d4edda';
            messageEl.style.color = '#155724';
            messageEl.style.border = '1px solid #c3e6cb';
        } else {
            messageEl.style.backgroundColor = '#f8d7da';
            messageEl.style.color = '#721c24';
            messageEl.style.border = '1px solid #f5c6cb';
        }

        contactForm.appendChild(messageEl);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageEl.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                messageEl.remove();
            }, 300);
        }, 5000);
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-10px);
            }
        }
        .nav-menu a.active {
            color: var(--primary-color);
        }
        .nav-menu a.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(style);

    // Parallax effect for hero section (subtle)
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent && scrolled < hero.offsetHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / hero.offsetHeight) * 0.5;
            }
        });
    }

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease-in';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // Initialize Neural Network
    const neuralCanvas = document.getElementById('neural-network');
    if (neuralCanvas) {
        new NeuralNetwork(neuralCanvas);
    }

    // Initialize Particle System
    const particleContainer = document.getElementById('particles');
    if (particleContainer) {
        new ParticleSystem(particleContainer);
    }

    // Typing Animation
    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const originalText = typingText.textContent;
        const texts = [
            'Развитие искусственного интеллекта',
            'Формирование будущего ИИ',
            'Ведущие исследования ИИ',
            'Создание интеллектуальных систем'
        ];
        let currentIndex = 0;
        
        function startTyping() {
            const text = texts[currentIndex];
            typeWriter(typingText, text, 80);
            currentIndex = (currentIndex + 1) % texts.length;
        }
        
        // Start typing animation after initial load
        setTimeout(() => {
            startTyping();
            setInterval(() => {
                setTimeout(() => {
                    typingText.textContent = '';
                    setTimeout(startTyping, 500);
                }, 2000);
            }, 6000);
        }, 1000);
    }

    // Animate counters when in view
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statItem = entry.target;
                const count = parseInt(statItem.getAttribute('data-count'));
                const numberEl = statItem.querySelector('.stat-number');
                
                if (numberEl && !statItem.classList.contains('animated')) {
                    statItem.classList.add('animated');
                    animateCounter(numberEl, count);
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-item[data-count]').forEach(item => {
        counterObserver.observe(item);
    });

    // Animate progress bars when in view
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBars();
                progressObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        progressObserver.observe(aboutSection);
    }

    // Animate mini stats on hover
    document.querySelectorAll('.interactive-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const miniStats = this.querySelectorAll('.mini-stat-value');
            miniStats.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                if (target && !stat.classList.contains('animated')) {
                    stat.classList.add('animated');
                    let current = 0;
                    const increment = target / 30;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            stat.textContent = target.toLocaleString();
                            clearInterval(timer);
                        } else {
                            stat.textContent = Math.floor(current).toLocaleString();
                        }
                    }, 50);
                }
            });
        });
    });

    // Initialize data visualizations
    document.querySelectorAll('.data-visualization').forEach(canvas => {
        const type = canvas.getAttribute('data-type');
        createDataVisualization(canvas, type);
        
        // Animate on hover
        const pubItem = canvas.closest('.interactive-pub');
        if (pubItem) {
            pubItem.addEventListener('mouseenter', () => {
                createDataVisualization(canvas, type);
            });
        }
    });

    // Add interactive ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add CSS for ripple effect
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
});
