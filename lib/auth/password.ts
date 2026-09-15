import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 12;
const TIMING_DUMMY_HASH = "$2b$10$1SbzvLHmlNqs64JjnZcfh.sE/ocXdebT0CEj6yJczxwXgF.h1yK2i";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, passwordHash: string | null | undefined): Promise<boolean> {
  return bcrypt.compare(password, passwordHash && passwordHash.length > 0 ? passwordHash : TIMING_DUMMY_HASH);
}
