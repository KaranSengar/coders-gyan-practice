import { DataSource } from "typeorm";
import AppDataSource from "../../data.source";
import request from "supertest";
import { app } from "../../app";
import createJWKSMock from "mock-jwks";
import { User } from "../../Entity/User.entiry";
import { Role } from "../../constrant";
import { Tenant } from "../../Entity/Tenant";
import { createTenant } from "../../utils";



describe("DELETE /users/:id", () => {
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

  afterEach(() => jwks.stop());
  afterAll(async () => await connection.destroy());

  it("should delete user by id", async () => {
    const tenant = await createTenant(connection.getRepository(Tenant));

    const userRepo = connection.getRepository(User);
    const user = await userRepo.save({
      firstName: "Delete",
      lastName: "Me",
      email: "delete@test.com",
      password: "password",
      role: Role.CUSTOMER,
      tenantId: tenant.id,
    });

    const adminToken = jwks.token({
      sub: "1",
      role: Role.ADMIN,
    });

    const response = await request(app)
      .delete(`/users/${user.id}`)
      .set("Cookie", [`accessToken=${adminToken}`])
      .send();

    expect(response.statusCode).toBe(200);

    const deletedUser = await userRepo.findOneBy({ id: user.id });
    expect(deletedUser).toBeNull();
  });

  it("should return 400 for invalid id", async () => {
    const adminToken = jwks.token({ sub: "1", role: Role.ADMIN });

    const response = await request(app)
      .delete("/users/invalid")
      .set("Cookie", [`accessToken=${adminToken}`])
      .send();

    expect(response.statusCode).toBe(400);
  });
});
