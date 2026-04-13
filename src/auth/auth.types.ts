export type RequestUser = {
  userId?: string;
  firebaseUid: string;
  role: 'USER' | 'ADMIN';
  email?: string;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}
