require('dotenv').config();

const Sentry = require('@sentry/node');
const express = require('express');
const { z } = require('zod');

const logger = require('./logger');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});
// var x = 1 ;     
// const y = 2  ;      
// eval('hello') ;
const UserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.get('/users', (req, res) => {
  logger.info('Fetching all users');

  res.json([
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ]);
});

app.get('/debug-sentry', (req, res) => {
  throw new Error('Sentry test error');
});

app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    logger.warn(`Invalid user ID received: ${req.params.id}`);

    return res.status(400).json({
      error: 'Invalid ID',
    });
  }

  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ];

  const user = users.find((u) => u.id === id);

  if (!user) {
    logger.warn(`User not found: id=${id}`);

    return res.status(404).json({
      error: 'User not found',
    });
  }

  logger.info(`User fetched: id=${id}`);

  res.json(user);
});

app.post('/users', (req, res) => {
  const result = UserSchema.safeParse(req.body);

  if (!result.success) {
    logger.warn('Validation failed on POST /users', {
      errors: result.error.errors,
    });

    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.errors,
    });
  }

  const { name, email } = result.data;

  logger.info(`New user created: ${email}`);

  res.status(201).json({
    id: 3,
    name,
    email,
  });
});

app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
  });

  Sentry.captureException(err);

  res.status(500).json({
    error: 'Internal server error',
  });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

module.exports = app;
