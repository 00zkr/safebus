function formatTime(date = new Date()) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

function routeName(route) {
  return route ? route.name : 'the assigned route';
}

function buildNotificationMessage(type, bus, route, details = {}) {
  const name = routeName(route);
  const time = formatTime();

  if (type === 'departure') {
    return `${bus.name} departed on ${name} at ${time}.`;
  }

  if (type === 'near_stop') {
    const stopName = details.stop_name || 'your stop';
    return `${bus.name} is near ${stopName} on ${name}. Please be ready.`;
  }

  if (type === 'delay') {
    const minutes = details.delay_minutes ? ` by about ${details.delay_minutes} minutes` : '';
    return `${bus.name} is delayed${minutes} on ${name}. We will keep you updated.`;
  }

  if (type === 'arrival') {
    return `${bus.name} arrived and completed ${name} at ${time}.`;
  }

  return `${bus.name} has an update for ${name}.`;
}

function priorityForType(type) {
  if (type === 'delay') return 'high';
  if (type === 'near_stop') return 'medium';
  return 'normal';
}

module.exports = { buildNotificationMessage, priorityForType };
