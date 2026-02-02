import { DataSource } from "typeorm";
import AppDataSource from "../../data.source";
import request from "supertest";
import { app } from "../../app";
import createJWKSMock from "mock-jwks";
import { User } from "../../Entity/User.entiry";
import { Role } from "../../constrant";
import { Tenant } from "../../Entity/Tenant";
import { createTenant } from "../../utils";





describe("PATCH /users/:id", () => {
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

    it("should update user details", async () => {
        const tenant = await createTenant(connection.getRepository(Tenant));

        const userRepo = connection.getRepository(User);
        const user = await userRepo.save({
            firstName: "Old",
            lastName: "Name",
            email: "old@test.com",
            password: "password",
            role: Role.CUSTOMER,
            tenantId: tenant.id,
        });

        const adminToken = jwks.token({
            sub: "1",
            role: Role.ADMIN,
        });

        const updateData = {
            firstName: "New",
            lastName: "User",
            email: "new@test.com",
            role: Role.MANEGER,
            tenantId: tenant.id,
        };

        const response = await request(app)
            .patch(`/users/${user.id}`)
            .set("Cookie", [`accessToken=${adminToken}`])
            .send(updateData);

        expect(response.statusCode).toBe(200);

        const updatedUser = await userRepo.findOneBy({ id: user.id });
        expect(updatedUser?.firstName).toBe("New");
        expect(updatedUser?.role).toBe(Role.MANEGER);
    });

    it("should return 400 for invalid id", async () => {
        const adminToken = jwks.token({ sub: "1", role: Role.ADMIN });

        const response = await request(app)
            .patch("/users/xyz")
            .set("Cookie", [`accessToken=${adminToken}`])
            .send({ firstName: "Test" });

        expect(response.statusCode).toBe(400);
    });
});
