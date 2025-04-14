import jwt from "jsonwebtoken";

export const createJWT = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

  // Change sameSite from strict to none when you deploy your app
};
