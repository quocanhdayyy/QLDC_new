import api from "./index";

const citizenService = {
  getAll: async (params = {}) => {
    const { data } = await api.get("/citizens", { params });
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/citizens/${id}`);
    return data;
  },

  create: async (citizenData) => {
    const { data } = await api.post("/citizens", citizenData);
    return data;
  },

  update: async (id, citizenData) => {
    const { data } = await api.patch(`/citizens/${id}`, citizenData);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/citizens/${id}`);
    return data;
  },

  // Get current logged-in citizen info
  getMe: async () => {
    const { data } = await api.get("/citizens/me");
    return data;
  },

  // Get current citizen's household
  getMyHousehold: async () => {
    const { data } = await api.get("/citizens/me/household");
    return data;
  },
};

export default citizenService;



