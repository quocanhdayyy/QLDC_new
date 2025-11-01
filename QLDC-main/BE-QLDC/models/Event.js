const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const eventSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['ANNUAL', 'SPECIAL'], default: 'SPECIAL', index: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    maxSlots: { type: Number, required: true, min: 1 },
    slotsTaken: { type: Number, default: 0 },
    conditions: { type: Schema.Types.Mixed, default: {} }, // JSON flexible conditions
    recurringAnnual: { type: Boolean, default: false },
    notifyOnOpen: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['DRAFT', 'OPEN', 'CLOSED', 'EXPIRED', 'ENDED'],
      default: 'DRAFT',
      index: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    note: { type: String },
  },
  { timestamps: true }
);

eventSchema.index({ name: 1, type: 1 });

module.exports = model('Event', eventSchema);
