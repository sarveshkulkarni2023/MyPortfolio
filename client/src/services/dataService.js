import api from './api';

export const analyticsService = {
  track: (event, metadata = {}) => {
    return api.post('/analytics/track', { event, metadata }).catch(() => {});
  },
  getStats: () => api.get('/analytics'),
};

export const projectsService = {
  getAll: () => api.get('/projects'),
  getBySlug: (slug) => api.get(`/projects/${slug}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  reorder: (ids) => api.patch('/projects/reorder', { ids }),
};

export const skillsService = {
  getAll: () => api.get('/skills'),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
  createCategory: (data) => api.post('/skills/categories', data),
  updateCategory: (id, data) => api.put(`/skills/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/skills/categories/${id}`),
};

export const resumesService = {
  getAll: () => api.get('/resumes'),
  create: (data) => api.post('/resumes', data),
  update: (id, data) => api.put(`/resumes/${id}`, data),
  delete: (id) => api.delete(`/resumes/${id}`),
};

export const certsService = {
  getAll: () => api.get('/certifications'),
  create: (data) => api.post('/certifications', data),
  update: (id, data) => api.put(`/certifications/${id}`, data),
  delete: (id) => api.delete(`/certifications/${id}`),
};

export const experienceService = {
  getAll: () => api.get('/experience'),
  create: (data) => api.post('/experience', data),
  update: (id, data) => api.put(`/experience/${id}`, data),
  delete: (id) => api.delete(`/experience/${id}`),
};

export const messagesService = {
  getAll: () => api.get('/admin/messages'),
  markRead: (id) => api.patch(`/admin/messages/${id}/read`),
  reply: (id, replyText) => api.post(`/admin/messages/${id}/reply`, { replyText }),
  delete: (id) => api.delete(`/admin/messages/${id}`),
};

export const contactService = {
  send: (data) => api.post('/contact', data),
};

export const githubService = {
  getStats: () => api.get('/github/stats'),
};

export const uploadService = {
  upload: (formData) =>
    api.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
