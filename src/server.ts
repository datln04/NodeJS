import express, { Application } from "express";
import cors from "cors";
import apiAccountRoutes from "./routes/accountRouter";
import apiSurveyRoutes from "./routes/surveyRouter";
import apiCommunityProgramRoutes from "./routes/communityProgramRouter";
import communityProgramAttendeRouter from "./routes/communityProgramAttendeRouter";
import communityProgramSurveyRouter from "./routes/communityProgramSurveyRouter";
import authRoutes from "./routes/authRouter";
import authorizeRoles from "./middleware/authMiddleware";

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Public Auth Routes (accessible to guests)
app.use("/api/auth", authorizeRoles(["Guest"]), authRoutes);

// TODO: Admin route only
// Protected Account Routes (accessible to member, consultant, admin)
app.use(
  "/api/account",
  authorizeRoles(["Admin"]),
  apiAccountRoutes
);
// Manage social community program
app.use(
  "/api/survey",
  authorizeRoles(["Admin"]),
  apiSurveyRoutes
);

// Manage social community program
app.use(
  "/api/survey",
  authorizeRoles(["Admin"]),
  apiSurveyRoutes
);

// Manage social community program
app.use(
  "/api/community-program",
  authorizeRoles(["Admin", "Member", "Consultant", "Guest"]),
  apiCommunityProgramRoutes
);

// Manage social community program
app.use(
  "/api/community-program-attendee",
  authorizeRoles(["Admin", "Member", "Consultant", "Guest"]),
  communityProgramAttendeRouter
);

// Manage social community program
app.use(
  "/api/community-program-survey",
  authorizeRoles(["Admin"]),
  communityProgramSurveyRouter
);


// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});