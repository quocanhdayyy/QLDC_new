const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const registrationSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    citizenName: { type: String, required: true },
    nationalId: { type: String, trim: true },
    household: { type: String, trim: true },
    registeredAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['REGISTERED', 'GIVEN', 'CANCELLED'], default: 'REGISTERED', index: true },
    notes: { type: String },
  },
  { timestamps: true }
);

registrationSchema.index({ event: 1, user: 1 });

module.exports = model('Registration', registrationSchema);
