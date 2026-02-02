const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('[data-collapsible]');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

reveals.forEach(el => observer.observe(el));

const priceMap = {
  diagnostika: 1200,
  brzdy: 3800,
  olej: 1600,
  pneu: 1400,
  klimatizace: 2200,
  geometrie: 2400
};

const carMultiplier = {
  osobni: 1,
  suv: 1.2,
  dodavka: 1.35
};

const serviceSelect = document.getElementById('service-select');
const carSelect = document.getElementById('car-select');
const express = document.getElementById('express');
const priceTotal = document.getElementById('price-total');
const priceBreakdown = document.getElementById('price-breakdown');

const formatPrice = value => `${value.toLocaleString('cs-CZ')} Kč`;

function updatePrice() {
  const service = serviceSelect.value;
  if (!service) {
    priceTotal.textContent = '0 Kč';
    priceBreakdown.innerHTML = '<li>Vyberte službu pro výpočet.</li>';
    return;
  }

  const base = priceMap[service];
  const multiplier = carMultiplier[carSelect.value];
  const expressFee = express.checked ? 900 : 0;
  const subtotal = Math.round(base * multiplier);
  const total = subtotal + expressFee;

  priceTotal.textContent = formatPrice(total);
  priceBreakdown.innerHTML = `
    <li>Základ služby: <strong>${formatPrice(base)}</strong></li>
    <li>Typ vozu: <strong>x${multiplier}</strong></li>
    <li>Mezisoučet: <strong>${formatPrice(subtotal)}</strong></li>
    <li>Express příplatek: <strong>${formatPrice(expressFee)}</strong></li>
  `;
}

[serviceSelect, carSelect, express].forEach(el => el.addEventListener('input', updatePrice));

const slider = document.getElementById('ba-slider');
const beforeLayer = document.getElementById('ba-before');
const line = document.getElementById('ba-line');

slider.addEventListener('input', e => {
  const value = e.target.value;
  beforeLayer.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
  line.style.left = `${value}%`;
});

const reviewList = document.getElementById('review-list');
const sortButtons = document.querySelectorAll('[data-sort]');

sortButtons.forEach(button => {
  button.addEventListener('click', () => {
    sortButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const sortType = button.dataset.sort;
    const items = Array.from(reviewList.children);

    items.sort((a, b) => {
      if (sortType === 'best') {
        return Number(b.dataset.rating) - Number(a.dataset.rating);
      }
      return new Date(b.dataset.date) - new Date(a.dataset.date);
    });

    items.forEach(item => reviewList.appendChild(item));
  });
});

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const button = item.querySelector('.faq-question');
  button.addEventListener('click', () => {
    const isOpen = item.classList.toggle('open');
    button.setAttribute('aria-expanded', isOpen);
  });
});

const bookingForm = document.getElementById('booking-form');
const formStatus = document.getElementById('form-status');
const toast = document.getElementById('toast');

const showToast = message => {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
};

bookingForm.addEventListener('submit', event => {
  event.preventDefault();
  formStatus.textContent = '';

  if (!bookingForm.checkValidity()) {
    formStatus.textContent = 'Zkontrolujte povinná pole.';
    showToast('Formulář není kompletní.');
    return;
  }

  formStatus.textContent = 'Odesílám…';
  bookingForm.querySelector('button').disabled = true;

  setTimeout(() => {
    bookingForm.reset();
    bookingForm.querySelector('button').disabled = false;
    formStatus.textContent = 'Děkujeme, ozveme se do 15 minut.';
    showToast('Objednávka odeslána.');
  }, 800);
});

const copyButton = document.getElementById('copy-address');
const address = document.getElementById('address').textContent;

copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(address);
    showToast('Adresa zkopírována.');
  } catch (error) {
    showToast('Nelze zkopírovat adresu.');
  }
});
