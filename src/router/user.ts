import type { NextFunction, Request, Response } from "express"
import authentication from "../middleware/authentication";
import { canAccess } from "../middleware/canAccess";
import { Role } from "../constrant";
import express from 'express'
import { UserController } from "../controller/user.controller";
import { Userservice } from "../service/auth.service";
import AppDataSource from "../data.source";
import { User } from "../Entity/User.entiry";
import updateUserValidator from "../validator/update-user-validator";
import createValidation from "../validator/createValidation";
const router = express.Router()

const repositry = AppDataSource.getRepository(User)
const userservice = new Userservice(repositry)
const usercontroller = new UserController(userservice)


router.post('/', authentication, canAccess([Role.ADMIN]), createValidation, (req: Request, res: Response, next: NextFunction) => usercontroller.create(req, res, next)
)
router.get('/', authentication, canAccess([Role.ADMIN]), (req: Request, res: Response, next: NextFunction) => usercontroller.getAll(req, res, next)
)

router.get('/:id', authentication, canAccess([Role.ADMIN]), (req: Request, res: Response, next: NextFunction) => usercontroller.getone(req, res, next)
)

router.patch('/:id', authentication, canAccess([Role.ADMIN]), updateUserValidator, (req: Request, res: Response, next: NextFunction) => usercontroller.update(req, res, next))

router.delete('/:id', authentication, canAccess([Role.ADMIN]), (req: Request, res: Response, next: NextFunction) => usercontroller.destroy(req, res, next))

export default router