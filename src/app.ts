import type { Request, Response } from "express";
import express from "express";
import authrouter from './router/auth.router'
import { globalErrorHandler } from "./config/globalhandler";
import cookieParser from 'cookie-parser'
import tenantRoute from './router/tenant.router'
import UserRoute from './router/user'
export const app = express();

app.use(express.json())
app.use(cookieParser())

app.use(

  express.static("public")
)

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "kar" });
});
app.use('/auth', authrouter)
app.use('/tenants', tenantRoute)
app.use('/users',UserRoute)


app.use(globalErrorHandler);



