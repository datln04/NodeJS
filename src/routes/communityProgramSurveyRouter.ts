import express, { Router } from "express";
import * as communityProgramSurveyController from "../controller/communityProgramSurveyController";

const router: Router = express.Router();

// Get all communityProgramSurveys
router.get("/", communityProgramSurveyController.getAll);

// Create new communityProgramSurvey
router.post("/", communityProgramSurveyController.create);

// Delete communityProgramSurvey
router.delete("/:id", communityProgramSurveyController.remove);

export default router;