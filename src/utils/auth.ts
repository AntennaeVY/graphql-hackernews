import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";

export interface AuthTokenPayload {
  userId: number | null;
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export function decodeAuthHeaders(authHeader?: string): AuthTokenPayload {
  const token = authHeader?.replace("Bearer", "") || "";

  try {
    const decodedToken = decodeToken(token);

    return decodedToken as AuthTokenPayload;
  } catch (err) {
    return { userId: null };
  }
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(hash: string, password: string): boolean {
  return bcrypt.compareSync(hash, password);
}

export function createToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET);
}

export function decodeToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
