const defaultSiteContent = {
  siteName: 'MNTS DSGN',
  heroSubtitle: 'Designing spaces with intention, rhythm, and clarity.',
  heroTitle: '#MaterialityInMotion',
  heroButton: 'Discover Our Work',
  heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000',
  aboutTitle: 'Designing spaces that feel natural, intentional, and alive.',
  aboutText: 'We shape architectural and interior experiences around the relationship between people, nature, and atmosphere. Every project is approached with clarity, warmth, and a deep respect for the land and the lived experience of the space.',
  insightTitle: 'Thoughtful stories and design insight from our practice.',
  insightList: [
    { label: 'Research', text: 'Materiality and climate' },
    { label: 'Process', text: 'Human-centered design flows' },
    { label: 'Journal', text: 'Spaces that settle into place' }
  ],
  careerTitle: 'Join a studio that designs with care and composition.',
  careerText: 'We are growing our studio and looking for curious collaborators who value craftsmanship, spatial clarity, and a meaningful architectural process.',
  contactPhone: '+62 88102 2020 380',
  contactAddress: 'Jalan Pulolaut No 27, Bandung, West Java',
  contactEmail: 'hello@studioasa.co',
  whatsappUrl: 'https://wa.me/62881022020380',
  instagramUrl: 'https://instagram.com/',
  linkedinUrl: 'https://linkedin.com/',
  studioYears: '8+',
  projectCount: '81',
  regionCount: '12',
  services: [
    { name: 'Architecture', count: '21 Projects' },
    { name: 'Interior Design', count: '27 Projects' },
    { name: 'Garden Design', count: '33 Projects' }
  ]
};

async function getProjectData() {
  if (window.mntsSupabase && window.mntsSupabase.enabled) {
    const remote = await window.mntsSupabase.getProjects();
    return remote || [];
  }
  return [];
}

async function getStoredContent() {
  if (window.mntsSupabase && window.mntsSupabase.enabled) {
    const remote = await window.mntsSupabase.getSiteContent();
    return { ...structuredClone(defaultSiteContent), ...(remote || {}) };
  }
  return structuredClone(defaultSiteContent);
}

async function populateSite() {
  const content = await getStoredContent();
  const projects = await getProjectData();

  document.title = `${content.siteName} | Design for Human & Space`;
  const siteNameNodes = document.querySelectorAll('[data-site-name]');
  siteNameNodes.forEach((node) => {
    node.textContent = content.siteName;
  });

  const heroSubtitle = document.querySelector('[data-hero-subtitle]');
  const heroTitle = document.querySelector('[data-hero-title]');
  const heroButton = document.querySelector('[data-hero-button]');
  const heroImage = document.querySelector('[data-hero-image]');

  if (heroSubtitle) heroSubtitle.textContent = content.heroSubtitle;
  if (heroTitle) heroTitle.textContent = content.heroTitle;
  if (heroButton) heroButton.innerHTML = `${content.heroButton} <span>→</span>`;
  if (heroImage) heroImage.src = content.heroImage || defaultSiteContent.heroImage;

  renderFeaturedProjects(projects);

  const aboutTitle = document.querySelector('[data-about-title]');
  const aboutText = document.querySelector('[data-about-text]');
  if (aboutTitle) aboutTitle.textContent = content.aboutTitle;
  if (aboutText) aboutText.textContent = content.aboutText;

  const insightTitle = document.querySelector('[data-insight-title]');
  const insightList = document.querySelector('[data-insight-list]');
  if (insightTitle) insightTitle.textContent = content.insightTitle;
  if (insightList && Array.isArray(content.insightList)) {
    insightList.innerHTML = content.insightList.map(item => `
      <li>
        <span>${item.label}</span>
        <strong>${item.text}</strong>
      </li>
    `).join('');
  }

  const careerTitle = document.querySelector('[data-career-title]');
  const careerText = document.querySelector('[data-career-text]');
  if (careerTitle) careerTitle.textContent = content.careerTitle;
  if (careerText) careerText.textContent = content.careerText;

  const contactPhone = document.querySelector('[data-contact-phone]');
  const contactAddress = document.querySelector('[data-contact-address]');
  const contactEmail = document.querySelector('[data-contact-email]');
  if (contactPhone) contactPhone.textContent = content.contactPhone;
  if (contactAddress) contactAddress.textContent = content.contactAddress;
  if (contactEmail) contactEmail.textContent = content.contactEmail;
  if (contactEmail) contactEmail.href = `mailto:${content.contactEmail}`;

  const whatsappLink = document.querySelector('[data-whatsapp-link]');
  const instagramLink = document.querySelector('[data-instagram-link]');
  const linkedinLink = document.querySelector('[data-linkedin-link]');
  if (whatsappLink) whatsappLink.href = content.whatsappUrl;
  if (instagramLink) instagramLink.href = content.instagramUrl;
  if (linkedinLink) linkedinLink.href = content.linkedinUrl;

  const studioYears = document.querySelector('[data-studio-years]');
  const projectCount = document.querySelector('[data-project-count]');
  const regionCount = document.querySelector('[data-region-count]');
  if (studioYears) studioYears.textContent = content.studioYears;
  if (projectCount) projectCount.textContent = content.projectCount;
  if (regionCount) regionCount.textContent = content.regionCount;

  const serviceGrid = document.querySelector('[data-services-grid]');
  if (serviceGrid && Array.isArray(content.services)) {
    serviceGrid.innerHTML = content.services.map(service => `
      <article class="service-item">
        <div class="service-visual">${service.name}</div>
        <h3>${service.name}</h3>
        <p>${service.count}</p>
      </article>
    `).join('');
  }

  renderAllProjects(projects);
}

