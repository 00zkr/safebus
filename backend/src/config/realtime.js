let ioInstance = null;

function setRealtimeServer(io) {
  ioInstance = io;
}

function emitRealtime(event, payload) {
  if (ioInstance) {
    ioInstance.emit(event, payload);
  }
}

module.exports = { setRealtimeServer, emitRealtime };
