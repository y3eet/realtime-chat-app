export type User = {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  lastSignInAt?: Date;
  profileUrl?: string;
};

export type UserPayload = {
  email: string;
  username: string;
  profileUrl?: string;
};

export type Message = {
  _id: string;
  createdAt: Date;
  message: string;
  type: string;
  user: UserPayload;
};

export type ConnectedUser = {
  status: "online" | "offline";
  userId: string;
  username: string;
  profileUrl?: string;
};
