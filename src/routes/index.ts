import { Router } from "express";
import createProfileRouter from "./create-profile";
import checkPhoneNumberDisponibilityRouter from "./check-phone-number-disponibility";
const routes = Router();
routes.use('/auth/create-profile', createProfileRouter);
routes.use('/auth/check-phone-number-disponibility', checkPhoneNumberDisponibilityRouter);
export default routes;
