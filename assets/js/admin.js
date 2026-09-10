const adminCredentials = {
  username: 'admin',
  password: 'admin'
};

const siteStorageKey = 'studioASAContent';
const pagesStorageKey = 'studioASAPages';
const projectsStorageKey = 'studioASAProjects';
const adminSessionKey = 'studioASAAdminLoggedIn';

const defaultSiteContent = {
  siteName: 'MNTS DSGN',
  heroSubtitle: 'Designing spaces with intention, rhythm, and clarity.',
  heroTitle: '#MaterialityInMotion',
  heroButton: 'Discover Our Work',
  heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000',
  featuredLocation: 'Bandung, West Java',
  featuredTitle: 'Saninten airbnb',
  featuredImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1920',
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
  services: [
    { name: 'Architecture', count: '21 Projects' },
    { name: 'Interior Design', count: '27 Projects' },
    { name: 'Garden Design', count: '33 Projects' }
  ]
};

const defaultPages = [
  { id: 'home', name: 'Home', slug: 'home' },
  { id: 'about', name: 'About', slug: 'about' },
  { id: 'projects', name: 'Projects', slug: 'projects' },
  { id: 'contact', name: 'Contact', slug: 'contact' }
];

const defaultProjects = [
  {
    id: 'saninten-airbnb',
    title: 'Saninten airbnb',
    location: 'Bandung, West Java',
    description: 'A quiet luxury retreat designed around climate, material warmth, and daily rituals.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1920'
  }
];

function safeRead(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch (error) {
    return fallback;
  }
}

async function readStoredContent() {
  if (window.mntsSupabase && window.mntsSupabase.enabled) {
    const remote = await window.mntsSupabase.getSiteContent();
    if (remote) return { ...structuredClone(defaultSiteContent), ...remote };
  }
  return safeRead(siteStorageKey, structuredClone(defaultSiteContent));
}

async function saveContent(data) {
  localStorage.setItem(siteStorageKey, JSON.stringify(data));
  if (window.mntsSupabase && window.mntsSupabase.enabled) await window.mntsSupabase.saveSiteContent(data);
  window.dispatchEvent(new Event('siteDataUpdated'));
}

async function readPages() {
  if (window.mntsSupabase && window.mntsSupabase.enabled) {
    const remote = await window.mntsSupabase.getPages();
    if (remote && remote.length) return remote;
  }
  return safeRead(pagesStorageKey, structuredClone(defaultPages));
}

async function savePages(data) {
  localStorage.setItem(pagesStorageKey, JSON.stringify(data));
  if (window.mntsSupabase && window.mntsSupabase.enabled) await window.mntsSupabase.replacePages(data);
  window.dispatchEvent(new Event('siteDataUpdated'));
}

async function readProjects() {
  if (window.mntsSupabase && window.mntsSupabase.enabled) {
    const remote = await window.mntsSupabase.getProjects();
    if (remote && remote.length) return remote;
  }
  return safeRead(projectsStorageKey, structuredClone(defaultProjects));
}

async function saveProjects(data) {
  localStorage.setItem(projectsStorageKey, JSON.stringify(data));
  if (window.mntsSupabase && window.mntsSupabase.enabled) await window.mntsSupabase.replaceProjects(data);
  window.dispatchEvent(new Event('siteDataUpdated'));
}

function setStatus(message, isError = false) {
  const statusNode = document.getElementById('statusMessage');
  if (!statusNode) return;
  statusNode.textContent = message;
  statusNode.style.color = isError ? '#9a3f3f' : '#355c42';
  statusNode.style.opacity = '1';
  clearTimeout(statusNode._successTimer);
  statusNode._successTimer = setTimeout(() => {
    statusNode.style.opacity = '0.75';
  }, 2600);
}

async function renderProfileForm() {
  const content = await readStoredContent();
  const form = document.getElementById('profileForm');
  if (!form) return;

  form.siteName.value = content.siteName || defaultSiteContent.siteName;
  form.heroSubtitle.value = content.heroSubtitle || defaultSiteContent.heroSubtitle;
  form.heroTitle.value = content.heroTitle || defaultSiteContent.heroTitle;
  form.heroButton.value = content.heroButton || defaultSiteContent.heroButton;
  form.contactPhone.value = content.contactPhone || defaultSiteContent.contactPhone;
  form.contactAddress.value = content.contactAddress || defaultSiteContent.contactAddress;
  form.contactEmail.value = content.contactEmail || defaultSiteContent.contactEmail;

  const heroPreview = document.getElementById('heroPreview');
  if (heroPreview) heroPreview.src = content.heroImage || defaultSiteContent.heroImage;
}

