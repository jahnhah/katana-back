import { createUserHandler, getCurrentUserHandler, passwordRecoveryHandler, passwordResetHandler, verifyUserHandler } from '../controllers/user.controller';
import express from 'express'
import validateResource from '../middlewares/validateResource'
import { createUserSchema, passwordRecoverySchema, passwordResetSchema, verifyUserSchema } from '../schema/user.schema'
import { requireUser } from '../middlewares/requireUser.middleware';
const router = express.Router()

router.post("/create_account", validateResource(createUserSchema), createUserHandler);
router.get("/verify_account", validateResource(verifyUserSchema), verifyUserHandler);
router.post("/password_recovery", validateResource(passwordRecoverySchema), passwordRecoveryHandler);
router.post("/password_reset/:id/:passwordResetCode", validateResource(passwordResetSchema), passwordResetHandler);
router.get("/me",requireUser,getCurrentUserHandler);
export default router;