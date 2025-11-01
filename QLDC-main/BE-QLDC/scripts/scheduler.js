const cron = require('node-cron');
const { generateRecurringEvents } = require('./generateRecurringEvents');
const Event = require('../models/Event');
const notificationService = require('../services/notificationService');

// Scheduler: daily tasks
// - generate recurring events (from templates with recurringAnnual:true)
// - open events whose startDate <= now and status is DRAFT
// - close/mark ended events whose endDate < now and status is OPEN

function startScheduler() {
  // run once on start
  runDailyTasks().catch(err => console.error('Scheduler initial run error:', err));

  // schedule to run daily at 00:05
  cron.schedule('5 0 * * *', () => {
    console.log('[scheduler] Running daily tasks:', new Date().toISOString());
    runDailyTasks().catch(err => console.error('Scheduler run error:', err));
  }, { timezone: 'Asia/Ho_Chi_Minh' });

  console.log('[scheduler] Started daily scheduler (05:00).');
}

async function runDailyTasks() {
  // 1. generate recurring events
  try {
    await generateRecurringEvents();
  } catch (err) {
    console.error('[scheduler] generateRecurringEvents failed:', err);
  }

  const now = new Date();

  // 2. Open events where startDate <= now and status = DRAFT
  try {
    const toOpen = await Event.find({ status: 'DRAFT', startDate: { $lte: now } });
    for (const ev of toOpen) {
      ev.status = 'OPEN';
      await ev.save();
      console.log(`[scheduler] Opened event ${ev._id} (${ev.name})`);
      if (ev.notifyOnOpen) {
        await notificationService.create({ title: `Sự kiện mở: ${ev.name}`, message: `Sự kiện ${ev.name} đã mở đăng ký.`, type: 'EVENT', entityType: 'Event', entityId: ev._id });
      }
    }
  } catch (err) {
    console.error('[scheduler] open events failed:', err);
  }

  // 3. Close events where endDate < now and status = OPEN -> mark as ENDED
  try {
    const toEnd = await Event.find({ status: 'OPEN', endDate: { $lt: now } });
    for (const ev of toEnd) {
      ev.status = 'ENDED';
      await ev.save();
      console.log(`[scheduler] Ended event ${ev._id} (${ev.name})`);
    }
  } catch (err) {
    console.error('[scheduler] end events failed:', err);
  }
}

module.exports = { startScheduler };
