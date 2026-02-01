import { DataSource } from "typeorm";
import AppDataSource from "../../data.source";
import request from "supertest";
import { app } from "../../app";
import createJWKSMock from "mock-jwks";
import { User } from "../../Entity/User.entiry";
import { Role } from "../../constrant";
import { Tenant } from "../../Entity/Tenant";
import { createTenant } from "../../utils";

describe("POST /users", () => {
  let connection: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;
  beforeAll(async () => {
    jwks = createJWKSMock("http://localhost:5001");
    connection = await AppDataSource.initialize();
  });
  beforeEach(async () => {
    jwks.start();
    await connection.dropDatabase();
    await connection.synchronize();
  });
  afterEach(() => {
    jwks.stop();
  });
  afterAll(async () => {
    await connection.destroy();
  });
  describe("Given all fields", () => {
    it("should persist the user in the database", async () => {
      // Create tenant first
      const tenant = await createTenant(connection.getRepository(Tenant));

      const adminToken = jwks.token({
        sub: "1",
        role: Role.ADMIN,
      });

      // Register user
      const userData = {
        firstName: "Rakesh",
        lastName: "K",
        email: "rakesh@mern.space",
        password: "password",
        tenantId: tenant.id,
        role: Role.MANEGER,
      };

      // Add token to cookie
      await request(app)
        .post("/users")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send(userData);

      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users).toHaveLength(1);
      expect(users[0].email).toBe(userData.email);
    });
    it("should persist firstname in the database", async () => {
      // Create tenant first
      const tenant = await createTenant(connection.getRepository(Tenant));

      const adminToken = jwks.token({
        sub: "1",
        role: Role.ADMIN,
      });

      // Register user
      const userData = {
        firstName: "Rakesh",
        lastName: "K",
        email: "rakesh@mern.space",
        password: "password",
        tenantId: tenant.id,
        role: Role.MANEGER,
      };

      // Add token to cookie
      await request(app)
        .post("/users")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send(userData);

      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users).toHaveLength(1);
      expect(users[0].firstName).toBe(userData.firstName);
    });

    it("should persist lastname in the database", async () => {
      // Create tenant first
      const tenant = await createTenant(connection.getRepository(Tenant));

      const adminToken = jwks.token({
        sub: "1",
        role: Role.ADMIN,
      });

      // Register user
      const userData = {
        firstName: "Rakesh",
        lastName: "K",
        email: "rakesh@mern.space",
        password: "password",
        tenantId: tenant.id,
        role: Role.MANEGER,
      };

      // Add token to cookie
      await request(app)
        .post("/users")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send(userData);

      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users).toHaveLength(1);
      expect(users[0].lastName).toBe(userData.lastName);
    });



    it("should persist password in the database", async () => {
      // Create tenant first
      const tenant = await createTenant(connection.getRepository(Tenant));

      const adminToken = jwks.token({
        sub: "1",
        role: Role.ADMIN,
      });

      // Register user
      const userData = {
        firstName: "Rakesh",
        lastName: "K",
        email: "rakesh@mern.space",
        password: "password",
        tenantId: tenant.id,
        role: Role.MANEGER,
      };

      // Add token to cookie
      await request(app)
        .post("/users")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send(userData);

      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users).toHaveLength(1);
      expect(users[0].password).toBe(userData.password);
    });




    it("should create a manager user ", async () => {
      const tenant = await createTenant(connection.getRepository(Tenant));

      const admintoken = jwks.token({
        sub: "1",
        role: Role.ADMIN,
      });
      const userdata = {
        firstName: "karan",
        lastName: "s",
        email: "karan@12.com",
        password: "password",
        role: "admin",
        tenantId: tenant.id,
      };
      await request(app)
        .post("/users")
        .set("Cookie", [`accessToken=${admintoken}`])
        .send(userdata);
      // console.log(response.body)

      const userRepo = connection.getRepository(User);

      const users = await userRepo.find();

      // expect(users).toHaveLength(1)
      expect(users[0].role).toBe(Role.ADMIN);
    });
  });
});
