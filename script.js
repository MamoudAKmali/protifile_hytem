// ========== Preloader ==========
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
    }, 1500);
});

// ========== Custom Cursor ==========
const cursorDot = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');
let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
});

function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    cursorOutline.style.left = outlineX + 'px';
    cursorOutline.style.top = outlineY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .project-card, .skill-card, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.style.width = '60px';
        cursorOutline.style.height = '60px';
        cursorOutline.style.borderColor = 'var(--accent-2)';
        cursorDot.style.transform = 'scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
        cursorOutline.style.width = '36px';
        cursorOutline.style.height = '36px';
        cursorOutline.style.borderColor = 'var(--accent-1)';
        cursorDot.style.transform = 'scale(1)';
    });
});

// ========== Particles Canvas ==========
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = ['56,189,248', '245,158,11', '167,139,250'][Math.floor(Math.random() * 3)];
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < 80; i++) { particles.push(new Particle()); }

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(56, 189, 248, ${0.1 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ========== Navigation ==========
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 500);
    updateActiveNav();
});

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
        const top = sec.offsetTop - 150;
        if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === current) link.classList.add('active');
    });
}

// ========== Typewriter Effect ==========
const typewriterTexts = [
    'مهندس تقنية معلومات',
    'مطور مواقع ويب',
    'مطور تطبيقات',
    'مصمم واجهات مستخدم',
    'مطور Full Stack'
];
let textIndex = 0, charIndex = 0, isDeleting = false;
const typewriterEl = document.getElementById('typewriter');

function typeWriter() {
    const currentText = typewriterTexts[textIndex];
    if (isDeleting) {
        typewriterEl.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterEl.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    let speed = isDeleting ? 50 : 100;
    if (!isDeleting && charIndex === currentText.length) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typewriterTexts.length;
        speed = 500;
    }
    setTimeout(typeWriter, speed);
}
typeWriter();

// ========== Counter Animation ==========
function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const start = performance.now();
        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    });
}

// ========== Scroll Animations ==========
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            // Trigger skill bars
            entry.target.querySelectorAll('.skill-progress').forEach(bar => {
                bar.style.width = bar.dataset.progress + '%';
            });
            // Trigger counters
            if (entry.target.querySelector('.stat-number')) {
                animateCounters();
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// ========== Skills Tabs ==========
document.querySelectorAll('.skill-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.skills-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
        // Re-trigger skill bar animations
        document.getElementById(tab.dataset.tab).querySelectorAll('.skill-progress').forEach(bar => {
            bar.style.width = '0';
            setTimeout(() => { bar.style.width = bar.dataset.progress + '%'; }, 100);
        });
    });
});

// ========== Project Filter ==========
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.project-card').forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ========== Contact Form ==========
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-submit');
    btn.innerHTML = '<span>تم الإرسال بنجاح!</span><i class="fas fa-check"></i>';
    btn.style.background = 'linear-gradient(135deg, #00d4aa, #00b894)';
    setTimeout(() => {
        btn.innerHTML = '<span>إرسال الرسالة</span><i class="fas fa-paper-plane"></i>';
        btn.style.background = '';
        e.target.reset();
    }, 3000);
});

// ========== Back to Top ==========
document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========== Smooth Scroll for Anchor Links ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========== Tilt Effect on Cards ==========
document.querySelectorAll('.project-card, .service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ========== Parallax on Hero Image ==========
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroImage = document.querySelector('.hero-image-container');
    if (heroImage && scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
});
