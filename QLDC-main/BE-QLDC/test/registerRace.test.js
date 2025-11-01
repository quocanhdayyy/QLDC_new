const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { expect } = require('chai');

describe('eventService.register race condition', function() {
  this.timeout(20000);
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

  it('should not allow registrations to exceed maxSlots under concurrent attempts', async () => {
    const Event = require('../models/Event');
    const Registration = require('../models/Registration');
    const eventService = require('../services/eventService');
    const ObjectId = mongoose.Types.ObjectId;

    // create event with small capacity
    const maxSlots = 3;
    const ev = await Event.create({
      name: 'Concurrent Test Event',
      type: 'SPECIAL',
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60),
      maxSlots,
      slotsTaken: 0,
      status: 'OPEN'
    });

    const attempts = 10; // number of concurrent attempts
    const userId = new ObjectId();

    // build array of concurrent register promises
    const promises = Array.from({ length: attempts }).map((_, i) => {
      return eventService.register(String(ev._id), userId, { citizenName: `User ${i}`, nationalId: `ID${i}` })
        .then(() => ({ ok: true }))
        .catch((err) => ({ ok: false, message: err.message }));
    });

    const results = await Promise.all(promises);

    // count successful registrations
    const successCount = results.filter(r => r.ok).length;
    const regsInDb = await Registration.countDocuments({ event: ev._id });
    const updatedEvent = await Event.findById(ev._id);

    expect(successCount).to.equal(regsInDb);
    expect(regsInDb).to.be.at.most(maxSlots);
    expect(updatedEvent.slotsTaken).to.equal(regsInDb);

    // also expect at least one success (since maxSlots > 0)
    expect(successCount).to.be.at.least(1);
  });
});