function attachImagePreview(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if (!input || !preview) return;

  input.addEventListener('change', (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      preview.src = loadEvent.target.result;
      preview.parentElement.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });
}

async function renderAboutForm() {
  const content = await readStoredContent();
  const form = document.getElementById('aboutForm');
  if (!form) return;

  form.aboutTitle.value = content.aboutTitle || defaultSiteContent.aboutTitle;
  form.aboutText.value = content.aboutText || defaultSiteContent.aboutText;
}

async function renderPagesList() {
  const list = document.getElementById('pageList');
  if (!list) return;

  const pages = await readPages();
  list.innerHTML = pages.map((page) => `
    <li class="list-item">
      <div>
        <strong>${page.name}</strong>
        <small>/${page.slug}</small>
      </div>
      <button class="btn secondary small" data-page-delete="${page.id}" type="button">Delete</button>
    </li>
  `).join('');

  list.querySelectorAll('[data-page-delete]').forEach((button) => {
    button.addEventListener('click', async () => {
      const pages = await readPages();
      const filtered = pages.filter((page) => page.id !== button.dataset.pageDelete);
      try {
        await savePages(filtered);
        await renderPagesList();
        setStatus('Page removed successfully.');
      } catch (error) {
        setStatus(`Page removal failed: ${error.message}`, true);
      }
    });
  });
}

async function renderProjectsList() {
  const list = document.getElementById('projectList');
  if (!list) return;

  const projects = await readProjects();
  list.innerHTML = projects.map((project) => `
    <li class="list-item project-item">
      <div class="project-item-thumb">
        <img src="${project.image || 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&q=80&w=1200'}" alt="${project.title}" />
      </div>
      <div class="project-item-copy">
        <strong>${project.title}</strong>
        <small>${project.location}</small>
        <p>${project.description}</p>
      </div>
      <div class="project-item-actions">
        <a class="btn secondary small" href="project-page.html?id=${project.id}" target="_blank" rel="noreferrer">Open</a>
        <button class="btn secondary small" data-project-delete="${project.id}" type="button">Delete</button>
      </div>
    </li>
  `).join('');

  list.querySelectorAll('[data-project-delete]').forEach((button) => {
    button.addEventListener('click', async () => {
      const projects = await readProjects();
      const filtered = projects.filter((project) => project.id !== button.dataset.projectDelete);
      try {
        await saveProjects(filtered);
        await renderProjectsList();
        setStatus('Project removed successfully.');
      } catch (error) {
        setStatus(`Project removal failed: ${error.message}`, true);
      }
    });
  });
}

