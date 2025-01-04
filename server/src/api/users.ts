import { Router } from "express";
import User from "../lib/mongodb/models/User";

const usersRouter = Router();

usersRouter.get("/", async (req, res) => {
  const users = await User.find();
  const usersData = users.map((user) => {
    return {
      id: user.username,
      username: user.username,
      email: user.email,
      profileUrl: user.profileUrl,
      status: "offline",
    };
  });
  res.json(usersData);
});

export default usersRouter;
