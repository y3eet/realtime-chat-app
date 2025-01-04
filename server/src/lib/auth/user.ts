import { CurrentUser } from "../types";
import { verifyToken } from "./jwt";
import { Request, Response } from "express";

export async function getCurrentUser(req: Request, res: Response) {
  const cookies = req.cookies;
  const accessToken = cookies?.accessToken;
  const refreshToken = cookies?.refreshToken;

  if (!accessToken || !refreshToken) {
    throw new Error("No tokens found");
  }
  const verifyData = await verifyToken(accessToken, refreshToken);
  if (!verifyData) {
    throw new Error("Invalid token");
  }
  if (verifyData.type === "refresh") {
    console.log("Setting new cookies");
    res.cookie("accessToken", verifyData.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }
  return verifyData.payload as CurrentUser;
}
