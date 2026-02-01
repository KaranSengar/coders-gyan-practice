import { expressjwt, GetVerificationKey } from "express-jwt";
import jwksClient from "jwks-rsa";
import config from "../config";
import { Request } from "express";
console.log(config.JWKS_URI, "ye erro jwks ka hai");



export default expressjwt({
  secret: jwksClient.expressJwtSecret({
    jwksUri: config.JWKS_URI!,
    cache: true,
    rateLimit: true,
  }) as GetVerificationKey,
  algorithms: ["RS256"],
  getToken(req: Request) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.split(" ")[1] !== "undefined") {
      const token = authHeader.split(" ")[1];
      if (token) {
        return token;
      }
    }
    type AuthCookie = { accessToken: string };
    const { accessToken } = req.cookies as AuthCookie;
    return accessToken;
  },
});
