import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { UserRequest } from "../types";

interface JwtPayloadExtended extends JwtPayload {
  id: number;
  role: string;
}

export const authenticate = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).send("Access Denied");
  }

  try {
    const verified = jwt.verify(
      token.split(" ")[1],
      JWT_SECRET
    ) as JwtPayloadExtended;
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};
