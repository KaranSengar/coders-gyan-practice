
import { DataSource } from "typeorm"
import AppDataSource from "../../data.source"
import request from "supertest";
import { app } from "../../app";
import createJWKSMock from 'mock-jwks'
import { User } from "../../Entity/User.entiry";
import { Role } from "../../constrant";

describe("GET /auth/self", () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>
    beforeAll(async () => {
        jwks = createJWKSMock('http://localhost:5001')
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start()
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterEach(() => {
        jwks.stop()
    })


    afterAll(async () => {
        await connection.destroy();
    });

    describe("Given all fields", () => {
        it("should return the 200 status code", async () => {
            const accessToken = jwks.token({
                sub: "1",
                role: Role.CUSTOMER,
            });
            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send();
            expect(response.statusCode).toBe(200);
        });
        it("should return the user data ", async () => {
            //register user frontend pe automaticaly token send ho jata hai yaha hame manual send krna hoga
            //register user
            // generate token
            //add token to cookie
            /// arrange
            const userdata = {
                firstName: "karan",
                lastName: "s",
                email: "karan@12.com",
                password: "secret"
            }
            const userRepo = connection.getRepository(User)

            const data = await userRepo.save({ ...userdata, role: Role.CUSTOMER })
            const accessToken = jwks.token({ sub: String(data.id), role: data.role })

            const response = await request(app).get("/auth/self").set('Cookie', [`accessToken=${accessToken};`]).send()
            expect(response.body.id).toBe(data.id)
            //assert
            //check if user id matches with register user
        })
        it("should not return the password field", async () => {
            const userdata = {
                firstName: "karan",
                lastName: "s",
                email: "karan@12.com",
                password: "password"
            }
            const userRepo = connection.getRepository(User)

            const data = await userRepo.save({ ...userdata, role: Role.CUSTOMER })
            const accessToken = jwks.token({ sub: String(data.id), role: data.role })

            const response = await request(app).get("/auth/self").set('Cookie', [`accessToken=${accessToken}`]).send()
            // console.log(response.body)
            expect(response.body).not.toHaveProperty("password")
        })
        it("should not return 401 status code if token does not exists ", async () => {
            const userdata = {
                firstName: "karan",
                lastName: "s",
                email: "karan@12.com",
                password: "password"
            }
            const userRepo = connection.getRepository(User)

            await userRepo.save({ ...userdata, role: Role.CUSTOMER })

            const response = await request(app).get("/auth/self").send()
            // console.log(response.body)
            expect(response.statusCode).toBe(401)
        })


    });
});

