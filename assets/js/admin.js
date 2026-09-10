const dashboardPath = window.MNTS_ADMIN_DASHBOARD_PATH || 'admin-dashboard.html';
const loginPath = window.MNTS_LOGIN_PATH || 'login/';

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

async function readStoredContent() {
  if (window.mntsSupabase && window.mntsSupabase.enabled) {
    const remote = await window.mntsSupabase.getSiteContent();
    return { ...structuredClone(defaultSiteContent), ...(remote || {}) };
  }
  return structuredClone(defaultSiteContent);
}

async function saveContent(data) {
  if (!window.mntsSupabase || !window.mntsSupabase.enabled) throw new Error('Supabase is not configured.');
  await window.mntsSupabase.saveSiteContent(data);
  window.dispatchEvent(new Event('siteDataUpdated'));
}

async function readPages() {
  if (window.mntsSupabase && window.mntsSupabase.enabled) {
    const remote = await window.mntsSupabase.getPages();
    return remote || [];
  }
  return structuredClone(defaultPages);
}

async function savePages(data) {
  if (!window.mntsSupabase || !window.mntsSupabase.enabled) throw new Error('Supabase is not configured.');
  await window.mntsSupabase.replacePages(data);
  window.dispatchEvent(new Event('siteDataUpdated'));
}

async function readProjects() {
  if (window.mntsSupabase && window.mntsSupabase.enabled) {
    const remote = await window.mntsSupabase.getProjects();
    return remote || [];
  }
  return structuredClone(defaultProjects);
}

async function saveProjects(data) {
  if (!window.mntsSupabase || !window.mntsSupabase.enabled) throw new Error('Supabase is not configured.');
  await window.mntsSupabase.replaceProjects(data);
  window.dispatchEvent(new Event('siteDataUpdated'));
}

function setStatus(message, isError = false) {
  const statusNode = document.getElementById('statusMessage');
  if (statusNode) {
    statusNode.textContent = message;
    statusNode.style.color = isError ? '#9a3f3f' : '#355c42';
    statusNode.style.opacity = '1';
  }

  let toast = document.getElementById('adminToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'adminToast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  toast.className = `admin-toast ${isError ? 'error' : 'success'}`;
  toast.innerHTML = `<span class="admin-toast-icon">${isError ? '!' : '✓'}</span><span>${message}</span>`;
  requestAnimationFrame(() => toast.classList.add('visible'));
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => toast.classList.remove('visible'), 4200);
}

async function renderProfileForm() {
  const content = await readStoredContent();
  const form = document.getElementById('profileForm');
  if (!form) return;

  form.siteName.value = content.siteName || defaultSiteContent.siteName;
  form.heroSubtitle.value = content.heroSubtitle || defaultSiteContent.heroSubtitle;
  form.heroTitle.value = content.heroTitle || defaultSiteContent.heroTitle;
  form.heroButton.value = content.heroButton || defaultSiteContent.heroButton;
  form.heroImage.value = content.heroImage || defaultSiteContent.heroImage;
  form.contactPhone.value = content.contactPhone || defaultSiteContent.contactPhone;
  form.contactAddress.value = content.contactAddress || defaultSiteContent.contactAddress;
  form.contactEmail.value = content.contactEmail || defaultSiteContent.contactEmail;
  form.whatsappUrl.value = content.whatsappUrl || defaultSiteContent.whatsappUrl;
  form.instagramUrl.value = content.instagramUrl || defaultSiteContent.instagramUrl;
  form.linkedinUrl.value = content.linkedinUrl || defaultSiteContent.linkedinUrl;
  form.studioYears.value = content.studioYears || defaultSiteContent.studioYears;
  form.projectCount.value = content.projectCount || defaultSiteContent.projectCount;
  form.regionCount.value = content.regionCount || defaultSiteContent.regionCount;

  const heroPreview = document.getElementById('heroPreview');
  if (heroPreview) heroPreview.src = content.heroImage || defaultSiteContent.heroImage;
}

