class NeuralNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.nodeCount = 50;
        this.connectionDistance = 150;
        this.mouse = { x: null, y: null };
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.nodes = [];
        for (let i = 0; i < this.nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw nodes
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            // Bounce off walls
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;

            // Draw node
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(64, 224, 208, 0.5)';
            this.ctx.fill();

            // Connect nodes
            this.nodes.forEach(otherNode => {
                const dx = node.x - otherNode.x;
                const dy = node.y - otherNode.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(node.x, node.y);
                    this.ctx.lineTo(otherNode.x, otherNode.y);
                    this.ctx.strokeStyle = `rgba(64, 224, 208, ${1 - distance / this.connectionDistance})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
            
            // Connect to mouse
            if (this.mouse.x != null) {
                 const dx = node.x - this.mouse.x;
                 const dy = node.y - this.mouse.y;
                 const distance = Math.sqrt(dx * dx + dy * dy);
                 if (distance < 200) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(node.x, node.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 200})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                 }
            }
        });
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
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

    }
}

// Modern GSAP-powered Text Animation
function revealText(element, text) {
    if (!element || typeof gsap === 'undefined') return;
    
    element.innerHTML = ''; // Clear existing content
    
    // Split text into words
    const words = text.split(' ');
    
    words.forEach((word) => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(30px)';
        element.appendChild(span);
    });
    
    // Animate with GSAP
    const spans = element.querySelectorAll('span');
    gsap.to(spans, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power3.out',
        delay: 0.3
    });
    
    // Remove cursor blink if present
    const cursor = document.querySelector('.cursor-blink');
    if (cursor) cursor.style.display = 'none';
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
    return num + '+';
}

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Trigger specific animations based on element type
            if (entry.target.classList.contains('stat-item')) {
                const count = parseInt(entry.target.dataset.count);
                const numberElement = entry.target.querySelector('.stat-number');
                animateCounter(numberElement, count);
            }
            
            if (entry.target.classList.contains('progress-fill')) {
                const progress = entry.target.dataset.progress;
                entry.target.style.width = progress + '%';
            }
            
            if (entry.target.classList.contains('data-visualization')) {
                // Simple chart animation or init could go here
                const ctx = entry.target.getContext('2d');
                const type = entry.target.dataset.type;
                // drawChart(ctx, type); // Placeholder for chart drawing
            }

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Chart Drawing Functions (Simplified placeholders)
function drawChart(ctx, type) {
    // ... chart drawing logic ...
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
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.news-card, .about-text, .stat-item, .progress-fill, .conference-card, .publication-item');
    animatedElements.forEach(el => observer.observe(el));

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

    // Text Reveal Animation
    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const originalText = typingText.textContent;
        // Small delay before starting
        setTimeout(() => {
             revealText(typingText, originalText);
        }, 500);
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
        .visible {
            animation: fadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
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
                heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
                heroContent.style.opacity = 1 - (scrolled / hero.offsetHeight) * 0.8;
            }
        });
    }

    // Initialize Lenis Smooth Scroll
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Update smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    lenis.scrollTo(target, {
                        offset: -80,
                        duration: 1.5,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                }
            });
        });
    }

    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 0,
        });
    }

    // GSAP ScrollTrigger Animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Parallax hero content with GSAP
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            gsap.to(heroContent, {
                y: -100,
                opacity: 0,
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        }

        // Animate cards on scroll
        gsap.utils.toArray('.news-card, .conference-card, .publication-item, .team-member').forEach((card, i) => {
            gsap.from(card, {
                y: 60,
                opacity: 0,
                duration: 0.8,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                delay: i * 0.1
            });
        });

        // Interactive hover effects for team members
        document.querySelectorAll('.team-member').forEach(member => {
            member.addEventListener('mouseenter', function() {
                gsap.to(this, {
                    scale: 1.02,
                    y: -10,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            member.addEventListener('mouseleave', function() {
                gsap.to(this, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });

        // Interactive card tilt effect
        document.querySelectorAll('.conference-card, .news-card').forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                gsap.to(card, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    transformPerspective: 1000,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            card.addEventListener('mouseleave', function() {
                gsap.to(card, {
                    rotationX: 0,
                    rotationY: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });
        });

        // Animate stats
        gsap.utils.toArray('.stat-item').forEach((stat) => {
            const count = parseInt(stat.dataset.count);
            const numberElement = stat.querySelector('.stat-number');
            
            ScrollTrigger.create({
                trigger: stat,
                start: 'top 80%',
                onEnter: () => {
                    gsap.to({ value: 0 }, {
                        value: count,
                        duration: 2,
                        ease: 'power2.out',
                        onUpdate: function() {
                            numberElement.textContent = formatNumber(Math.floor(this.targets()[0].value)) + '+';
                        }
                    });
                }
            });
        });
    }

    // Add loading animation with GSAP
    if (typeof gsap !== 'undefined') {
        gsap.from('body', {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out'
        });
    } else {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-in';
        void document.body.offsetWidth; 
        document.body.style.opacity = '1';
    }
});
