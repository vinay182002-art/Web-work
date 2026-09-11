export const routes = {
  dashboard: '#/dashboard',
  learn: '#/learn',
  year: (year) => `#/learn/${year}`,
  semester: (year, semester) => `#/learn/${year}/${semester}`,
  subject: (year, semester, subject) => `#/learn/${year}/${semester}/${subject}`,
  chapter: (year, semester, subject, chapter) => `#/learn/${year}/${semester}/${subject}/${chapter}`,
  quiz: (year, semester, subject, chapter) => `#/learn/${year}/${semester}/${subject}/${chapter}/quiz`,
  questions: '#/questions',
  revision: '#/revision',
  bookmarks: '#/bookmarks',
  papers: '#/papers'
  ,lab: '#/lab'
  ,caseFile: (caseId) => `#/lab/case/${caseId}`
  ,coach: '#/coach'
};

export function navigate(path) {
  if (path.startsWith('#')) {
    window.history.pushState({}, '', `${window.location.pathname}${path}`);
  } else if (window.location.pathname !== path) {
    window.history.pushState({}, '', path);
  }
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function getRoute() {
  const hashPath = window.location.hash.replace(/^#/, '').split('?')[0].replace(/\/+$/, '');
  const path = hashPath || window.location.pathname.replace(/\/+$/, '') || '/dashboard';
  const parts = path.split('/').filter(Boolean);
  return { path, parts };
}
