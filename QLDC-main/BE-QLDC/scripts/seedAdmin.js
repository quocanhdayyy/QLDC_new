const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { User } = require('../models');

const MONGODB = process.env.MONGODB_ATLAS;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

async function seed() {
  if (!MONGODB) {
    console.error('Please set MONGODB_ATLAS in .env');
    process.exit(1);
  }
  await mongoose.connect(MONGODB);
  console.log('Connected to MongoDB');

  const username = process.env.SEED_ADMIN_USERNAME || 'admin';
  const password = process.env.SEED_ADMIN_PASSWORD || 'Passw0rd!';
  const fullName = process.env.SEED_ADMIN_FULLNAME || 'Tổ trưởng mặc định';

  const passwordHash = await bcrypt.hash(password, 10);
  const existing = await User.findOne({ username });
  let user;
  if (existing) {
    existing.passwordHash = passwordHash;
    existing.role = 'TO_TRUONG';
    existing.fullName = fullName;
    await existing.save();
    user = existing;
    console.log('Updated existing admin user');
  } else {
    user = await User.create({ username, passwordHash, role: 'TO_TRUONG', fullName });
    console.log('Created admin user');
  }

  const payload = { _id: user._id.toString(), username: user.username, role: user.role, fullName: user.fullName };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

  console.log('\n--- Seed result ---');
  console.log('username:', username);
  console.log('password:', password);
  console.log('jwt:', token);
  console.log('Use this token as Authorization: Bearer <token>');

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
