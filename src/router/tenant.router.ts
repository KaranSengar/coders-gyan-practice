import  type{ NextFunction, Request, Response } from "express";
import { TenantController } from "../controller/Tenant.controller";
import { TenantService } from "../service/tenant.service";
import AppDataSource from "../data.source";
import { Tenant } from "../Entity/Tenant";
import authentication from "../middleware/authentication";
import { canAccess } from "../middleware/canAccess";
import { Role } from "../constrant";
import tenantValidator from "../validator/tenant-validator";
import express from 'express'
import { CreateTenantRequest } from "../type";
const router = express.Router()
const tenantrepo = AppDataSource.getRepository(Tenant)
const tenantservice = new TenantService(tenantrepo)
const tenantcontroller = new TenantController(tenantservice)
router.post('/',authentication,canAccess([Role.ADMIN]), (req: Request, res: Response, next: NextFunction) => tenantcontroller.create(req, res, next)
)
router.get("/", (req:Request, res:Response, next:NextFunction) => tenantcontroller.getAll(req, res, next));

router.patch(
    "/:id",
    authentication,
    canAccess([Role.ADMIN]),
    tenantValidator,
    (req: CreateTenantRequest, res: Response, next: NextFunction) =>
        tenantcontroller.update(req, res, next),
);
router.get("/:id", (req:Request, res:Response, next:NextFunction) => tenantcontroller.getOne(req, res, next));
router.delete(
    "/:id",
    authentication,
    canAccess([Role.ADMIN]),
    (req:Request, res:Response, next:NextFunction) => tenantcontroller.destroy(req, res, next),
);









export default router