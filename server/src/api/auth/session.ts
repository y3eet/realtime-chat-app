import { Router } from "express";
import { z } from "zod";
import { registerUser, checkIfUserExists, loginUser } from "./functions";
import { getCurrentUser } from "../../lib/auth/user";
const sessionRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, { message: "Password is too short" }),
});

const registerSchema = z.object({
  username: z
    .string()
    .max(20, { message: "Username should only be 20 characters" })
    .min(3, { message: "Username is too short" }),
  email: z.string().email(),
  password: z.string().min(6, { message: "Password is too short" }),
  confirmPassword: z.string().min(6, { message: "Password is too short" }),
});

sessionRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { success, error, data } = loginSchema.safeParse({ email, password });
  try {
    if (success) {
      const login = await loginUser(data);
      if (login.success) {
        const { accessToken, refreshToken } = login;
        res
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          })
          .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          })
          .status(200)
          .json({ success: true });
        return;
      } else {
        res.status(400).json({ success: false, error: login.error });
        return;
      }
    }
    res
      .status(success ? 200 : 400)
      .json({ success, error: error?.flatten().fieldErrors });
  } catch (e) {
    console.error(e);
    res.status(400).json({ success: false, error: String(e) });
  }
});

sessionRouter.post("/register", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(400).json({
      success: false,
      error: {
        confirmPassword: ["Password do not match"],
        password: ["Password do not match"],
      },
    });
    return;
  }

  const { success, error, data } = registerSchema.safeParse({
    username,
    email,
    password,
    confirmPassword,
  });

  if (!success) {
    res.status(400).json({
      success,
      error: error?.flatten().fieldErrors,
    });
    return;
  }

  const userExists = await checkIfUserExists(data.email, data.username);
  if (userExists) {
    res.status(400).json({
      success: false,
      error: userExists,
    });
    return;
  }

  const { accessToken, refreshToken } = await registerUser(data);
  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Adjust sameSite attribute as needed
    })
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .status(200)
    .json({
      success: true,
    });
});

sessionRouter.get("/logout", async (req, res) => {
  await getCurrentUser(req, res);
  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json({ success: true });
});

sessionRouter.get("/me", async (req, res) => {
  try {
    const user = await getCurrentUser(req, res);
    res.status(200).json({ success: true, user });
  } catch (e) {
    res.status(401).json({ success: false, error: String(e) });
  }
});

export default sessionRouter;
