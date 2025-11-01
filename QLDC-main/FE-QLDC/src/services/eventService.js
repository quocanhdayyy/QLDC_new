import api from './index';

const eventService = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/events', { params });
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/events/${id}`);
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post('/events', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.patch(`/events/${id}`, payload);
    return data;
  },
  open: async (id) => {
    const { data } = await api.post(`/events/${id}/open`);
    return data;
  },
  close: async (id) => {
    const { data } = await api.post(`/events/${id}/close`);
    return data;
  },
  register: async (id, payload) => {
    const { data } = await api.post(`/events/${id}/register`, payload);
    return data;
  },
  getRegistrations: async (id, params = {}) => {
    const { data } = await api.get(`/events/${id}/registrations`, { params });
    return data;
  },
  exportRegistrationsCsv: async (id) => {
    const res = await api.get(`/events/${id}/registrations?export=csv`, { responseType: 'blob' });
    return res.data;
  },
  markGiven: async (eventId, registrationId) => {
    const { data } = await api.post(`/events/${eventId}/registrations/${registrationId}/given`);
    return data;
  },
};

export default eventService;
