import express, { Router } from "express";
import * as communityProgramAttendeController from "../controller/communityProgramAttendeController";
import authorizeRoles from "../middleware/authMiddleware";

const router: Router = express.Router();

// Get all communityProgramAttendes
router.get("/", communityProgramAttendeController.getAll); // list all attendees are registered for community programs

// Get communityProgramAttende by ID
router.get("/:id", communityProgramAttendeController.getById); // Get attendee by ProgramID & AccountID

// Create new communityProgramAttende
router.post("/", authorizeRoles(["Admin"]), communityProgramAttendeController.create);

// Update communityProgramAttende
router.put("/:id", authorizeRoles(["Admin"]), communityProgramAttendeController.update);

// Delete communityProgramAttende
router.delete("/:id", authorizeRoles(["Admin"]), communityProgramAttendeController.remove);

export default router;