async function renderAboutForm() {
  const content = await readStoredContent();
  const form = document.getElementById('aboutForm');
  if (!form) return;

  form.aboutTitle.value = content.aboutTitle || defaultSiteContent.aboutTitle;
  form.aboutText.value = content.aboutText || defaultSiteContent.aboutText;
  form.studioYears.value = content.studioYears || defaultSiteContent.studioYears;
  form.projectCount.value = content.projectCount || defaultSiteContent.projectCount;
  form.regionCount.value = content.regionCount || defaultSiteContent.regionCount;
}

async function renderSectionsForm() {
  const content = await readStoredContent();
  const form = document.getElementById('sectionsForm');
  if (!form) return;

  const insights = content.insightList || defaultSiteContent.insightList;
  const services = content.services || defaultSiteContent.services;
  form.insightTitle.value = content.insightTitle || defaultSiteContent.insightTitle;
  form.insightOneLabel.value = insights[0]?.label || '';
  form.insightOneText.value = insights[0]?.text || '';
  form.insightTwoLabel.value = insights[1]?.label || '';
  form.insightTwoText.value = insights[1]?.text || '';
  form.insightThreeLabel.value = insights[2]?.label || '';
  form.insightThreeText.value = insights[2]?.text || '';
  form.careerTitle.value = content.careerTitle || defaultSiteContent.careerTitle;
  form.careerText.value = content.careerText || defaultSiteContent.careerText;
  form.serviceOneName.value = services[0]?.name || '';
  form.serviceOneCount.value = services[0]?.count || '';
  form.serviceTwoName.value = services[1]?.name || '';
  form.serviceTwoCount.value = services[1]?.count || '';
  form.serviceThreeName.value = services[2]?.name || '';
  form.serviceThreeCount.value = services[2]?.count || '';
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
        <button class="btn secondary small" data-project-edit="${project.id}" type="button">Edit</button>
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

  list.querySelectorAll('[data-project-edit]').forEach((button) => {
    button.addEventListener('click', async () => {
      const project = (await readProjects()).find((item) => item.id === button.dataset.projectEdit);
      if (!project) return;
      const form = document.getElementById('projectForm');
      form.projectId.value = project.id;
      form.projectTitle.value = project.title;
      form.projectLocation.value = project.location;
      form.projectDescription.value = project.description;
      form.projectImage.value = project.image || '';
      document.getElementById('projectSubmit').textContent = 'Update Project';
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}

async function initializeAdminDashboard() {
  const isLoggedIn = window.mntsSupabase && window.mntsSupabase.enabled
    ? Boolean((await window.mntsSupabase.client.auth.getSession()).data.session)
    : false;
  if (!isLoggedIn) {
    window.location.replace(loginPath);
    return;
  }

  await renderProfileForm();
  await renderAboutForm();
  await renderSectionsForm();
  await renderPagesList();
  await renderProjectsList();
  if (window.mntsSupabase && window.mntsSupabase.enabled) {
    const connection = await window.mntsSupabase.testConnection();
    setStatus(connection.message, !connection.connected);
  }

  const commitGithubButton = document.getElementById('commitGithubBtn');
  if (commitGithubButton) {
    commitGithubButton.addEventListener('click', async () => {
      commitGithubButton.disabled = true;
      commitGithubButton.textContent = 'Committing...';
      try {
        if (!window.mntsSupabase || !window.mntsSupabase.enabled) {
          throw new Error('Supabase is not configured.');
        }
        const result = await window.mntsSupabase.commitContentToGitHub();
        setStatus(result.message || 'Content committed to GitHub successfully.');
      } catch (error) {
        setStatus(`GitHub commit failed: ${error.message}`, true);
      } finally {
        commitGithubButton.disabled = false;
        commitGithubButton.textContent = 'Commit to GitHub';
      }
    });
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
      content.whatsappUrl = profileForm.whatsappUrl.value.trim() || defaultSiteContent.whatsappUrl;
      content.instagramUrl = profileForm.instagramUrl.value.trim() || defaultSiteContent.instagramUrl;
      content.linkedinUrl = profileForm.linkedinUrl.value.trim() || defaultSiteContent.linkedinUrl;
      content.studioYears = profileForm.studioYears.value.trim() || defaultSiteContent.studioYears;
      content.projectCount = profileForm.projectCount.value.trim() || defaultSiteContent.projectCount;
      content.regionCount = profileForm.regionCount.value.trim() || defaultSiteContent.regionCount;

      try {
        await saveContent(content);
        setStatus('Profile updated successfully.');
      } catch (error) {
        setStatus(`Profile update failed: ${error.message}`, true);
      }
    });
  }

  const sectionsForm = document.getElementById('sectionsForm');
  if (sectionsForm) {
    sectionsForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const content = await readStoredContent();
      content.insightTitle = sectionsForm.insightTitle.value.trim() || defaultSiteContent.insightTitle;
      content.insightList = [
        { label: sectionsForm.insightOneLabel.value.trim(), text: sectionsForm.insightOneText.value.trim() },
        { label: sectionsForm.insightTwoLabel.value.trim(), text: sectionsForm.insightTwoText.value.trim() },
        { label: sectionsForm.insightThreeLabel.value.trim(), text: sectionsForm.insightThreeText.value.trim() }
      ];
      content.careerTitle = sectionsForm.careerTitle.value.trim() || defaultSiteContent.careerTitle;
      content.careerText = sectionsForm.careerText.value.trim() || defaultSiteContent.careerText;
      content.services = [
        { name: sectionsForm.serviceOneName.value.trim(), count: sectionsForm.serviceOneCount.value.trim() },
        { name: sectionsForm.serviceTwoName.value.trim(), count: sectionsForm.serviceTwoCount.value.trim() },
        { name: sectionsForm.serviceThreeName.value.trim(), count: sectionsForm.serviceThreeCount.value.trim() }
      ];
      try {
        await saveContent(content);
        setStatus('Homepage sections updated successfully.');
      } catch (error) {
        setStatus(`Homepage update failed: ${error.message}`, true);
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
      content.studioYears = aboutForm.studioYears.value.trim() || defaultSiteContent.studioYears;
      content.projectCount = aboutForm.projectCount.value.trim() || defaultSiteContent.projectCount;
      content.regionCount = aboutForm.regionCount.value.trim() || defaultSiteContent.regionCount;
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
      const projectId = projectForm.projectId.value.trim();

      if (!title || !location || !description) {
        setStatus('Title, location, and description are required.', true);
        return;
      }

      const projects = await readProjects();
      const project = {
        id: projectId || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `project-${Date.now()}`,
        title,
        location,
        description,
        image: image || 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&q=80&w=1200'
      };

      const nextProjects = projectId
        ? projects.map((item) => item.id === projectId ? project : item)
        : [project, ...projects];
      try {
        await saveProjects(nextProjects);
      } catch (error) {
        setStatus(`Project creation failed: ${error.message}`, true);
        return;
      }
      projectForm.reset();
      document.getElementById('projectSubmit').textContent = 'Create Project Page';
      await renderProjectsList();
      setStatus(projectId ? 'Project updated successfully.' : 'Project created successfully.');
    });
  }

  const logoutButton = document.getElementById('logoutBtn');
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      if (window.mntsSupabase && window.mntsSupabase.enabled) await window.mntsSupabase.signOut();
      window.location.href = loginPath;
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
        window.location.replace(dashboardPath);
        return;
      }
      setStatus(error.message, true);
    } else if (!window.mntsSupabase || !window.mntsSupabase.enabled) {
      setStatus('Supabase is not configured.', true);
      return;
    }

    setStatus('Incorrect username or password.', true);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const isLoginPage = !!document.getElementById('loginForm');
  const isAdminPage = document.body.hasAttribute('data-admin-page');

  if (isLoginPage) {
    const hasRemoteSession = window.mntsSupabase && window.mntsSupabase.enabled
      ? Boolean((await window.mntsSupabase.client.auth.getSession()).data.session)
      : false;
    if (hasRemoteSession) {
      window.location.replace(dashboardPath);
      return;
    }
    handleLogin();
    return;
  }

  if (isAdminPage) {
    initializeAdminDashboard();
  }
});
