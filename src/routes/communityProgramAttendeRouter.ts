import express, { Router } from "express";
import * as communityProgramAttendeController from "../controller/communityProgramAttendeController";
import authorizeRoles from "../middleware/authMiddleware";

const router: Router = express.Router();

// Get all communityProgramAttendes
router.get("/", authorizeRoles(["Admin"]),communityProgramAttendeController.getAll);

// Get communityProgramAttende by ID
router.get("/:id", authorizeRoles(["Admin"]),communityProgramAttendeController.getById);

// Get toatal account communityProgramAttende by programId
router.get("/total/:id", communityProgramAttendeController.getTotalByProgramId); // get total attendees registered for a specific community program

// Create new communityProgramAttende
router.post("/", authorizeRoles(["Admin"]), communityProgramAttendeController.create);

// Update communityProgramAttende
router.put("/:id", authorizeRoles(["Admin"]), communityProgramAttendeController.update);

// Delete communityProgramAttende
router.delete("/:id", authorizeRoles(["Admin"]), communityProgramAttendeController.remove);

export default router;