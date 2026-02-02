import { NextFunction, Response, Request } from "express";
import { Userservice } from "../service/auth.service";
import { CreateUserRequest, UpdateUserRequest } from "../type";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { logger } from "../config/logger";

export class UserController {
  constructor(private readonly userservice: Userservice) { }
  async create(req: CreateUserRequest, res: Response, next: NextFunction) {
    console.log(req.body, "ye body se check krte kya arha hai");
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg as string));
    }

    const { firstName, lastName, email, password, role, tenantId } = req.body;
    try {
      const users = await this.userservice.create({
        firstName,
        lastName,
        email,
        password,
        role,
        tenantId,
      });

      res.status(201).json({ id: users.id });
    } catch (err) {
      next(err);
    }
  }
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userservice.getAll();
      if (users.length === 0) {
        return next(createHttpError(404, "Users not found"));
      }
      logger.info("All users have been fetched", { count: users.length });
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }
  async getone(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.id;
    if (Number(isNaN(Number(userId)))) {
      next(createHttpError(400, "Invalid url param."));
      return;
    }
    try {
      const users = await this.userservice.findById(Number(userId));
      if (!users) {
        next(createHttpError(400, "User does not exist."));
        return;
      }
      logger.info("User has been fetched", { id: users.id });
      res.status(200).json({ id: users.id, users });
    } catch (err) {
      next(err);
    }
  }
  async update(req: UpdateUserRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const { firstName, lastName, role, email, tenantId } = req.body;
    const userId = req.params.id;
    if (Number(isNaN(Number(userId)))) {
      next(createHttpError(400, "Invalid url param."));
      return;
    }
    logger.debug("Request for updating a user", req.body);
    try {
      await this.userservice.update(Number(userId), {
        firstName,
        lastName,
        role,
        email,
        tenantId,
      });
      logger.info("User has been updated", { id: userId });
      res.json({ id: Number(userId) });
    } catch (err) {
      next(err);
    }
  }
  async destroy(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.id;
    if (Number(isNaN(Number(userId)))) {
      next(createHttpError(400, "Invalid url param."));
      return;
    }
    try {
      await this.userservice.deleteById(Number(userId));
      logger.info("User has been deleted", {
        id: Number(userId),
      });
      res.json({ id: Number(userId) });
    } catch (err) {
      next(err);
    }
  }
}
