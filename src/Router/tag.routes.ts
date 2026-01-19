import express from "express";
import { getAllTags, createTag } from "../Controller/tag.controller";
import { protect } from "../Middleware/auth.middleware";

const router = express.Router();

router.use(protect);

router.route("/").get(getAllTags).post(createTag);

export default router;
