import { Router } from "express";
import createProfileRouter from "./create-profile";
const routes = Router();
routes.use('/auth/create-profile', createProfileRouter);
export default routes;
