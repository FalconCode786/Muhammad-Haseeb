const STORAGE_KEY = 'siteContent';

export const defaultContent = {
  meta: {
    updatedAt: null
  },
  hero: {
    greeting: "Hi, I'm",
    firstName: 'Muhammad',
    lastName: 'Haseeb',
    badge: 'Available for freelance work',
    description:
      'NAVTTC Certified UI/UX Designer & Scrimba Certified Full Stack Developer. Specializing in AI Automation and creating digital experiences that blend aesthetics with functionality.',
    roles: ['UI/UX Designer', 'Full Stack Developer', 'AI Automation Specialist'],
    fallbackRole: 'Developer',
    ctas: {
      primaryLabel: 'View My Work',
      secondaryLabel: 'Get In Touch'
    }
  },
  services: {
    eyebrow: 'What I Do',
    titleMain: 'My',
    titleHighlight: 'Services',
    subtitle:
      "Comprehensive digital solutions tailored to your unique needs. From design to deployment, I've got you covered."
  }
};

const parseServiceTitle = (title) => {
  if (!title) return { titleMain: '', titleHighlight: '' };
  const parts = title.split(' ').filter(Boolean);
  if (parts.length <= 1) {
    return { titleMain: '', titleHighlight: parts[0] || '' };
  }
  return {
    titleMain: parts.slice(0, -1).join(' '),
    titleHighlight: parts[parts.length - 1]
  };
};

const mergeContent = (base, override = {}) => ({
  ...base,
  ...override,
  meta: { ...base.meta, ...(override.meta || {}) },
  hero: {
    ...base.hero,
    ...(override.hero || {}),
    ctas: {
      ...base.hero.ctas,
      ...(override.hero?.ctas || {})
    }
  },
  services: { ...base.services, ...(override.services || {}) }
});

export const loadSiteContent = () => {
  if (typeof window === 'undefined') {
    return defaultContent;
  }

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return defaultContent;
    const merged = mergeContent(defaultContent, saved);
    if (saved.services?.title && saved.services?.titleMain === undefined && saved.services?.titleHighlight === undefined) {
      Object.assign(merged.services, parseServiceTitle(saved.services.title));
    }
    return merged;
  } catch {
    return defaultContent;
  }
};

export const saveSiteContent = (content) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  window.dispatchEvent(new Event('siteContentUpdated'));
};

export const updateSiteContent = (nextContent) => {
  const current = loadSiteContent();
  const updated = mergeContent(current, nextContent);
  updated.meta.updatedAt = new Date().toISOString();
  saveSiteContent(updated);
  return updated;
};

export const resetSiteContent = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event('siteContentUpdated'));
};
