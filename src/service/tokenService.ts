import { JwtPayload, sign } from "jsonwebtoken";
import createHttpError from "http-errors";
import { RefreshToken } from "../Entity/RefreshToken";
import { User } from "../Entity/User.entiry";
import { Repository } from "typeorm";
import config from "../config";
export class TokenService {
  constructor(private refreshtokenRepository: Repository<RefreshToken>) { }

  generateAccessToken(payload: JwtPayload) {
    let privatekey: string;

    if (!config.PRIVATE_KEY) {
      const error = createHttpError(500, "error while reading private key");
      throw error;
    }
    try {
      privatekey = config.PRIVATE_KEY!;
    } catch (err) {
      const error = createHttpError(
        500,
        "Error while reading private key",
        err,
      );
      throw error;
    }
    const accessToken = sign(payload, privatekey, {
      algorithm: "RS256",
      expiresIn: "1h",
      issuer: "practiceset",
    });
    return accessToken;
  }
  generateRefreshtoken(payload: JwtPayload) {
    const refreshToken = sign(payload, config.REFRESH_TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "1y",
      issuer: "practiceset",
      jwtid: String(payload.id),
    });
    return refreshToken;
  }

  async persistRefreshToken(user: User) {
    // persistes the refresh token
    //ham yaha intence pass krna hota hai kyoki reletionship hai typeorm internally kam karenga user id ko connect kr dega
    const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;

    const newRefreshtoken = await this.refreshtokenRepository.save({
      user: user,
      expiresAt: new Date(Date.now() + MS_IN_YEAR),
    });
    return newRefreshtoken;
  }

  async deleteRefreshToken(tokenId: number) {
    return await this.refreshtokenRepository.delete({ id: tokenId });
  }
}
