// @ts-nocheck
import jwt from "jsonwebtoken";

const generateVerificationToken = (userData) => {
  const token = jwt.sign({ userData }, process.env.NEXT_PUBLIC_JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

export default generateVerificationToken;