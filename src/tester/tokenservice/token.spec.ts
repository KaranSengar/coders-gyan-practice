import { DataSource, Repository } from "typeorm";
import AppDataSource from "../../data.source";
import { TokenService } from "../../service/tokenService";
import { RefreshToken } from "../../Entity/RefreshToken";
import { User } from "../../Entity/User.entiry";
import jwt from "jsonwebtoken";
import config from "../../config";
import { Role } from "../../constrant";
describe("TokenService", () => {
    let connection: DataSource;
    let refreshTokenRepo: Repository<RefreshToken>;
    let tokenService: TokenService;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
        refreshTokenRepo = connection.getRepository(RefreshToken);
        tokenService = new TokenService(refreshTokenRepo);
    });
    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
    });


    afterAll(async () => {
        await connection.destroy();
    });

    describe("generateAccessToken", () => {
        it("should generate access token successfully", () => {
            const payload = { id: 1, role: "ADMIN" };

            const token = tokenService.generateAccessToken(payload);

            const decoded = jwt.decode(token) as jwt.JwtPayload;

            expect(decoded).toBeTruthy();
            expect(decoded.iss).toBe("practiceset");
        });

        it("should throw error if PRIVATE_KEY is missing", () => {
            const oldKey = config.PRIVATE_KEY;
            config.PRIVATE_KEY = null;

            expect(() =>
                tokenService.generateAccessToken({ id: 1 }),
            ).toThrow("error while reading private key");

            config.PRIVATE_KEY = oldKey;
        });



    });

    describe("generateRefreshtoken", () => {
        it("should generate refresh token", () => {
            const payload = { id: 1 };

            const token = tokenService.generateRefreshtoken(payload);

            const decoded = jwt.verify(
                token,
                config.REFRESH_TOKEN_SECRET,
            ) as jwt.JwtPayload;

            expect(decoded.iss).toBe("practiceset");
            expect(decoded.jti).toBe("1");
        });
    });

    describe("persistRefreshToken", () => {
        it("should save refresh token in database", async () => {
            const userRepo = connection.getRepository(User);

            const user = await userRepo.save({
                firstName: "Karan",
                lastName: "T",
                email: "karan@test.com",
                password: "password",
                role: Role.CUSTOMER,
            });

            const token = await tokenService.persistRefreshToken(user);

            expect(token.id).toBeDefined();
            expect(token.user.id).toBe(user.id);
        });
        ;
    });

    describe("deleteRefreshToken", () => {
        it("should delete refresh token by id", async () => {
            const userRepo = connection.getRepository(User);

            const user = await userRepo.save({
                firstName: "A",
                lastName: "B",
                email: "ab@test.com",
                password: "password",
                role: Role.CUSTOMER, // ✅ REQUIRED
            });

            const token = await tokenService.persistRefreshToken(user);

            const result = await tokenService.deleteRefreshToken(token.id);

            expect(result.affected).toBe(1);
        });
    });
});
