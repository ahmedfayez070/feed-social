import express from "express";
import { getUser, updateUser, getUsers } from "../controllers/user.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/find/:userId", getUser);
router.put("/", updateUser);

export default router;
