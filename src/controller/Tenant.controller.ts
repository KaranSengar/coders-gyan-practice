import { NextFunction, Response } from "express";
import { TenantService } from "../service/tenant.service";
import { CreateTenantRequest } from "../type";
import { logger } from "../config/logger";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

export class TenantController {
  constructor(private readonly tenantservie: TenantService) { }
  async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
    // Validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { name, address } = req.body;
    logger.debug("Request for creating a tenant", req.body);

    try {
      const tenant = await this.tenantservie.create({ name, address });
      logger.info("Tenant has been created", { id: tenant.id });

      res.status(201).json({ id: tenant.id });
    } catch (err) {
      next(err);
    }
  }

  async update(req: CreateTenantRequest, res: Response, next: NextFunction) {
    // Validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const { name, address } = req.body;
    const tenantId = req.params.id;

    if (Number.isNaN(Number(tenantId))) {
      next(createHttpError(400, "Invalid url param."));
      return;
    }

    logger.debug("Request for updating a tenant", req.body);

    try {
      await this.tenantservie.update(Number(tenantId), {
        name,
        address,
      });

      logger.info("Tenant has been updated", { id: tenantId });

      res.json({ id: Number(tenantId) });
    } catch (err) {
      next(err);
    }
  }
  async getAll(req: CreateTenantRequest, res: Response, next: NextFunction) {
    try {
      const tenants = await this.tenantservie.getAll();

      logger.info("All tenant have been fetched");
      res.json(tenants);
    } catch (err) {
      next(err);
    }
  }
  async getOne(req: CreateTenantRequest, res: Response, next: NextFunction) {
    const tenantId = req.params.id;

    if (Number.isNaN(Number(tenantId))) {
      next(createHttpError(400, "Invalid url param."));
      return;
    }

    try {
      const tenant = await this.tenantservie.getById(Number(tenantId));

      if (!tenant) {
        next(createHttpError(400, "Tenant does not exist."));
        return;
      }

      logger.info("Tenant has been fetched");
      res.json(tenant);
    } catch (err) {
      next(err);
    }
  }

  async destroy(req: CreateTenantRequest, res: Response, next: NextFunction) {
    const tenantId = req.params.id;

    if (Number.isNaN(Number(tenantId))) {
      next(createHttpError(400, "Invalid url param."));
      return;
    }

    try {
      await this.tenantservie.deleteById(Number(tenantId));

      logger.info("Tenant has been deleted", {
        id: Number(tenantId),
      });
      res.json({ id: Number(tenantId) });
    } catch (err) {
      next(err);
    }
  }
}
