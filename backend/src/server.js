const app = require('./app');
const env = require('./config/env');
const http = require('http');
const { Server } = require('socket.io');
const { setRealtimeServer } = require('./config/realtime');
const { ensureCredentialColumns } = require('./services/schemaService');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

setRealtimeServer(io);

io.on('connection', (socket) => {
  socket.emit('system:ready', { message: 'Realtime transport updates connected' });
});

ensureCredentialColumns()
  .then(() => {
    server.listen(env.port, () => {
      console.log(`School transport backend running on port ${env.port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to prepare database schema', error);
    process.exit(1);
  });
