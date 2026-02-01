import { DataSource } from "typeorm"
import AppDataSource from "../../data.source";
import { app } from "../../app";
import request from "supertest";
import { Tenant } from "../../Entity/Tenant";
import createJWKSMock from "mock-jwks";
import { Role } from "../../constrant";

describe("POST /tenants", () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;
    let admintoken: string
    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });
    beforeEach(async () => {
        jwks = createJWKSMock("http://localhost:5001")
        await connection.dropDatabase();
        await connection.synchronize();
        jwks.start()
        admintoken = jwks.token({
            sub: "1",
            role: Role.ADMIN
        })
    });
    afterEach(() => {
        jwks.stop()
    })
    afterAll(async () => {

        await connection.destroy();
    });
    describe("Given all fields", () => {
        it("should return a 201 status code", async () => {
            //arrenge
            const userData = {
                name: "tenantname",
                address: "tenant adress"
            };
            //act
            const response = await request(app).post("/tenants").set('Cookie', [`accessToken=${admintoken}`]).send(userData)
            expect(response.statusCode).toBe(201)
        })

        it("should create a tenant in the database ", async () => {
            const userData = {
                name: "tenantname",
                address: "tenant adress"
            };
            //act
            await request(app).post("/tenants").set('Cookie', [`accessToken=${admintoken}`]).send(userData)

            const tenantrepo = connection.getRepository(Tenant)

            const tenants = await tenantrepo.find()
            expect(tenants).toHaveLength(1)
            expect(tenants[0].name).toBe(userData.name)

        })

        it("should return 401 if user not authencated", async () => {
            const userData = {
                name: "tenantname",
                address: "tenant adress"
            };
            //act
            const response = await request(app).post("/tenants").send(userData)

            expect(response.statusCode).toBe(401)
            const tenantrepo = connection.getRepository(Tenant)

            const tenants = await tenantrepo.find()
            expect(tenants).toHaveLength(0)

        })

        it("should return 403 if user is not a admin", async () => {
            const userData = {
                name: "tenantname",
                address: "tenant adress"
            };
            const managertoken = jwks.token({
                sub: "1",
                role: Role.MANEGER
            })
            //act
            const response = await request(app).post("/tenants").set('Cookie', [`accessToken=${managertoken}`]).send(userData)

            expect(response.statusCode).toBe(403)
            const tenantrepo = connection.getRepository(Tenant)

            const tenants = await tenantrepo.find()
            expect(tenants).toHaveLength(0)



        })


    });
});
