import express, { Router } from "express";
import * as surveyController from "../controller/surveyController";

const router: Router = express.Router();

// Get all surveys
router.get("/", surveyController.getAll);

// Get survey by ID
router.get("/:id", surveyController.getById);

// Get survey by CateID
router.get("/cate/:id", surveyController.getByCategoryId);

// Create new survey
router.post("/", surveyController.create);

// Update survey
router.put("/:id", surveyController.update);

// Delete survey
router.delete("/:id", surveyController.remove);

export default router;