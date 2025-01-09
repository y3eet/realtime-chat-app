import jwt, { JsonWebTokenError } from "jsonwebtoken";
import RefreshToken from "../mongodb/models/RefreshToken";
import User from "../mongodb/models/User";
import { CurrentUser } from "../types";

export async function signToken(
  payload: CurrentUser,
  createRefreshToken: boolean = false
) {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1hr",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });
  if (createRefreshToken) {
    await RefreshToken.create({
      token: refreshToken,
      userId: payload.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
  }
  return { accessToken, refreshToken };
}

export async function verifyToken(
  accessToken: string,
  refreshToken: string,
  forceRefresh?: boolean
) {
  try {
    if (forceRefresh) {
      throw new Error("Forcing refresh");
    }
    const payload = jwt.verify(
      accessToken,
      process.env.JWT_SECRET!
    ) as CurrentUser;
    return { payload, type: "access", accessToken, refreshToken };
  } catch (err) {
    try {
      //check if error is expired token
      if (
        err instanceof JsonWebTokenError &&
        err.name !== "TokenExpiredError"
      ) {
        throw err;
      }

      // Check if the refresh token exists in the database
      const existingRefreshToken = await RefreshToken.findOne({
        token: refreshToken,
      });

      if (!existingRefreshToken) {
        throw new Error("Refresh token not found");
      }

      // Check if the refresh token has expired
      if ((existingRefreshToken.expiresAt ?? new Date()) < new Date()) {
        await RefreshToken.deleteOne({ token: refreshToken });
        throw new Error("Refresh token expired");
      }

      // Verify the refresh token
      const refreshPayload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as any;

      // Fetch the user details
      const user = await User.findById(refreshPayload.id);
      if (!user) {
        throw new Error("User not found");
      }

      const currentUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        profileUrl: user.profileUrl,
      };

      // Use the existing `signToken` function to generate new tokens
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await signToken(currentUser);

      const newPayload = jwt.verify(
        newAccessToken,
        process.env.JWT_SECRET!
      ) as CurrentUser;

      return {
        payload: newPayload,
        type: "refresh",
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (err) {
      console.error("Error verifying refresh token", err);
      throw err;
    }
  }
}
