import { Router } from "express";
import User from "../../lib/mongodb/models/User";
import { getCurrentUser } from "../../lib/auth/user";
import Message from "../../lib/mongodb/models/Message";
import { password } from "bun";

const messagesRouter = Router();

messagesRouter.get("/messages", async (req, res) => {
  try {
    const user = await getCurrentUser(req, res);
    const page = 1;
    const messages = await Message.find()
      .select({ __v: 0 })
      .sort({ createdAt: -1 })
      .limit(20)
      .skip(20 * (page - 1));
    const messagesWithUser = await Promise.all(
      messages.reverse().map(async (message) => {
        const user = await User.findById(message.userId).select({
          password: 0,
          email: 0,
          __v: 0,
        });

        return { ...message.toObject(), user };
      })
    );
    res.json(messagesWithUser);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: String(e) });
  }
});
export default messagesRouter;
