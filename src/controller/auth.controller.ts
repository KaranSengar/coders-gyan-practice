import type { NextFunction, Response } from "express";
import { Userservice } from "../service/auth.service";
import { JwtPayload } from "jsonwebtoken";
import type { AuthRequest, RegisterUser } from "../type";
import { logger } from "../config/logger";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

import { TokenService } from "../service/tokenService";
import { CredetialsService } from "../service/credentialservice";
import { Role } from "../constrant";

export class AuthController {
  constructor(
    private userservice: Userservice,
    private tokenservice: TokenService,
    private credetialservice: CredetialsService,
  ) {}

  async register(req: RegisterUser, res: Response, next: NextFunction) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(createHttpError(400, errors.array()[0].msg));
    }

    const { firstName, lastName, email, password } = req.body;

    logger.debug("new request to register a user", {
      firstName,
      lastName,
      email,
      password: "*****",
    });
    try {
      const user = await this.userservice.create({
        firstName,
        lastName,
        email,
        password,
        role: Role.CUSTOMER,
      });
      //console.log(user, "userdata")
      logger.info("user successfully create", { id: user.id });

      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
        tenant: user.tenant ? String(user.tenant.id) : "",
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };
      const accesstoken = this.tokenservice.generateAccessToken(payload);

      //persists the refresh data
      const newRefreshtoken = await this.tokenservice.persistRefreshToken(user);

      const refreshToken = this.tokenservice.generateRefreshtoken({
        ...payload,
        id: String(newRefreshtoken.id),
      });

      res.cookie("accessToken", accesstoken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, // 1h
        httpOnly: true, // very impotent
      });
      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true, // very impotent
      });
      // console.log(user.id)
      return res.status(201).json({
        id: user.id,
        firstName: user.firstName,
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req: RegisterUser, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createHttpError(400, errors.array()[0].msg));
    }

    const { email, password } = req.body;
    logger.debug("new request to login a user", {
      email,
      password: "*****",
    });
    try {
      const user = await this.userservice.findByEmail(email);

      if (!user) {
        const error = createHttpError(400, "Email or Password does not match");
        next(error);
        return;
      }
      //// match password
      const passwordMatch = await this.credetialservice.comparePassword(
        password,
        user.password,
      );

      if (!passwordMatch) {
        const error = createHttpError(400, "email or password does not match");
        next(error);
        return;
      }

      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
        tenant: user.tenant ? String(user.tenant.id) : "",
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };
      const accesstoken = this.tokenservice.generateAccessToken(payload);

      //persists the refresh data
      const newRefreshtoken = await this.tokenservice.persistRefreshToken(user);

      const refreshToken = this.tokenservice.generateRefreshtoken({
        ...payload,
        id: String(newRefreshtoken.id),
      });

      res.cookie("accessToken", accesstoken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, // 1h
        httpOnly: true, // very impotent
      });
      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true, // very impotent
      });
      // console.log(user.id)
      logger.info("user has been logged in", { id: user.id });
      return res.status(200).json({
        id: user.id,
      });
    } catch (err) {
      next(err);
    }
  }

  async self(req: AuthRequest, res: Response, next: NextFunction) {
    //  console.log(req.auth, "ye hamara aurh hai")
    try {
      const user = await this.userservice.findById(Number(req.auth.sub));
      // token req.auth.id mile ek authetication banayenge
      res.status(200).json({ ...user, password: undefined });
    } catch (err) {
      next(err);
    }
  }

  async refresh(req: AuthRequest, res: Response, next: NextFunction) {
    //  console.log((req as AuthRequest).auth, "authrefresh")
    const payload: JwtPayload = {
      sub: req.auth.sub,
      role: req.auth.role,
      tenant: req.auth.tenant,
      firstName: req.auth.firstName,
      lastName: req.auth.lastName,
      email: req.auth.email,
    };
    try {
      const accesstoken = this.tokenservice.generateAccessToken(payload);

      const user = await this.userservice.findById(Number(req.auth.sub));
      if (!user) {
        next(createHttpError(400, "Error is user not valid"));
      }

      //persists the refresh data
      const newRefreshtoken = await this.tokenservice.persistRefreshToken(user);

      //delete old refresh token yaha is controller me token rotation kar rhe hai
      await this.tokenservice.deleteRefreshToken(Number(req.auth.id));

      const refreshToken = this.tokenservice.generateRefreshtoken({
        ...payload,
        id: String(newRefreshtoken.id),
      });

      res.cookie("accessToken", accesstoken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, // 1h
        httpOnly: true, // very impotent
      });
      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true, // very impotent
      });
      res.status(200).json({ id: user.id });
    } catch (err) {
      next(err);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // isme ek problem isme hame itna krne baad me accesstoken ka data aa rha isliye error aa rhi thi
      //    console.log(req.auth)
      await this.tokenservice.deleteRefreshToken(Number(req.auth.id));
      logger.info("refresh token has been deleted", {
        id: req.auth.id,
      });
      logger.info("refresh token has been deleted", {
        id: req.auth.sub,
      });
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(200).json({});
    } catch (err) {
      next(err);
      return;
    }
  }
}