async function initializeAdminDashboard() {
  const isLoggedIn = window.mntsSupabase && window.mntsSupabase.enabled
    ? Boolean((await window.mntsSupabase.client.auth.getSession()).data.session)
    : sessionStorage.getItem(adminSessionKey) === 'true';
  if (!isLoggedIn) {
    window.location.replace('admin-login.html');
    return;
  }

  await renderProfileForm();
  await renderAboutForm();
  await renderPagesList();
  await renderProjectsList();
  attachImagePreview('heroUpload', 'heroPreview');

  if (window.mntsSupabase && window.mntsSupabase.enabled) {
    const connection = await window.mntsSupabase.testConnection();
    setStatus(connection.message, !connection.connected);
  }

  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const content = await readStoredContent();
      content.siteName = profileForm.siteName.value.trim() || defaultSiteContent.siteName;
      content.heroSubtitle = profileForm.heroSubtitle.value.trim() || defaultSiteContent.heroSubtitle;
      content.heroTitle = profileForm.heroTitle.value.trim() || defaultSiteContent.heroTitle;
      content.heroButton = profileForm.heroButton.value.trim() || defaultSiteContent.heroButton;
      content.contactPhone = profileForm.contactPhone.value.trim() || defaultSiteContent.contactPhone;
      content.contactAddress = profileForm.contactAddress.value.trim() || defaultSiteContent.contactAddress;
      content.contactEmail = profileForm.contactEmail.value.trim() || defaultSiteContent.contactEmail;

      if (document.getElementById('heroPreview') && document.getElementById('heroPreview').src) {
        content.heroImage = document.getElementById('heroPreview').src;
      }

      try {
        await saveContent(content);
        setStatus('Profile updated successfully.');
      } catch (error) {
        setStatus(`Profile update failed: ${error.message}`, true);
      }
    });
  }

  const aboutForm = document.getElementById('aboutForm');
  if (aboutForm) {
    aboutForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const content = await readStoredContent();
      content.aboutTitle = aboutForm.aboutTitle.value.trim() || defaultSiteContent.aboutTitle;
      content.aboutText = aboutForm.aboutText.value.trim() || defaultSiteContent.aboutText;
      try {
        await saveContent(content);
        setStatus('About section updated successfully.');
      } catch (error) {
        setStatus(`About update failed: ${error.message}`, true);
      }
    });
  }

  const pageForm = document.getElementById('pageForm');
  if (pageForm) {
    pageForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = pageForm.pageName.value.trim();
      const slug = pageForm.pageSlug.value.trim();

      if (!name || !slug) {
        setStatus('Please enter both a page name and slug.', true);
        return;
      }

      const pages = await readPages();
      const exists = pages.some((page) => page.slug === slug);
      if (exists) {
        setStatus('A page with that slug already exists.', true);
        return;
      }

      pages.push({ id: slug, name, slug });
      try {
        await savePages(pages);
      } catch (error) {
        setStatus(`Page creation failed: ${error.message}`, true);
        return;
      }
      pageForm.reset();
      await renderPagesList();
      setStatus('Page created successfully.');
    });
  }

  const projectForm = document.getElementById('projectForm');
  if (projectForm) {
    projectForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const title = projectForm.projectTitle.value.trim();
      const location = projectForm.projectLocation.value.trim();
      const description = projectForm.projectDescription.value.trim();
      const image = projectForm.projectImage.value.trim();

      if (!title || !location || !description) {
        setStatus('Title, location, and description are required.', true);
        return;
      }

      const projects = await readProjects();
      const project = {
        id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `project-${Date.now()}`,
        title,
        location,
        description,
        image: image || 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&q=80&w=1200'
      };

      projects.unshift(project);
      try {
        await saveProjects(projects);
      } catch (error) {
        setStatus(`Project creation failed: ${error.message}`, true);
        return;
      }
      projectForm.reset();
      await renderProjectsList();
      setStatus('Project created successfully.');
    });
  }

  const logoutButton = document.getElementById('logoutBtn');
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      sessionStorage.removeItem(adminSessionKey);
      if (window.mntsSupabase && window.mntsSupabase.enabled) await window.mntsSupabase.signOut();
      window.location.href = 'admin-login.html';
    });
  }
}

function handleLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = form.username.value.trim();
    const password = form.password.value.trim();

    if (window.mntsSupabase && window.mntsSupabase.enabled) {
      const { error } = await window.mntsSupabase.signIn(username, password);
      if (!error) {
        window.location.replace('admin-dashboard.html');
        return;
      }
      setStatus(error.message, true);
    } else if (username === adminCredentials.username && password === adminCredentials.password) {
      sessionStorage.setItem(adminSessionKey, 'true');
      window.location.replace('admin-dashboard.html');
      return;
    }

    setStatus('Incorrect username or password.', true);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const isLoginPage = !!document.getElementById('loginForm');
  const isAdminDashboardPage = !!document.getElementById('profileForm');

  if (isLoginPage) {
    const hasRemoteSession = window.mntsSupabase && window.mntsSupabase.enabled
      ? Boolean((await window.mntsSupabase.client.auth.getSession()).data.session)
      : sessionStorage.getItem(adminSessionKey) === 'true';
    if (hasRemoteSession) {
      window.location.replace('admin-dashboard.html');
      return;
    }
    handleLogin();
    return;
  }

  if (isAdminDashboardPage) {
    initializeAdminDashboard();
  }
});
