import { PrismaClient } from "@prisma/client";
import { Request } from "express";

import { decodeAuthHeaders } from "./utils/auth";

export interface Context {
  prisma: PrismaClient;
  userId: number | null;
}

export const prisma = new PrismaClient();

export const context = ({ req }: { req: Request }): Context => {
  const authHeader = req.headers.authorization;
  const token = decodeAuthHeaders(authHeader);

  return {
    prisma,
    userId: token.userId,
  };
};
