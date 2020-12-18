const request = require('supertest');
const server = require('./api/server');
const db = require("./data/dbconfig");

const testUser = {username: "goose", password: "honk"}

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();

});
beforeEach(async () => {
  await db('resource').truncate();
  await db.seed.run();
});
afterAll(async () => {
  await db.destroy();
});

test('sanity', () => {
  expect(true).toBe(false);
});

describe('server.js', () => {
  describe('register endpoint', () => {
    it('should return 201 if successful', () => {
      const res = await request(server).post("/register").send(testUser);
      expect(res.status).toBe(201);
    })
    it('should return user created', () => {
      const res = await request(server).post("/register").send(testUser);
      expect(res.body).toBe(testUser);
    })
  });

  describe('login endpoint', () => {
    it('should return 200 if successful', () => {
      const res = await request(server).post("/login").send(testUser);
      expect(res.status).toBe(200);
    })
    it('should return token', () => {
      const res = await request(server).post("/login").send(testUser);
      const keys = Object.keys(res.body)
      expect(keys).toContain("token");
    })
  });

  describe('jokes endpoint', () => {
    it('should return 201 if successful', () => {
      const res = await request(server).get("/jokes");
      expect(res.status).toBe(200);
    })
    it('should return user created', () => {
      const res = await request(server).get("/jokes");
      expect(res.type).toEqual('application/json');
    })
  });
});
