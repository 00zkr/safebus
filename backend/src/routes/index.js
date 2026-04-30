const express = require('express');
const authRoutes = require('./authRoutes');
const studentRoutes = require('./studentRoutes');
const busRoutes = require('./busRoutes');
const routeRoutes = require('./routeRoutes');
const notificationRoutes = require('./notificationRoutes');
const driverRoutes = require('./driverRoutes');
const demoRoutes = require('./demoRoutes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/buses', busRoutes);
router.use('/routes', routeRoutes);
router.use('/notifications', notificationRoutes);
router.use('/driver', driverRoutes);
router.use('/demo', demoRoutes);

module.exports = router;