function renderFeaturedProjects(projects) {
  const track = document.querySelector('[data-featured-track]');
  if (!track) return;

  const selected = [...projects].sort(() => Math.random() - 0.5).slice(0, 4);
  if (!selected.length) {
    track.innerHTML = '<article class="featured-project-card empty"><p>No featured projects available.</p></article>';
    return;
  }

  track.innerHTML = selected.map((project) => `
    <article class="featured-project-card">
      <img src="${project.image || 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&q=80&w=1200'}" alt="${project.title}" />
      <div class="featured-project-copy">
        <span>${project.location || 'Studio Project'}</span>
        <h3>${project.title}</h3>
        <p>${project.description || ''}</p>
        <a href="project-page.html?id=${project.id}">View project <span aria-hidden="true">→</span></a>
      </div>
    </article>
  `).join('');

  const trackCard = track.querySelector('.featured-project-card');
  const step = trackCard ? trackCard.offsetWidth + 20 : 320;
  const previous = document.querySelector('[data-featured-prev]');
  const next = document.querySelector('[data-featured-next]');
  if (previous) previous.onclick = () => track.scrollBy({ left: -step, behavior: 'smooth' });
  if (next) next.onclick = () => track.scrollBy({ left: step, behavior: 'smooth' });
}

async function renderAllProjects(projects) {
  const list = document.querySelector('[data-project-list]');
  if (!list) return;

  if (!projects.length) {
    list.innerHTML = `
      <article class="project-scroll-item empty">
        <p>No projects available yet.</p>
      </article>
    `;
    return;
  }

  list.innerHTML = projects.map((project) => `
    <article class="project-scroll-item">
      <img src="${project.image || 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&q=80&w=1200'}" alt="${project.title}" />
      <div class="project-scroll-copy">
        <span>${project.location || 'Studio Project'}</span>
        <h3>${project.title}</h3>
        <p>${project.description || 'A refined workspace experience by MNTS DSGN.'}</p>
        <a href="project-page.html?id=${project.id}">View project</a>
      </div>
    </article>
  `).join('');
}

async function populateProjectDetail() {
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('id');
  const projects = await getProjectData();
  const project = projects.find((item) => item.id === projectId) || projects[0];
  if (!project) return;

  document.getElementById('projectDetailImage').src = project.image || 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&q=80&w=1200';
  document.getElementById('projectDetailTitle').textContent = project.title;
  document.getElementById('projectDetailLocation').textContent = project.location;
  document.getElementById('projectDetailDescription').textContent = project.description;
}

function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    toggle.textContent = isOpen ? '×' : '☰';
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      toggle.textContent = '☰';
    });
  });
}

function initHeroScroll() {
  const hero = document.querySelector('.hero');
  const featured = document.querySelector('#projects');
  if (!hero || !featured) return;

  let isMoving = false;
  hero.addEventListener('wheel', (event) => {
    if (event.deltaY <= 0 || isMoving) return;
    event.preventDefault();
    isMoving = true;
    featured.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => { isMoving = false; }, 850);
  }, { passive: false });
}

function initReveal() {
  const revealItems = document.querySelectorAll('section, .service-item, .info-panel, .contact-box');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(18px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await populateSite();
  if (document.getElementById('projectDetailTitle')) await populateProjectDetail();
  initSmoothScroll();
  initMobileMenu();
  initHeroScroll();
  initReveal();
  window.addEventListener('storage', () => populateSite());
  window.addEventListener('siteDataUpdated', () => populateSite());
});
