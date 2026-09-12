const defaultSiteContent = {
  siteName: 'MNTS DSGN',
  heroSubtitle: 'Designing spaces with intention, rhythm, and clarity.',
  heroTitle: '#MaterialityInMotion',
  heroButton: 'Discover Our Work',
  heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000',
  heroMetaStudio: 'Architecture Studio',
  heroMetaCoord: '6.9271° S',
  heroMetaSystem: 'MNTS / 01',
  heroMetaScale: 'Human',
  heroMetaSpace: 'Space.',
  heroMetaCode: '001 / MNTS DSGN',
  selectedLabel: 'Selected Projects',
  selectedTitle: 'Built with intention.',
  allProjectsLabel: 'All Projects',
  allProjectsTitle: 'Selected work across architecture, interiors, and landscape.',
  allProjectsButton: 'Start a project',
  servicesLabel: 'Our Services',
  servicesTitle: 'Crafting spaces with intent.',
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
  contactLabel: 'Contact',
  contactTitle: 'Let’s build something meaningful.',
  contactText: 'We work with hospitality, residential, cultural, and landscape-led projects across Indonesia and beyond.',
  footerAbout: 'About',
  footerProjects: 'Projects',
  footerInsights: 'Insights',
  footerCareer: 'Career',
  footerContact: 'Contact',
  styleSettings: {
    fontFamily: 'DM Sans',
    headingFont: 'Space Grotesk',
    baseFontSize: '16',
    headingScale: '1',
    sectionSpacing: '8',
    accentColor: '#f36f3d',
    backgroundColor: '#ffffff',
    textColor: '#080808'
  },
  sectionOrder: ['projects', 'all-projects', 'services', 'insights', 'career', 'contact'],
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
  if (!window.mntsSupabase || !window.mntsSupabase.enabled) throw new Error('The live content database is not configured.');
  return (await window.mntsSupabase.getProjects()) || [];
}

async function getStoredContent() {
  if (!window.mntsSupabase || !window.mntsSupabase.enabled) throw new Error('The live content database is not configured.');
  const remote = await window.mntsSupabase.getSiteContent();
  if (!remote) throw new Error('No live site content is available in Supabase.');
  return { ...structuredClone(defaultSiteContent), ...remote };
}

function showOnlineContentError(error) {
  const message = document.createElement('main');
  message.className = 'site-online-error';
  message.innerHTML = `<p>Live content unavailable</p><h1>Connect to the content database to view this site.</h1><small>${error.message}</small>`;
  document.body.replaceChildren(message);
}

async function populateSite() {
  const content = await getStoredContent();
  const projects = await getProjectData();

  const settings = { ...defaultSiteContent.styleSettings, ...(content.styleSettings || {}) };
  const root = document.documentElement;
  root.style.setProperty('--site-font', `'${settings.fontFamily}', sans-serif`);
  root.style.setProperty('--site-heading-font', `'${settings.headingFont}', sans-serif`);
  root.style.setProperty('--site-base-size', `${settings.baseFontSize}px`);
  root.style.setProperty('--site-heading-scale', settings.headingScale);
  root.style.setProperty('--site-section-spacing', `${settings.sectionSpacing}vw`);
  root.style.setProperty('--site-accent', settings.accentColor);
  root.style.setProperty('--site-bg', settings.backgroundColor);
  root.style.setProperty('--site-text', settings.textColor);

  const main = document.querySelector('main');
  const order = Array.isArray(content.sectionOrder) ? content.sectionOrder : defaultSiteContent.sectionOrder;
  order.forEach((id) => {
    const section = document.getElementById(id);
    if (section) main.appendChild(section);
  });

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
  if (heroButton) heroButton.textContent = content.heroButton;
  if (heroImage) heroImage.src = content.heroImage || defaultSiteContent.heroImage;

  const textBindings = {
    '[data-hero-meta-studio]': content.heroMetaStudio,
    '[data-hero-meta-coord]': content.heroMetaCoord,
    '[data-hero-meta-system]': content.heroMetaSystem,
    '[data-hero-meta-scale]': content.heroMetaScale,
    '[data-hero-meta-space]': content.heroMetaSpace,
    '[data-hero-meta-code]': content.heroMetaCode,
    '[data-selected-label]': content.selectedLabel,
    '[data-selected-title]': content.selectedTitle,
    '[data-all-projects-label]': content.allProjectsLabel,
    '[data-all-projects-title]': content.allProjectsTitle,
    '[data-all-projects-button]': content.allProjectsButton,
    '[data-services-label]': content.servicesLabel,
    '[data-services-title]': content.servicesTitle,
    '[data-contact-label]': content.contactLabel,
    '[data-contact-title]': content.contactTitle,
    '[data-contact-text]': content.contactText,
    '[data-footer-about]': content.footerAbout,
    '[data-footer-projects]': content.footerProjects,
    '[data-footer-insights]': content.footerInsights,
    '[data-footer-career]': content.footerCareer,
    '[data-footer-contact]': content.footerContact,
    '[data-nav-about]': content.footerAbout,
    '[data-nav-works]': content.footerProjects,
    '[data-nav-services]': content.servicesLabel,
    '[data-nav-contact]': content.footerContact,
    '[data-nav-cta]': content.allProjectsButton
  };
  Object.entries(textBindings).forEach(([selector, value]) => {
    const node = document.querySelector(selector);
    if (node && value) node.textContent = value;
  });

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
        <a href="project-page.html?id=${project.id}">View project</a>
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

function initThemeToggle() {
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;

  const applyTheme = (isDark) => {
    document.body.classList.toggle('dark-mode', isDark);
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.setAttribute('aria-label', isDark ? 'Use light mode' : 'Use dark mode');
    toggle.innerHTML = `<span aria-hidden="true">${isDark ? '○' : '◐'}</span>`;
  };

  const savedTheme = window.localStorage.getItem('mnts-theme');
  applyTheme(savedTheme === 'dark');
  toggle.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    applyTheme(isDark);
    window.localStorage.setItem('mnts-theme', isDark ? 'dark' : 'light');
  });
}

