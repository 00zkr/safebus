const busModel = require('../models/busModel');
const routeModel = require('../models/routeModel');
const studentModel = require('../models/studentModel');
const notificationModel = require('../models/notificationModel');
const { emitRealtime } = require('../config/realtime');
const { buildNotificationMessage } = require('./notificationTemplateService');

const statusMap = {
  departure: 'active',
  delay: 'delayed',
  arrival: 'completed'
};

function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function createNotificationsForBus(busId, type, message) {
  const students = await studentModel.findByBusId(busId);
  const notifications = students.map((student) => ({
    student_id: student.id,
    type,
    message
  }));

  await notificationModel.createMany(notifications);
  return notifications;
}

async function getDriverBus(busId) {
  const bus = await busModel.findById(busId);

  if (!bus) {
    throw createError(404, 'Assigned bus was not found');
  }

  return bus;
}

async function startRoute(driverBusId) {
  const bus = await getDriverBus(driverBusId);
  const route = await routeModel.findByBusId(driverBusId);
  const updatedBus = await busModel.update(driverBusId, { status: 'active' });
  const notifications = await createNotificationsForBus(
    driverBusId,
    'departure',
    buildNotificationMessage('departure', bus, route)
  );

  emitRealtime('bus:updated', updatedBus);
  emitRealtime('notifications:created', { bus_id: driverBusId, type: 'departure', count: notifications.length });

  return {
    bus: updatedBus,
    route,
    notifications_created: notifications.length
  };
}

async function updateStatus(driverBusId, actionStatus) {
  const nextBusStatus = statusMap[actionStatus];

  if (!nextBusStatus) {
    throw createError(400, 'Unsupported driver status');
  }

  const bus = await getDriverBus(driverBusId);
  const route = await routeModel.findByBusId(driverBusId);
  const updatedBus = await busModel.update(driverBusId, { status: nextBusStatus });
  const notifications = await createNotificationsForBus(
    driverBusId,
    actionStatus,
    buildNotificationMessage(actionStatus, bus, route)
  );

  emitRealtime('bus:updated', updatedBus);
  emitRealtime('notifications:created', { bus_id: driverBusId, type: actionStatus, count: notifications.length });

  return {
    bus: updatedBus,
    route,
    notifications_created: notifications.length
  };
}

async function nearStop(driverBusId, stopName) {
  const bus = await getDriverBus(driverBusId);

  if (bus.status === 'completed') {
    throw createError(409, 'near_stop notifications are blocked after the route is completed');
  }

  const route = await routeModel.findByBusId(driverBusId);
  const notifications = await createNotificationsForBus(
    driverBusId,
    'near_stop',
    buildNotificationMessage('near_stop', bus, route, { stop_name: stopName })
  );

  emitRealtime('notifications:created', {
    bus_id: driverBusId,
    type: 'near_stop',
    stop_name: stopName,
    count: notifications.length
  });

  return {
    bus,
    route,
    notifications_created: notifications.length
  };
}

async function updateLocation(driverBusId, location) {
  await getDriverBus(driverBusId);

  const bus = await busModel.update(driverBusId, {
    current_lat: location.lat,
    current_lng: location.lng
  });

  emitRealtime('bus:location', bus);
  emitRealtime('bus:updated', bus);

  return { bus };
}

async function ensureNearStopAllowedForStudent(studentId) {
  const student = await studentModel.findById(studentId);

  if (!student) {
    throw createError(404, 'Student not found');
  }

  const bus = await busModel.findById(student.bus_id);

  if (bus && bus.status === 'completed') {
    throw createError(409, 'near_stop notifications are blocked after the route is completed');
  }
}

module.exports = {
  startRoute,
  updateStatus,
  nearStop,
  updateLocation,
  ensureNearStopAllowedForStudent
};
