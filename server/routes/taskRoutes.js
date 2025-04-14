import express from "express";
import {
  createTask,
  dashboardStatistics,
  deleteTask,
  getTask,
  getTasks,
  updateStage,
  updateTask,
} from "../controllers/taskController.js";
import { protectRoute } from "../middlewares/authMiddlewave.js";

const router = express.Router();
//working
router.post("/create", protectRoute, createTask);
router.get("/", protectRoute, getTasks);
router.put("/update_stage/:id", protectRoute, updateStage);
router.put("/update/:id", protectRoute, updateTask);
router.delete("/delete/:id", protectRoute, deleteTask);
router.get("/dashboard", protectRoute, dashboardStatistics);
router.get("/:id", protectRoute, getTask);

// not working yet

export default router;
