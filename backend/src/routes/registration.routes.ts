import {Router} from "express"
import {createRegistration} from "../controllers/registration.controller";

const router = Router();
router.post("/", createRegistration);

export default router;
