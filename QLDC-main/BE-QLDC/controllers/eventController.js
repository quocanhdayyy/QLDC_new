const eventService = require('../services/eventService');

module.exports = {
  async create(req, res, next) {
    try {
      const payload = { ...req.body, createdBy: req.user && req.user._id };
      const doc = await eventService.create(payload);
      res.status(201).json(doc);
    } catch (err) { next(err); }
  },

  async getAll(req, res, next) {
    try {
      const { page, limit, sort, q, ...filter } = req.query;
      if (q) filter.q = q;
      const data = await eventService.getAll(filter, { page: Number(page) || 1, limit: Number(limit) || 50, sort });
      res.json(data);
    } catch (err) { next(err); }
  },

  async getById(req, res, next) {
    try {
      const doc = await eventService.getById(req.params.id);
      if (!doc) return res.status(404).json({ message: 'Not found' });
      res.json(doc);
    } catch (err) { next(err); }
  },

  async update(req, res, next) {
    try {
      const doc = await eventService.update(req.params.id, req.body);
      if (!doc) return res.status(404).json({ message: 'Not found' });
      res.json(doc);
    } catch (err) { next(err); }
  },

  async delete(req, res, next) {
    try {
      const doc = await eventService.delete(req.params.id);
      if (!doc) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted' });
    } catch (err) { next(err); }
  },

  async open(req, res, next) {
    try {
      const doc = await eventService.openEvent(req.params.id, req.user && req.user._id);
      res.json(doc);
    } catch (err) { next(err); }
  },

  async close(req, res, next) {
    try {
      const doc = await eventService.closeEvent(req.params.id, req.user && req.user._id);
      res.json(doc);
    } catch (err) { next(err); }
  },

  async register(req, res, next) {
    try {
      const reg = await eventService.register(req.params.id, req.user && req.user._id, req.body);
      res.status(201).json(reg);
    } catch (err) { next(err); }
  },

  async getRegistrations(req, res, next) {
    try {
      const docs = await eventService.getRegistrations(req.params.id);
      const event = await eventService.getById(req.params.id);
      // if export=csv
      if (req.query.export === 'csv') {
        const rows = [];
        // pick headers by language (query param `lang` or Accept-Language header)
        const lang = (req.query.lang || (req.headers && req.headers['accept-language']) || 'en').toLowerCase();
        const headersEn = ['STT', 'FullName', 'NationalId', 'Household', 'RegisteredAt', 'Status'];
        const headersVi = ['STT', 'Họ và tên', 'Số CMND/CCCD', 'Hộ khẩu', 'Thời gian đăng ký', 'Trạng thái'];
        const headerRow = lang.startsWith('vi') ? headersVi : headersEn;
        // header
        rows.push(headerRow.join(','));
        docs.forEach((d, i) => {
          const registeredAt = d.registeredAt ? new Date(d.registeredAt).toISOString() : '';
          // escape quotes
          const esc = (v) => `"${String(v || '').replace(/"/g, '""')}"`;
          rows.push([
            i + 1,
            esc(d.citizenName),
            esc(d.nationalId || ''),
            esc(d.household || ''),
            esc(registeredAt),
            esc(d.status),
          ].join(','));
        });
        // build filename with sanitized event name + year
        const rawName = (event && event.name) ? String(event.name) : String(req.params.id);
        const year = (event && event.startDate) ? new Date(event.startDate).getFullYear() : new Date().getFullYear();
        const sanitize = (s) => s.toString().toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .substr(0, 50)
          .replace(/^-|-$/g, '');
        const filename = `registrations-${sanitize(rawName)}-${year}.csv`;
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return res.send('\uFEFF' + rows.join('\n'));
      }
      res.json(docs);
    } catch (err) { next(err); }
  },

  async markGiven(req, res, next) {
    try {
      const doc = await eventService.markGiven(req.params.registrationId, req.user && req.user._id);
      res.json(doc);
    } catch (err) { next(err); }
  },
};
