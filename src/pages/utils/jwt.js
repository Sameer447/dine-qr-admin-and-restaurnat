// @ts-nocheck
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../@core/utils/global";

export const generateVerificationToken = (userData) => {
  const token = jwt.sign({ userData }, process.env.NEXT_PUBLIC_JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};
