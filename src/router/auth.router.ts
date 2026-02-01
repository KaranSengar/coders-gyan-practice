import type { NextFunction, Request, Response } from 'express';
import { AuthController } from '../controller/auth.controller';
import express from 'express'
import { Userservice } from '../service/auth.service';
import AppDataSource from '../data.source';
import { User } from '../Entity/User.entiry';
import registerValidator from '../validator/registerValidator';
import { TokenService } from '../service/tokenService';
import { RefreshToken } from '../Entity/RefreshToken';
import loginValidator from '../validator/loginValidation';
import { CredetialsService } from '../service/credentialservice';
import authentication from '../middleware/authentication';
import { AuthRequest } from '../type';
import Validaterefreshtoken from '../middleware/Validaterefreshtoken';
import parserRefreshToken from '../middleware/parserRefreshToken';

const router = express.Router();
const userrepo = AppDataSource.getRepository(User)
const userservice = new Userservice(userrepo)
const userrefreshrepo = AppDataSource.getRepository(RefreshToken)
const tokenservice = new TokenService(userrefreshrepo)
const credentialservice = new CredetialsService()
const authcontroller = new AuthController(userservice, tokenservice, credentialservice)

router.post('/register', registerValidator, async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.body, "route reqcheck")
    await authcontroller.register(req, res, next)
})

router.post('/login', loginValidator, async (req: Request, res: Response, next: NextFunction) => {
    await authcontroller.login(req, res, next)
})

router.get('/self', authentication, async (req: AuthRequest, res: Response, next: NextFunction) => {
    await authcontroller.self(req, res, next)
    //console.log(req, "ye self ka console ja")
})

router.post('/refresh', Validaterefreshtoken, async (req: Request, res: Response, next: NextFunction) => {
    await authcontroller.refresh(req as AuthRequest, res, next)
})

router.post('/logout', authentication, parserRefreshToken, async (req: Request, res: Response, next: NextFunction) => {
    await authcontroller.logout(req as AuthRequest, res, next)
})





export default router