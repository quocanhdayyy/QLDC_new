const express = require('express');
const { eventController } = require('../controllers');
const { authenticate, isLeader, isCitizen } = require('../middleware/auth');

const router = express.Router();

// Admin: create, list, update, delete
router.get('/', authenticate, isLeader, eventController.getAll);
router.post('/', authenticate, isLeader, eventController.create);
router.get('/:id', authenticate, eventController.getById);
router.patch('/:id', authenticate, isLeader, eventController.update);
router.delete('/:id', authenticate, isLeader, eventController.delete);

// Open/Close
router.post('/:id/open', authenticate, isLeader, eventController.open);
router.post('/:id/close', authenticate, isLeader, eventController.close);

// Registrations
router.post('/:id/register', authenticate, isCitizen, eventController.register);
router.get('/:id/registrations', authenticate, isLeader, eventController.getRegistrations);
router.post('/:id/registrations/:registrationId/given', authenticate, isLeader, eventController.markGiven);

module.exports = router;
