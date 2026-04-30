const bcrypt = require('bcrypt');

const rawUsers = [
  { username: 'admin', password: 'admin123', role: 'admin' }
];

const users = rawUsers.map((user) => ({
  ...user,
  passwordHash: bcrypt.hashSync(user.password, 10),
  password: undefined
}));

function findUser(username) {
  return users.find((user) => user.username === username);
}

module.exports = { findUser };
