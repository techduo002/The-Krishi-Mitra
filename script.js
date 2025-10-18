// Navbar Scroll Shadow
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Smooth Scroll
function scrollToSection(id) {
  const element = document.getElementById(id);
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
document.querySelectorAll('#navbar a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = link.getAttribute('href').substring(1);
    scrollToSection(target);
  });
});

// Fade-in Animation on Scroll
const faders = document.querySelectorAll('.fade-in');
const appearOnScroll = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

faders.forEach(fade => appearOnScroll.observe(fade));
