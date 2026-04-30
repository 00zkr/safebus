const bcrypt = require('bcrypt');
const studentModel = require('../models/studentModel');

async function buildStudentPayload(body) {
  const payload = { ...body };

  if (payload.parent_password) {
    payload.parent_password_hash = await bcrypt.hash(payload.parent_password, 10);
  }

  delete payload.parent_password;
  return payload;
}

async function list(req, res, next) {
  try {
    if (req.user.role === 'parent') {
      const student = await studentModel.findById(req.user.student_id);
      return res.json(student ? [student] : []);
    }

    const students = await studentModel.findAll();
    return res.json(students);
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    const student = await studentModel.create(await buildStudentPayload(req.body));
    return res.status(201).json(student);
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const student = await studentModel.update(req.params.id, await buildStudentPayload(req.body));

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.json(student);
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    const deleted = await studentModel.remove(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = { list, create, update, remove };
