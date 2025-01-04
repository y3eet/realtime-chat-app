export type User = {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  lastSignInAt?: Date;
  profileUrl?: string;
};

export type CurrentUser = {
  id: string;
  email: string;
  username: string;
  profileUrl?: string;
  iat?: number;
  exp?: number;
};

export type DeviceDetails = {
  deviceId: string;
  deviceName: string;
  userAgent: string;
  ip: string;
  platform: string;
  isMobile: boolean;
};

export type ConnectedUser = {
  status: "online" | "offline";
  userId: string;
  username: string;
  profileUrl?: string;
};
