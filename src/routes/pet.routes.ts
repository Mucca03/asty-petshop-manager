import {Router} from "express"
import {createPet} from "../controllers/pet.controller";

const router = Router();
router.post("/", createPet);


export default router;
