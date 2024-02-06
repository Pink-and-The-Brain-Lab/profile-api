import { Router } from "express";
import createProfileRouter from "./create-profile";
import checkPhoneNumberDisponibilityRouter from "./check-phone-number-disponibility";
import checkEmailDisponibilityRouter from "./check-email-disponibility";
const routes = Router();
routes.use('/auth/create-profile', createProfileRouter);
routes.use('/auth/check-phone-number-disponibility', checkPhoneNumberDisponibilityRouter);
routes.use('/auth/check-email-disponibility', checkEmailDisponibilityRouter);
export default routes;

// need to create image upload and save the ima URL in data base
