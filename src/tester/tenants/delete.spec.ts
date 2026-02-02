import { DataSource } from "typeorm";
import AppDataSource from "../../data.source";
import { app } from "../../app";
import request from "supertest";
import { Tenant } from "../../Entity/Tenant";
import createJWKSMock from "mock-jwks";
import { Role } from "../../constrant";

describe("DELETE /tenants/:id", () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;
    let admintoken: string;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks = createJWKSMock("http://localhost:5001");
        await connection.dropDatabase();
        await connection.synchronize();
        jwks.start();

        admintoken = jwks.token({
            sub: "1",
            role: Role.ADMIN,
        });
    });

    afterEach(() => {
        jwks.stop();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    const createTenant = async () => {
        const repo = connection.getRepository(Tenant);
        const tenant = repo.create({
            name: "Tenant A",
            address: "Address A",
        });
        return repo.save(tenant);
    };

    it("should delete tenant and return id", async () => {
        const tenant = await createTenant();

        const response = await request(app)
            .delete(`/tenants/${tenant.id}`)
            .set("Cookie", [`accessToken=${admintoken}`]);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ id: tenant.id });

        const repo = connection.getRepository(Tenant);
        const deleted = await repo.findOneBy({ id: tenant.id });
        expect(deleted).toBeNull();
    });

    it("should return 400 if id is invalid", async () => {
        const response = await request(app)
            .delete("/tenants/xyz")
            .set("Cookie", [`accessToken=${admintoken}`]);

        expect(response.statusCode).toBe(400);
    });
});
