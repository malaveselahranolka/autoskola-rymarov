// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
    navbar.classList.toggle('menu-open', navLinks.classList.contains('active'));
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
        navbar.classList.remove('menu-open');
    });
});

// Scroll-triggered animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

// Add fade-in class to animatable elements
document.querySelectorAll(
    '.about-card, .service-card, .instructor-card, .news-card, .contact-card, .pricing-card, .section-header'
).forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Stagger animation delays for grid items
document.querySelectorAll('.about-grid, .services-grid, .instructors-grid, .news-grid, .contact-info').forEach(grid => {
    grid.querySelectorAll('.fade-in').forEach((item, i) => {
        item.style.transitionDelay = `${i * 0.08}s`;
    });
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const course = formData.get('course');
    const message = formData.get('message');

    // Build mailto body
    let body = `Jméno: ${name}\n`;
    if (phone) body += `Telefon: ${phone}\n`;
    if (course) body += `Zájem o: ${course}\n`;
    if (message) body += `\nZpráva:\n${message}`;

    const mailto = `mailto:ladislav.mikus@seznam.cz?subject=${encodeURIComponent('Dotaz z webu – ' + name)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
