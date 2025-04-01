// src/lib/utils.ts
import { hash } from "bcrypt";
import { prisma } from "./db";

export async function createUser(email: string, password: string, name?: string) {
  const hashedPassword = await hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name
    }
  });
}