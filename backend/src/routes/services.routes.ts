import {Router} from "express"
import {createServices, deleteService} from "../controllers/services.controller";

const router = Router();
router.post("/", createServices);
router.delete('/:id', deleteService);

export default router;
