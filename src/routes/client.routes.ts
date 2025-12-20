import {Router} from "express"
import {createClient, getClients, /*putClients*/} from "../controllers/client.controller";

const router = Router();
router.post("/", createClient);
router.get("/", getClients);
//router.get("/", putClients);

export default router;
