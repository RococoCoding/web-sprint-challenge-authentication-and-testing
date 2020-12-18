const request = require('supertest');
const server = require('./server');
const db = require("../data/dbconfig");

const testUser = {username: "goose", password: "honk"}

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();

});
beforeEach(async () => {
  await db('users').truncate();
  // await db.seed.run();
});
afterAll(async () => {
  await db.destroy();
});

describe('server.js', () => {
  describe('register endpoint', () => {
    it('should return 201 if successful', async () => {
      const res = await request(server).post("/api/auth/register").send(testUser);
      expect(res.status).toBe(201);
    })
    it('should return user created', async () => {
      const res = await request(server).post("/api/auth/register").send(testUser);
      expect(res.body.username).toBe(testUser.username);
    })
  });

  describe('login endpoint', () => {
    it('should return 200 if successful', async () => {
      const res = await request(server).post("/api/auth/login").send(testUser);
      expect(res.status).toBe(200);
    })
    it('should return token', async () => {
      const res = await request(server).post("/api/auth/login").send(testUser);
      const keys = Object.keys(res.body)
      expect(keys).toContain("token");
    })
  });

  describe('jokes endpoint', () => {
    it('should return 200 if successful', async () => {
      const res = await request(server).get("/api/jokes");
      expect(res.status).toBe(200);
    })
    it('should return json object', async () => {
      const res = await request(server).get("/api/jokes");
      expect(res.type).toEqual('application/json');
    })
  });
});
