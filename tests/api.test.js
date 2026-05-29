const request = require('supertest');
const app = require('../src/index');

describe('Health Check', () => {
  it('GET /health should return status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Users API', () => {
  it('GET /users should return list of users', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /users/:id should return a user', async () => {
    const res = await request(app).get('/users/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(1);
  });

  it('GET /users/:id should return 404 for unknown user', async () => {
    const res = await request(app).get('/users/999');
    expect(res.statusCode).toBe(404);
  });

  it('GET /users/:id should return 400 for invalid ID', async () => {
    const res = await request(app).get('/users/abc');
    expect(res.statusCode).toBe(400);
  });

  it('POST /users should create a new user', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'Charlie', email: 'charlie@example.com' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Charlie');
  });

  it('POST /users should return 400 if fields missing', async () => {
    const res = await request(app).post('/users').send({ name: 'No Email' });
    expect(res.statusCode).toBe(400);
  });
});