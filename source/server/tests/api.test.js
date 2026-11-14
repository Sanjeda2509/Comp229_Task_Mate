import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../src/app.js';

// These tests do NOT require MongoDB; full CRUD is verified using the Postman collection.
test('health endpoint responds', async () => {
  const response = await request(app).get('/api/health');
  assert.equal(response.status, 200);
  assert.equal(response.body.message, 'TaskMate API is running');
});
test('tasks API rejects unauthenticated requests', async () => {
  const response = await request(app).get('/api/tasks');
  assert.equal(response.status, 401);
});
test('profile API rejects unauthenticated requests', async () => {
  const response = await request(app).get('/api/users/me');
  assert.equal(response.status, 401);
});
test('unknown routes return 404', async () => {
  const response = await request(app).get('/api/nonexistent');
  assert.equal(response.status, 404);
});
