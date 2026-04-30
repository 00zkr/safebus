const notificationModel = require('../models/notificationModel');
const { emitRealtime } = require('../config/realtime');

function list(filters) {
  return notificationModel.findFiltered(filters);
}

async function create(data) {
  const notification = await notificationModel.create(data);
  emitRealtime('notifications:created', { notification, count: 1 });
  return notification;
}

module.exports = { list, create };
