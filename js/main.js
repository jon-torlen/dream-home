/* ============================================================
   Dwello — interacciones (JavaScript vanilla, ES Module)
   ============================================================ */

/* ==== Menú móvil ==== */
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
  mainNav.classList.toggle('is-open', !isOpen);
});

mainNav.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    mainNav.querySelectorAll('.nav-link').forEach((item) => item.classList.remove('is-active'));
    link.classList.add('is-active');
  });
});

/* ==== Buscador: filtra las residencias ==== */
const searchForm = document.getElementById('search-form');
const locationInput = document.getElementById('search-location');
const typeSelect = document.getElementById('search-type');
const priceSelect = document.getElementById('search-price');
const cards = [...document.querySelectorAll('.residence-card')];
const filterStatus = document.getElementById('filter-status');
const noResults = document.getElementById('no-results');

function matchesPrice(price, range) {
  if (!range) return true;
  if (range === 'low') return price < 1000000;
  if (range === 'mid') return price >= 1000000 && price <= 3000000;
  if (range === 'high') return price > 3000000;
  return true;
}

function filterResidences() {
  const place = locationInput.value.trim().toLowerCase();
  const type = typeSelect.value;
  const range = priceSelect.value;
  let visible = 0;

  cards.forEach((card) => {
    const okPlace = !place || card.dataset.location.includes(place);
    const okType = !type || card.dataset.type === type;
    const okPrice = matchesPrice(Number(card.dataset.price), range);
    const show = okPlace && okType && okPrice;
    card.classList.toggle('is-hidden', !show);
    if (show) visible += 1;
  });

  noResults.hidden = visible !== 0;
  filterStatus.textContent = `${visible} ${visible === 1 ? 'home' : 'homes'} found`;
  if (visible > 0) {
    document.getElementById('residences').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  filterResidences();
});

/* El selector muestra el placeholder en gris hasta que se elige una opción */
[typeSelect, priceSelect].forEach((select) => {
  select.addEventListener('change', () => select.classList.toggle('has-value', Boolean(select.value)));
});

/* El icono de búsqueda del header lleva al buscador */
document.getElementById('search-toggle').addEventListener('click', () => {
  locationInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
  locationInput.focus({ preventScroll: true });
});

/* ==== Carrusel de testimonios ==== */
const testimonials = [
  {
    name: 'Sarah Nguyen', city: 'San Francisco', rating: '5.0',
    image: 'assets/testimonial-sarah.jpg', avatar: 'assets/avatar-sarah.jpg',
    text: "Dwello truly cares about their clients. They listened to my needs and preferences and helped me find the perfect home in the Bay Area. Their professionalism and attention to detail are unmatched."
  },
  {
    name: 'Michael Rodriguez', city: 'San Diego', rating: '4.5',
    image: 'assets/testimonial-michael.jpg', avatar: 'assets/avatar-michael.jpg',
    text: "I had a fantastic experience working with Dwello. Their expertise and personalized service exceeded my expectations. I found my dream home quickly and smoothly. Highly recommended!"
  },
  {
    name: 'Emily Johnson', city: 'Los Angeles', rating: '5.0',
    image: 'assets/testimonial-emily.jpg', avatar: 'assets/avatar-emily.jpg',
    text: "Dwello made my dream of owning a home a reality! Their team provided exceptional support and guided me through every step of the process. I couldn't be happier with my new home!"
  }
];

const testimonialGrid = document.getElementById('testimonial-grid');
let testimonialOffset = 0;

function renderTestimonials() {
  testimonialGrid.innerHTML = '';
  for (let i = 0; i < 3; i += 1) {
    const item = testimonials[(i + testimonialOffset) % testimonials.length];
    const card = document.createElement('article');
    card.className = 'testimonial-card';
    card.innerHTML = `
      <img src="${item.image}" alt="Home interior for ${item.name}'s testimonial">
      <div class="testimonial-body">
        <div class="testimonial-head">
          <img class="avatar" src="${item.avatar}" alt="">
          <div class="testimonial-name"><strong>${item.name}</strong><span>${item.city}</span></div>
          <div class="rating"><span class="star">★</span>${item.rating}</div>
        </div>
        <p>${item.text}</p>
      </div>`;
    testimonialGrid.appendChild(card);
  }
}

function rotateTestimonials(step) {
  testimonialOffset = (testimonialOffset + step + testimonials.length) % testimonials.length;
  renderTestimonials();
}

renderTestimonials();
document.getElementById('prev-testimonial').addEventListener('click', () => rotateTestimonials(-1));
document.getElementById('next-testimonial').addEventListener('click', () => rotateTestimonials(1));

/* ==== Formulario de contacto ==== */
const newsletterForm = document.getElementById('newsletter-form');
const emailInput = document.getElementById('newsletter-email');
const formMessage = document.getElementById('form-message');

newsletterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!emailInput.checkValidity()) {
    formMessage.textContent = 'Please enter a valid email address.';
    formMessage.style.color = '#a33';
    emailInput.focus();
    return;
  }
  formMessage.textContent = "Thanks! We'll be in touch soon.";
  formMessage.style.color = 'var(--dark)';
  newsletterForm.reset();
});
