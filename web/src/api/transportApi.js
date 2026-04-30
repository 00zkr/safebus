import api from './client';

export async function login(username, password) {
  const { data } = await api.post('/auth/login', { username, password });
  return data;
}

export async function getStudents() {
  const { data } = await api.get('/students');
  return data;
}

export async function createStudent(payload) {
  const { data } = await api.post('/students', payload);
  return data;
}

export async function updateStudent(id, payload) {
  const { data } = await api.put(`/students/${id}`, payload);
  return data;
}

export async function deleteStudent(id) {
  await api.delete(`/students/${id}`);
}

export async function getBuses() {
  const { data } = await api.get('/buses');
  return data;
}

export async function createBus(payload) {
  const { data } = await api.post('/buses', payload);
  return data;
}

export async function updateBus(id, payload) {
  const { data } = await api.put(`/buses/${id}`, payload);
  return data;
}

export async function deleteBus(id) {
  await api.delete(`/buses/${id}`);
}

export async function getRoutes() {
  const { data } = await api.get('/routes');
  return data;
}

export async function createRoute(payload) {
  const { data } = await api.post('/routes', payload);
  return data;
}

export async function updateRoute(id, payload) {
  const { data } = await api.put(`/routes/${id}`, payload);
  return data;
}

export async function deleteRoute(id) {
  await api.delete(`/routes/${id}`);
}

export async function getNotifications(filters = {}) {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== '' && value !== null && value !== undefined)
  );
  const { data } = await api.get('/notifications', { params });
  return data;
}

export async function createNotification(payload) {
  const { data } = await api.post('/notifications', payload);
  return data;
}

export async function resetDemoData() {
  const { data } = await api.post('/demo/reset');
  return data;
}
