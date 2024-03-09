import { Router } from "express";
import createProfileRouter from "./create-profile";
import checkPhoneNumberDisponibilityRouter from "./check-phone-number-disponibility";
import checkEmailDisponibilityRouter from "./check-email-disponibility";
import setPhoneNumberRouter from "./set-phone-number";
import updateProfileRouter from "./update-profile";
import validationTokenRouter from "./validation-token-router.routes";
import getProfilesRouter from "./get-profiles";
import getProfileAvatarRouter from "./get-profile-avatar";
import selectProfileRouter from "./select-profile";
const routes = Router();
routes.use('/auth/create-profile', createProfileRouter);
routes.use('/auth/check-phone-number-disponibility', checkPhoneNumberDisponibilityRouter);
routes.use('/auth/set-phone-number', setPhoneNumberRouter);
routes.use('/auth/check-email-disponibility', checkEmailDisponibilityRouter);
routes.use('/auth/update-profile', updateProfileRouter);
routes.use('/auth/token-validation', validationTokenRouter);
routes.use('/auth/profiles', getProfilesRouter);
routes.use('/auth/select-profile', selectProfileRouter);
routes.use('/profile-avatar', getProfileAvatarRouter);
export default routes;
