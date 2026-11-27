const navbar = document.querySelector('[data-navbar]');
const menuButton = document.querySelector('.navbar__toggle');
const menu = document.querySelector('.navbar__links');
const menuLinks = document.querySelectorAll('.navbar__links a');

function setMenu(open) {
  menu.classList.toggle('is-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('.sr-only').textContent = open ? 'Fechar menu' : 'Abrir menu';
}

menuButton.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

menuLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));

document.addEventListener('click', (event) => {
  if (!navbar.contains(event.target)) setMenu(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setMenu(false);
    menuButton.focus();
  }
});

const sections = [...document.querySelectorAll('main section[id]')];
const linksBySection = new Map(
  [...menuLinks].map((link) => [link.getAttribute('href').slice(1), link])
);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      menuLinks.forEach((link) => link.removeAttribute('aria-current'));
      linksBySection.get(entry.target.id)?.setAttribute('aria-current', 'page');
    });
  }, { rootMargin: '-25% 0px -65%', threshold: 0 });

  sections.forEach((section) => observer.observe(section));
}

document.querySelector('[data-current-year]').textContent = new Date().getFullYear();

const terminalCode = document.querySelector('[data-terminal-code]');
const terminalOutput = document.querySelector('[data-terminal-output]');
const pythonHelloWorld = 'print("Hello, World!")';

function showTerminalComplete() {
  terminalCode.textContent = pythonHelloWorld;
  terminalOutput.textContent = 'Hello, World!';
  terminalOutput.classList.add('is-visible');
}

function typeTerminalCode() {
  let index = 0;

  const typeNextCharacter = () => {
    terminalCode.textContent = pythonHelloWorld.slice(0, index);
    index += 1;

    if (index <= pythonHelloWorld.length) {
      window.setTimeout(typeNextCharacter, 75);
      return;
    }

    window.setTimeout(() => {
      terminalOutput.textContent = 'Hello, World!';
      terminalOutput.classList.add('is-visible');
    }, 350);
  };

  typeNextCharacter();
}

if (terminalCode && terminalOutput) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    showTerminalComplete();
  } else {
    typeTerminalCode();
  }
}

document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const slides = [...carousel.querySelectorAll('.project-carousel__slide')];
  const previousButton = carousel.querySelector('[data-carousel-prev]');
  const nextButton = carousel.querySelector('[data-carousel-next]');
  const status = carousel.querySelector('[data-carousel-status]');
  let currentIndex = 0;
  let pointerStartX = null;

  const showSlide = (requestedIndex) => {
    currentIndex = (requestedIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      const active = index === currentIndex;
      slide.hidden = !active;
      slide.classList.toggle('is-active', active);
    });
    const current = String(currentIndex + 1).padStart(2, '0');
    const total = String(slides.length).padStart(2, '0');
    status.textContent = `${current} / ${total}`;
    status.setAttribute('aria-label', `Imagem ${currentIndex + 1} de ${slides.length}`);
  };

  previousButton.addEventListener('click', () => showSlide(currentIndex - 1));
  nextButton.addEventListener('click', () => showSlide(currentIndex + 1));

  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showSlide(currentIndex - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showSlide(currentIndex + 1);
    }
  });

  carousel.addEventListener('pointerdown', (event) => {
    pointerStartX = event.clientX;
  });

  carousel.addEventListener('pointerup', (event) => {
    if (pointerStartX === null) return;
    const distance = event.clientX - pointerStartX;
    pointerStartX = null;
    if (Math.abs(distance) < 45) return;
    showSlide(currentIndex + (distance < 0 ? 1 : -1));
  });

  showSlide(0);
});
