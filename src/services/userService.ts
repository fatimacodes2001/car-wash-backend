import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET, SALT_ROUNDS } from "../config";

import prisma from "../../prisma/client";

export const createUser = async (
  email: string,
  password: string,
  role: "ADMIN" | "MANAGER",
  locationId?: number
) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
    },
  });

  if (role === "MANAGER" && locationId) {
    await prisma.manager.create({
      data: {
        userId: user.id,
        locationId,
      },
    });
  }

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { manager: true },
  });
  if (!user) throw new Error("User not found");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Invalid password");

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET!, {
    expiresIn: "1h",
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      manager: user.manager || null,
    },
  };
};
