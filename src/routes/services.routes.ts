import {Router} from "express"
import {createServices} from "../controllers/services.controller";

const router = Router();
router.post("/", createServices);


export default router;
