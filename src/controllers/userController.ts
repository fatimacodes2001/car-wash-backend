// controllers/userController.ts
import { Request, Response } from "express";
import { createUser, loginUser } from "../services/userService";

export const register = async (req: Request, res: Response) => {
  const { email, password, role, locationId } = req.body;
  try {
    const user = await createUser(email, password, role, locationId);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const { token, user } = await loginUser(email, password);
    res.json({ token, user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