function initReveal() {
  const revealItems = document.querySelectorAll('section, .section-heading, .text-block h2, .featured-project-card, .service-item, .info-panel, .contact-box, .project-scroll-item, .contents-list li');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => {
    item.classList.add('reveal-item');
    observer.observe(item);
  });
}

function initImageParallax() {
  const images = document.querySelectorAll('.featured-project-card img, .project-scroll-item img');
  if (!images.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  images.forEach((image) => image.classList.add('image-drift'));
  window.addEventListener('scroll', () => {
    images.forEach((image) => {
      const bounds = image.getBoundingClientRect();
      const progress = (window.innerHeight / 2 - (bounds.top + bounds.height / 2)) / Math.max(window.innerHeight, 1);
      image.style.transform = `scale(1.04) translateY(${progress * -12}px)`;
    });
  }, { passive: true });
}

function initHeroScrollMotion() {
  const hero = document.querySelector('.hero');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  const updateHero = () => {
    const progress = Math.min(Math.max(window.scrollY / Math.max(hero.offsetHeight, 1), 0), 1);
    const fade = Math.max(0, 1 - progress * 0.9);
    const shift = progress * -38;
    const imageScale = 1.06 + progress * 0.08;
    hero.style.setProperty('--hero-opacity', fade.toFixed(3));
    hero.style.setProperty('--hero-shift', `${shift.toFixed(1)}px`);
    hero.style.setProperty('--hero-image-scale', imageScale.toFixed(3));
    hero.classList.toggle('is-scrolling', progress > 0.01);
    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateHero);
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  updateHero();
}

function initSectionTitleFade() {
  const titles = [...document.querySelectorAll('main > section:not(.hero) .section-heading, main > section:not(.hero) .text-block h2')];
  if (!titles.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  const updateTitles = () => {
    const headerHeight = document.querySelector('.navbar')?.offsetHeight || 0;
    titles.forEach((title) => {
      const bounds = title.getBoundingClientRect();
      const fadeDistance = 120;
      const opacity = Math.min(Math.max((bounds.top - headerHeight) / fadeDistance, 0), 1);
      title.style.setProperty('--title-scroll-opacity', opacity.toFixed(3));
    });
    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateTitles);
  };

  titles.forEach((title) => title.classList.add('section-title-fade'));
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  updateTitles();
}

function initSectionScroll() {
  const sections = [...document.querySelectorAll('main > section')];
  const excludedSection = document.querySelector('#all-projects');
  if (sections.length < 2 || !excludedSection || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let isAnimating = false;
  let unlockTimer;

  const isInsideExcludedSection = () => {
    const bounds = excludedSection.getBoundingClientRect();
    return bounds.top < window.innerHeight * 0.72 && bounds.bottom > 64;
  };

  const getCurrentIndex = () => {
    const referencePoint = window.scrollY + (document.querySelector('.navbar')?.offsetHeight || 0) + 24;
    let currentIndex = 0;
    sections.forEach((section, index) => {
      if (section.offsetTop <= referencePoint) currentIndex = index;
    });
    return currentIndex;
  };

  const handleWheel = (event) => {
    if (isAnimating || Math.abs(event.deltaY) < 12 || isInsideExcludedSection()) return;

    const currentIndex = getCurrentIndex();
    const direction = event.deltaY > 0 ? 1 : -1;
    const nextIndex = Math.min(Math.max(currentIndex + direction, 0), sections.length - 1);
    if (nextIndex === currentIndex) return;

    event.preventDefault();
    isAnimating = true;
    sections[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
    clearTimeout(unlockTimer);
    unlockTimer = setTimeout(() => {
      isAnimating = false;
    }, 1150);
  };

  window.addEventListener('wheel', handleWheel, { passive: false });
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await populateSite();
    if (document.getElementById('projectDetailTitle')) await populateProjectDetail();
    initSmoothScroll();
    initMobileMenu();
    initThemeToggle();
    initReveal();
    initImageParallax();
    initHeroScrollMotion();
    initSectionTitleFade();
    initSectionScroll();
    window.addEventListener('storage', () => populateSite());
    window.addEventListener('siteDataUpdated', () => populateSite());
  } catch (error) {
    showOnlineContentError(error);
  }
});
