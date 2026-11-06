import {Router} from "express"
import {createServices, deleteService, updateServiceStatus} from "../controllers/services.controller";

const router = Router();
router.post("/", createServices);
router.patch('/:id/status', updateServiceStatus);
router.delete('/:id', deleteService);

export default router;
