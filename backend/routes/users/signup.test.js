import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { Sequelize } from 'sequelize';
import signUpRoute from './signup.js';

// mock defineUser
const mockUsers = new Map();
let nextUserId = 1;
const mockUser = {
  count: vi.fn(async () => mockUsers.size),
  create: vi.fn(async (data) => {
    const user = { id: nextUserId++, ...data };
    mockUsers.set(user.id, user);
    return user;
  }),
};

vi.mock('../../models/users.js', () => ({
  default: () => mockUser,
}));

describe('User Signup Route', () => {
  let app;
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: false,
  });

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/users', signUpRoute(sequelize));

    mockUsers.clear();
    nextUserId = 1;
    delete process.env.ALLOWED_SIGNUP_DOMAINS;
    vi.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.ALLOWED_SIGNUP_DOMAINS;
  });

  const signup = (email) => request(app).post('/users/signup').send({ email, password: 'password', username: 'test' });

  it('should allow signup from any domain when allowlist is not set', async () => {
    const response = await signup('someone@example.com');

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe('someone@example.com');
    expect(response.body.access_token).toBeDefined();
  });

  it('should allow signup from an allowed domain', async () => {
    process.env.ALLOWED_SIGNUP_DOMAINS = 'smartfoodsafe.com';
    const response = await signup('user@smartfoodsafe.com');

    expect(response.status).toBe(200);
  });

  it('should reject signup from a domain not in the allowlist', async () => {
    process.env.ALLOWED_SIGNUP_DOMAINS = 'smartfoodsafe.com';
    const response = await signup('attacker@gmail.com');

    expect(response.status).toBe(403);
    expect(mockUser.create).not.toHaveBeenCalled();
  });

  it('should match domains case-insensitively', async () => {
    process.env.ALLOWED_SIGNUP_DOMAINS = 'smartfoodsafe.com';
    const response = await signup('User@SmartFoodSafe.COM');

    expect(response.status).toBe(200);
  });

  it('should support multiple comma-separated domains', async () => {
    process.env.ALLOWED_SIGNUP_DOMAINS = 'smartfoodsafe.com, example.org';
    const response = await signup('user@example.org');

    expect(response.status).toBe(200);
  });

  it.each([undefined, '', 'no-at-sign', 'trailing@'])(
    'should reject malformed email when allowlist is set: %s',
    async (email) => {
      process.env.ALLOWED_SIGNUP_DOMAINS = 'smartfoodsafe.com';
      const response = await signup(email);

      expect(response.status).toBe(403);
      expect(mockUser.create).not.toHaveBeenCalled();
    }
  );

  it('should not be fooled by an allowed domain in the local part', async () => {
    process.env.ALLOWED_SIGNUP_DOMAINS = 'smartfoodsafe.com';
    const response = await signup('smartfoodsafe.com@evil.com');

    expect(response.status).toBe(403);
  });
});
