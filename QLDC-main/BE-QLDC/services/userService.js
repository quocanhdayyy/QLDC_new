const { User } = require('../models');

module.exports = {
  async create(data) {
    const user = await User.create(data);
    return user;
  },
  async getAll(filter = {}, options = {}) {
    const { limit = 50, page = 1, sort = '-createdAt' } = options;
    const docs = await User.find(filter).sort(sort).limit(limit).skip((page - 1) * limit);
    const total = await User.countDocuments(filter);
    return { docs, total, page, limit };
  },
  async getById(id) {
    return User.findById(id);
  },
  async update(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true });
  },
  async delete(id) {
    return User.findByIdAndDelete(id);
  },
};

