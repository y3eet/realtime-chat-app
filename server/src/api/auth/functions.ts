import User from "../../lib/mongodb/models/User";
import { hashPassword, verifyPassword } from "../../lib/auth/password";
import { signToken } from "../../lib/auth/jwt";

export async function checkIfUserExists(email: string, username: string) {
  const emailExists = await User.exists({ email });
  const usernameExists = await User.exists({ username });
  if (emailExists) {
    return {
      email: ["Email already exists"],
    };
  }
  if (usernameExists) {
    return {
      username: ["Username already exists"],
    };
  }
}

export async function registerUser(data: {
  email: string;
  password: string;
  username: string;
  profileUrl?: string;
}) {
  const user = await User.create({
    email: data.email,
    password: await hashPassword(data.password),
    username: data.username,
  });

  // set cookie
  const token = signToken(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      profileUrl: user?.profileUrl,
    },
    true
  );
  return token;
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<
  | { success: true; accessToken: string; refreshToken: string }
  | { success: false; error: { email?: string[]; password?: string[] } }
> {
  const user = await User.findOne({ email: data.email });
  if (!user) {
    return {
      success: false,
      error: {
        email: ["User not found"],
      },
    };
  }
  const isValid = await verifyPassword(user.password, data.password);
  if (!isValid) {
    return {
      success: false,
      error: {
        password: ["Invalid password"],
      },
    };
  }
  const token = await signToken(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      profileUrl: user?.profileUrl,
    },
    true
  );
  return { success: true, ...token };
}
