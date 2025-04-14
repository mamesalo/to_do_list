import express from "express";
import { isAdminRoute, protectRoute } from "../middlewares/authMiddlewave.js";
import {
  changeUserPassword,
  deleteUserProfile,
  loginUser,
  verfiyUserEmail,
  registerUser,
  updateUserProfile,
  forgetPassword,
  resetPassword,
} from "../controllers/userController.js";

const router = express.Router();

//working
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify/:token", verfiyUserEmail);
router.put("/change-password", protectRoute, changeUserPassword);
router.put("/update-profile", protectRoute, updateUserProfile);
router.post("/forget-password", forgetPassword);
router.put("/reset-password", protectRoute, resetPassword);

// not working yet

// //   FOR ADMIN ONLY - ADMIN ROUTES
router.route("/:id").delete(protectRoute, isAdminRoute, deleteUserProfile);

export default router;
