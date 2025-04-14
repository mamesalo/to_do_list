import User from "../models/user.js";
import { createJWT } from "../utils/index.js";
import { sendEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        status: false,
        message: "email already exists",
      });
    }
    const user = await User.create({
      name,
      email,
      password,
      verificationSentAt: new Date(),
    });
    const token = createJWT(user._id);
    const url = `${process.env.FRONTEND_URL}/verify/${token}`;
    await sendEmail(user.email, "Verify your email address", url);
    res.status(200).json({ message: "Verification link sent to your email" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Please fill all fields",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password." });
    }

    if (!user.isVerified) {
      const now = new Date();
      const lastSent = user.verificationSentAt;
      if (!lastSent || now - lastSent > 60 * 60 * 1000) {
        const token = createJWT(user._id);
        const url = `${process.env.FRONTEND_URL}/verify/${token}`;
        await sendEmail(user.email, "Verify your email address", url);

        user.verificationSentAt = now;
        await user.save();
        return res.status(400).json({
          message: "A new verification email has been sent to your email.",
        });
      }
      return res
        .status(400)
        .json({ message: "Please verify your email before logging in." });
    }

    const isMatch = await user.matchPassword(password);

    if (user && isMatch) {
      const token = createJWT(user._id);
      user.password = undefined;

      res.status(200).json({ token, user });
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
export const changeUserPassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { old_password, password } = req.body;

    if (!old_password || !password) {
      return res.status(400).json({
        status: false,
        message: "Please fill all fields",
      });
    }

    const user = await User.findById(userId);

    if (user) {
      const isMatch = await user.matchPassword(old_password);

      if (isMatch) {
        user.password = password;
        await user.save();
        res.status(201).json({
          status: true,
          message: `Password chnaged successfully.`,
        });
      } else {
        return res
          .status(401)
          .json({ status: false, message: "password is not correct" });
      }
    } else {
      res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
export const verfiyUserEmail = async (req, res) => {
  try {
    const decodedToken = jwt.verify(req.params.token, process.env.JWT_SECRET);

    const user = await User.findByIdAndUpdate(decodedToken.userId, {
      isVerified: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .send({ message: "✅ Email verified successfully! You can now log in." });
  } catch (error) {
    console.log(error);

    res.status(500).send({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        status: false,
        message: "Please fill all fields",
      });
    }
    const user = await User.findById(userId);

    if (user) {
      user.name = name ? req.body.name : user.name;
      const updatedUser = await user.save();

      res.status(201).json({
        status: true,
        message: "Profile Updated Successfully.",
      });
    } else {
      res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Please fill all fields",
      });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "email not exists",
      });
    }

    const token = createJWT(user._id);
    const url = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendEmail(user.email, "Reset your password", url);
    res.status(200).json({ message: "Reset password link sent to your email" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.userId;
    if (!password) {
      return res.status(400).json({
        status: false,
        message: "Please fill all fields",
      });
    }
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "user not exists",
      });
    }
    user.password = password;
    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res
      .status(200)
      .json({ status: true, message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
