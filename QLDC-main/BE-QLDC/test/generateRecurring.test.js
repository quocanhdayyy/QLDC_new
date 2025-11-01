const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { expect } = require('chai');

describe('generateRecurringEvents', function() {
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

  it('creates events for current year from recurring templates', async () => {
    const Event = require('../models/Event');
    // create template
    const templateStart = new Date(2020, 4, 1); // May 1
    const templateEnd = new Date(2020, 4, 2);
    const tpl = await Event.create({
      name: 'Test Recurring Event',
      type: 'ANNUAL',
      startDate: templateStart,
      endDate: templateEnd,
      maxSlots: 10,
      recurringAnnual: true,
      notifyOnOpen: false,
      status: 'DRAFT'
    });

    const { generateRecurringEvents } = require('../scripts/generateRecurringEvents');
    await generateRecurringEvents();

    const now = new Date();
    const targetYear = now.getFullYear();

    const created = await Event.findOne({ name: tpl.name, startDate: { $gte: new Date(targetYear,0,1), $lt: new Date(targetYear+1,0,1) } });
    expect(created).to.exist;
    expect(created.recurringAnnual).to.be.false;
    expect(created.maxSlots).to.equal(10);
  });
});
