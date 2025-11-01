require('dotenv').config();
const mongoose = require('mongoose');

const mongo = process.env.MONGODB_ATLAS || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/qldc';

async function generateRecurringEvents() {
  // This function assumes mongoose connection is already established when called.
  const Event = require('../models/Event');

  // Find events marked as recurringAnnual - treat them as templates
  const templates = await Event.find({ recurringAnnual: true });
  console.log(`Found ${templates.length} recurring templates`);

  const now = new Date();
  const targetYear = now.getFullYear();

  let created = 0;

  for (const t of templates) {
    const templateStart = t.startDate ? new Date(t.startDate) : null;
    if (!templateStart) continue;

    const start = new Date(templateStart);
    start.setFullYear(targetYear);
    let end = t.endDate ? new Date(t.endDate) : null;
    if (end) end.setFullYear(targetYear);

    // Check if an event with same name and start year already exists
    const exists = await Event.findOne({
      name: t.name,
      startDate: { $gte: new Date(targetYear, 0, 1), $lt: new Date(targetYear + 1, 0, 1) }
    });

    if (exists) {
      console.log(`Event for "${t.name}" in ${targetYear} already exists (id=${exists._id}). Skipping.`);
      continue;
    }

    const newEvent = new Event({
      name: t.name,
      type: t.type,
      startDate: start,
      endDate: end,
      maxSlots: t.maxSlots,
      slotsTaken: 0,
      conditions: t.conditions,
      recurringAnnual: false,
      notifyOnOpen: t.notifyOnOpen,
      status: 'DRAFT',
      createdBy: 'system',
      note: `Generated from recurring template ${t._id} for year ${targetYear}`,
    });

    await newEvent.save();
    console.log(`Created event "${newEvent.name}" (${newEvent._id}) for ${targetYear}`);
    created++;
  }

  console.log(`Done. Created ${created} events.`);
}

// If run directly from command line, connect to DB and execute
if (require.main === module) {
  (async () => {
    try {
      console.log('Connecting to', mongo);
      await mongoose.connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true });
      await generateRecurringEvents();
      process.exit(0);
    } catch (err) {
      console.error('Error:', err);
      process.exit(2);
    }
  })();
}

module.exports = { generateRecurringEvents };
