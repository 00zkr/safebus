const bcrypt = require('bcrypt');
const busModel = require('../models/busModel');

async function buildBusPayload(body) {
  const payload = { ...body };

  if (payload.driver_password) {
    payload.driver_password_hash = await bcrypt.hash(payload.driver_password, 10);
  }

  delete payload.driver_password;
  return payload;
}

async function list(req, res, next) {
  try {
    const buses = await busModel.findAll();
    return res.json(buses);
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    const bus = await busModel.create(await buildBusPayload(req.body));
    return res.status(201).json(bus);
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const bus = await busModel.update(req.params.id, await buildBusPayload(req.body));

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    return res.json(bus);
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    const deleted = await busModel.remove(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = { list, create, update, remove };
