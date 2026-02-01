import { expressjwt } from "express-jwt";
import config from "../config";
import { Request } from "express";
import AppDataSource from "../data.source";
import { RefreshToken } from "../Entity/RefreshToken";
import { logger } from "../config/logger";
import { IRefreshTokenPayload } from "../type";

export default expressjwt({
  secret: config.REFRESH_TOKEN_SECRET!,
  algorithms: ["HS256"],

  getToken(req: Request) {
    type ValidateCookie = {
      refreshToken: string;
    };
    const { refreshToken } = req.cookies as ValidateCookie;
    return refreshToken;
  },

  async isRevoked(req: Request, token) {
    // console.log(token, "token")
    try {
      const refreshTokenrepo = AppDataSource.getRepository(RefreshToken);
      const refreshToken = await refreshTokenrepo.findOne({
        where: {
          id: Number((token?.payload as IRefreshTokenPayload).id),
          user: { id: Number(token?.payload.sub) },
        },
      });
      return refreshToken === null;
    } catch (err) {
      logger.error(
        "Error while getting the refresh token",
        { id: Number((token?.payload as IRefreshTokenPayload).id) },
        err,
      );
    }
    return true;
  },
});
