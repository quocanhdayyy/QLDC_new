const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { expect } = require('chai');

describe('eventController CSV export', function() {
  this.timeout(10000);
  let mongod;

  before(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  after(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  it('returns CSV with header and rows', async () => {
    const Event = require('../models/Event');
    const Registration = require('../models/Registration');
    const event = await Event.create({
      name: 'CSV Event',
      type: 'SPECIAL',
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60),
      maxSlots: 5,
      status: 'OPEN'
    });

    await Registration.create({ event: event._id, citizenName: 'Nguyen Van A', nationalId: '001', household: 'H1' });
    await Registration.create({ event: event._id, citizenName: 'Tran Thi B', nationalId: '002', household: 'H1' });

    const controller = require('../controllers/eventController');

    const req = { params: { id: String(event._id) }, query: { export: 'csv' } };
    const sent = {};
    const headers = {};
    const res = {
      setHeader(k, v) { headers[k] = v; },
      send(body) { sent.body = body; }
    };

    await controller.getRegistrations(req, res, (err) => { if (err) throw err; });

    expect(headers['Content-Type']).to.match(/text\/csv/);
    expect(headers['Content-Disposition']).to.match(/attachment; filename=.*\.csv/);
    expect(sent.body).to.be.a('string');
    // BOM present
    expect(sent.body.charCodeAt(0)).to.equal(0xFEFF);
    // header row includes FullName
    expect(sent.body).to.include('FullName');
    // registered names present
    expect(sent.body).to.include('Nguyen Van A');
    expect(sent.body).to.include('Tran Thi B');
  });

  it('returns CSV with Vietnamese headers when lang=vi', async () => {
    const Event = require('../models/Event');
    const Registration = require('../models/Registration');
    const event = await Event.create({
      name: 'Sự kiện CSV',
      type: 'SPECIAL',
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60),
      maxSlots: 5,
      status: 'OPEN'
    });

    await Registration.create({ event: event._id, citizenName: 'Nguyen Van A', nationalId: '001', household: 'H1' });

    const controller = require('../controllers/eventController');

    const req = { params: { id: String(event._id) }, query: { export: 'csv', lang: 'vi' }, headers: {} };
    const sent = {};
    const headers = {};
    const res = {
      setHeader(k, v) { headers[k] = v; },
      send(body) { sent.body = body; }
    };

    await controller.getRegistrations(req, res, (err) => { if (err) throw err; });

    expect(headers['Content-Type']).to.match(/text\/csv/);
    expect(headers['Content-Disposition']).to.match(/attachment; filename=.*\.csv/);
    expect(sent.body).to.be.a('string');
    // BOM present
    expect(sent.body.charCodeAt(0)).to.equal(0xFEFF);
    // header row includes Vietnamese header
    expect(sent.body).to.include('Họ và tên');
    // registered name present
    expect(sent.body).to.include('Nguyen Van A');
  });
});
