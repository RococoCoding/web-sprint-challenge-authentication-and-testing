const request = require('supertest');
const server = require('./server');
const db = require("../data/dbconfig");

const testUser = { username: "goose", password: "honk" };
const testUser2 = { username: "villager", password: "No Geese" };

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();

});

afterAll(async () => {
  await db.destroy();
});

describe('server.js', () => {
  describe('register endpoint', () => {
    it('should return 201 if successful', async () => {
      const res = await request(server).post("/api/auth/register").send(testUser);
      expect(res.status).toBe(201);
    });
    it('should return user created', async () => {
      const res = await request(server).post("/api/auth/register").send(testUser2);
      expect(res.body.username).toBe(testUser2.username);
    });
  });

  describe('login endpoint', () => {
    it('should return 200 if successful', async () => {
      const res = await request(server).post("/api/auth/login").send(testUser);
      expect(res.status).toBe(200);
    });
    it('should return token', async () => {
      const res = await request(server).post("/api/auth/login").send(testUser);
      const keys = Object.keys(res.body);
      expect(keys).toContain("token");
    });
  });

  describe('jokes endpoint', () => {
    it('should return 200 if successful', async () => {
      const login = await request(server).post("/api/auth/login").send(testUser);
      const token = login.body.token;
      console.log(token)
      const res = await request(server).get("/api/jokes").set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
    it('should return json object', async () => {
      const login = await request(server).post("/api/auth/login").send(testUser);
      const token = login.body.token;
      const res = await request(server).get("/api/jokes").set("Authorization", `Bearer ${token}`);
      expect(res.type).toEqual('application/json');
    });
  });
});
