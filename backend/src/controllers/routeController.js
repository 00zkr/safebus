const routeModel = require('../models/routeModel');

function normalizeRouteBody(body) {
  return {
    ...body,
    stops: body.stops === undefined ? undefined : JSON.stringify(body.stops)
  };
}

async function list(req, res, next) {
  try {
    const routes = await routeModel.findAll();
    return res.json(routes);
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    const route = await routeModel.create(normalizeRouteBody(req.body));
    return res.status(201).json(route);
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const route = await routeModel.update(req.params.id, normalizeRouteBody(req.body));

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    return res.json(route);
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    const deleted = await routeModel.remove(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Route not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = { list, create, update, remove };
