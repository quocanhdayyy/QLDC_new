const { Event, Registration } = require('../models');
const auditLogService = require('./auditLogService');
const notificationService = require('./notificationService');

module.exports = {
  async create(data) {
    return Event.create(data);
  },

  async getAll(filter = {}, options = {}) {
    const { limit = 50, page = 1, sort = '-createdAt' } = options;
    const query = { ...filter };
    // simple text search
    if (filter.q) {
      query.name = { $regex: filter.q, $options: 'i' };
      delete query.q;
    }
    const docs = await Event.find(query).sort(sort).limit(limit).skip((page - 1) * limit);
    const total = await Event.countDocuments(query);
    return { docs, total, page, limit };
  },

  async getById(id) {
    return Event.findById(id);
  },

  async update(id, data) {
    // if trying to change maxSlots or conditions while there are registrations, prevent
    const regsCount = await Registration.countDocuments({ event: id });
    if (regsCount > 0) {
      // remove keys that are not allowed to change
      delete data.maxSlots;
      delete data.conditions;
    }
    return Event.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id) {
    await Registration.deleteMany({ event: id });
    return Event.findByIdAndDelete(id);
  },

  async openEvent(id, userId) {
    const ev = await Event.findByIdAndUpdate(id, { status: 'OPEN' }, { new: true });
    await auditLogService.create({ action: 'EVENT_OPENED', entityType: 'Event', entityId: id, performedBy: userId, reason: `Opened event ${id}` });
    if (ev && ev.notifyOnOpen) {
      // create a notification (system will handle who to notify)
      await notificationService.create({ title: `Sự kiện mở: ${ev.name}`, message: `Sự kiện ${ev.name} đã mở đăng ký.`, type: 'EVENT', entityType: 'Event', entityId: ev._id });
    }
    return ev;
  },

  async closeEvent(id, userId) {
    const ev = await Event.findByIdAndUpdate(id, { status: 'CLOSED' }, { new: true });
    await auditLogService.create({ action: 'EVENT_CLOSED', entityType: 'Event', entityId: id, performedBy: userId, reason: `Closed event ${id}` });
    return ev;
  },

  async register(eventId, userId, regData) {
    const ev = await Event.findOneAndUpdate({ _id: eventId, slotsTaken: { $lt: '$maxSlots' } }, {}, { new: true });
    // The above won't work because of $expr limitations; implement safe increment logic below
    const eventDoc = await Event.findById(eventId);
    if (!eventDoc) throw new Error('Event not found');
    if (eventDoc.status !== 'OPEN') throw new Error('Event is not open');
    if (eventDoc.slotsTaken >= eventDoc.maxSlots) throw new Error('No slots available');

    // increment slotsTaken atomically and create registration
    const updated = await Event.findOneAndUpdate({ _id: eventId, slotsTaken: { $lt: eventDoc.maxSlots } }, { $inc: { slotsTaken: 1 } }, { new: true });
    if (!updated) throw new Error('Failed to reserve slot');

    const reg = await Registration.create({ event: eventId, user: userId, ...regData });

    await auditLogService.create({ action: 'EVENT_REGISTER', entityType: 'Registration', entityId: reg._id, performedBy: userId, reason: `Register for event ${eventId}` });

    // create notification to user
    await notificationService.create({ toUser: userId, title: 'Đã đăng ký sự kiện', message: `Bạn đã đăng ký ${eventDoc.name}`, type: 'EVENT', entityType: 'Event', entityId: eventId });

    return reg;
  },

  async getRegistrations(eventId, filter = {}) {
    const query = { event: eventId, ...filter };
    const docs = await Registration.find(query).sort('-registeredAt');
    return docs;
  },

  async markGiven(registrationId, userId) {
    const reg = await Registration.findByIdAndUpdate(registrationId, { status: 'GIVEN' }, { new: true });
    await auditLogService.create({ action: 'EVENT_MARK_GIVEN', entityType: 'Registration', entityId: registrationId, performedBy: userId, reason: `Marked given ${registrationId}` });
    return reg;
  },
};
