// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a nav link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // Navbar color change on scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for navbar height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Project filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Form submission handling removed (contact form was deleted)

    // Skills: animate bars when skills section enters/leaves viewport
    const skillsSection = document.getElementById('skills');
    const skillLevels = document.querySelectorAll('.skill-level');

    function setSkillWidth(el, value) {
        const v = Math.max(0, Math.min(100, Number(value) || 0));
        el.style.width = v + '%';
        el.setAttribute('aria-valuenow', v);
        const percentEl = el.closest('.skill-item') ? el.closest('.skill-item').querySelector('.skill-percent') : null;
        if (percentEl) {
            // If percent text is numeric (ends with % or is a number), update it; otherwise leave labels like "Learning"
            const current = percentEl.textContent.trim();
            if (/^\d+%?$/.test(current) || current === '' ) {
                percentEl.textContent = v + '%';
            }
        }
    }

    if (skillsSection && skillLevels.length) {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // expand to target
                        skillLevels.forEach(level => setSkillWidth(level, level.getAttribute('data-level')));
                    } else {
                        // collapse to 0 when out of view
                        skillLevels.forEach(level => setSkillWidth(level, 0));
                    }
                });
            }, { threshold: 0.25 });

            observer.observe(skillsSection);
        } else {
            // fallback: animate once when near top
            const onScroll = () => {
                const rect = skillsSection.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
                    skillLevels.forEach(level => setSkillWidth(level, level.getAttribute('data-level')));
                } else {
                    skillLevels.forEach(level => setSkillWidth(level, 0));
                }
            };
            window.addEventListener('scroll', onScroll);
            onScroll();
        }
    }

    // Theme toggle: remember choice in localStorage and apply on load
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const THEME_KEY = 'theme';

    function applyTheme(theme) {
        // add transition helper class so the switch animates smoothly
        root.classList.add('theme-transition');
        // remove the transition helper after the animation completes
        window.setTimeout(() => root.classList.remove('theme-transition'), 400);

        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            root.removeAttribute('data-theme');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* ignore */ }
    }

    // initialize theme from localStorage or prefers-color-scheme
    (function initTheme() {
        let saved = null;
        try { saved = localStorage.getItem(THEME_KEY); } catch (e) { saved = null; }
        if (saved === 'dark' || saved === 'light') {
            applyTheme(saved);
            return;
        }
        // fallback to OS preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    })();

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
        });
    }
});