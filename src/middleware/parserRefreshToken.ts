import { expressjwt } from "express-jwt";
import config from "../config";
import { Request } from "express";

export default expressjwt({
    secret: config.REFRESH_TOKEN_SECRET!,
    algorithms: ['HS256'],

    getToken(req: Request) {

        type ValidateCookie = {
            refreshToken: string
        }
        const { refreshToken } = req.cookies as ValidateCookie
        return refreshToken
    },
})