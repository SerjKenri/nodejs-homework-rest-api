const request = require("supertest");
const app = require("../../app");

describe("POST /users/login", () => {
  it("should return user token and status code 200", async () => {
    const testUser = {
      email: "dashachornaya@gmail.com",
      password: "1234567890",
    };

    const response = await request(app).post("/api/users/login").send(testUser);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        user: {
          email: expect.any(String),
          subscription: expect.any(String),
        },
      })
    );
  });

  it("should return unauthorized error", async () => {
    const testUser = {
      email: "morningstart@gmail.com",
      password: "superpassword",
    };

    const response = await request(app).post("/api/users/login").send(testUser);

    expect(response.statusCode).toBe(401);
  });
});
