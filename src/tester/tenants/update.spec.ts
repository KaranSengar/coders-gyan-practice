import { DataSource } from "typeorm";
import AppDataSource from "../../data.source";
import { app } from "../../app";
import request from "supertest";
import { Tenant } from "../../Entity/Tenant";
import createJWKSMock from "mock-jwks";
import { Role } from "../../constrant";

describe("PUT /tenants/:id", () => {
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
        const tenantrepo = connection.getRepository(Tenant);
        const tenant = tenantrepo.create({
            name: "Old Name",
            address: "Old Address",
        });
        return tenantrepo.save(tenant);
    };

    describe("Given all valid inputs", () => {
        it("should update tenant and return 200", async () => {
            const tenant = await createTenant();

            const response = await request(app)
                .patch(`/tenants/${tenant.id}`)
                .set("Cookie", [`accessToken=${admintoken}`])
                .send({
                    name: "New Name",
                    address: "New Address",
                });
            console.log(response.body, "body me kya hai")

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ id: tenant.id });

            const tenantrepo = connection.getRepository(Tenant);
            const updatedTenant = await tenantrepo.findOneBy({ id: tenant.id });

            expect(updatedTenant?.name).toBe("New Name");
            expect(updatedTenant?.address).toBe("New Address");
        });
    });

    describe("Auth & Role checks", () => {
        it("should return 401 if user is not authenticated", async () => {
            const tenant = await createTenant();

            const response = await request(app)
                .patch(`/tenants/${tenant.id}`)
                .send({
                    name: "New Name",
                    address: "New Address",
                });

            expect(response.statusCode).toBe(401);
        });

        it("should return 403 if user is not admin", async () => {
            const tenant = await createTenant();

            const managertoken = jwks.token({
                sub: "2",
                role: Role.MANEGER,
            });

            const response = await request(app)
                .patch(`/tenants/${tenant.id}`)
                .set("Cookie", [`accessToken=${managertoken}`])
                .send({
                    name: "New Name",
                    address: "New Address",
                });

            expect(response.statusCode).toBe(403);
        });
    });

    describe("Validation & error cases", () => {
        it("should return 400 if validation fails", async () => {
            const tenant = await createTenant();

            const response = await request(app)
                .patch(`/tenants/${tenant.id}`)
                .set("Cookie", [`accessToken=${admintoken}`])
                .send({});

            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it("should return 400 if tenant id is invalid", async () => {
            const response = await request(app)
                .patch("/tenants/abc")
                .set("Cookie", [`accessToken=${admintoken}`])
                .send({
                    name: "Name",
                    address: "Address",
                });

            expect(response.statusCode).toBe(400);
        });
    });
});
