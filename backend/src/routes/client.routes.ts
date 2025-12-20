import {Router} from "express"
import {createClient, getClients, getClientsId/*putClients*/} from "../controllers/client.controller";

const router = Router();
router.post("/", createClient);
router.get("/", getClients);

//id
router.get("/:id", getClientsId);

export default router;
