import argon2 from "argon2";

/**
 * Hashes a password using Argon2
 * @param password - The plaintext password to hash
 * @returns The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 17,
    timeCost: 3,
    parallelism: 1,
  });
}

/**
 * Verifies a plaintext password against a hashed password
 * @param hash - The hashed password
 * @param plainPassword - The plaintext password
 * @returns True if the password is valid, false otherwise
 */
export async function verifyPassword(
  hash: string,
  plainPassword: string
): Promise<boolean> {
  return argon2.verify(hash, plainPassword);
}
