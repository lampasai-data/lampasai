const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

const form = document.getElementById('contact-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button');
  const original = btn.textContent;
  btn.textContent = 'Message envoyé ✓';
  btn.disabled = true;
  form.reset();
  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
  }, 3000);
});
