const request = require('supertest');
const fc = require('fast-check');
const app = require('../src/index');

describe('Property-Based Tests', () => {
  test('Valid emails should never return 400', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 100 }),
          email: fc
            .tuple(
              fc.stringMatching(/^[a-z][a-z0-9]{2,8}$/),
              fc.constantFrom('example.com', 'test.com', 'mail.com')
            )
            .map(([local, domain]) => `${local}@${domain}`),
        }),
        async (user) => {
          const res = await request(app).post('/users').send(user);

          expect(res.statusCode).toBe(201);
          expect(res.body.email).toBe(user.email);
        }
      )
    );
  });

  test('Invalid emails should always fail validation', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 100 }),
          email: fc.string().filter((e) => !e.includes('@')),
        }),
        async (user) => {
          const res = await request(app).post('/users').send(user);

          expect(res.statusCode).toBe(400);
        }
      )
    );
  });

  test('Empty names should always fail', async () => {
    await fc.assert(
      fc.asyncProperty(fc.emailAddress(), async (email) => {
        const res = await request(app).post('/users').send({
          name: '',
          email,
        });

        expect(res.statusCode).toBe(400);
      })
    );
  });
});
