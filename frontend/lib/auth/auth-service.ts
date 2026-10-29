import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { getDb, isDatabaseConfigured } from "@/lib/db/neon";
import { initAuthSchema, DbUser, DbSession, SafeUser } from "@/lib/db/schema";

export const SESSION_COOKIE_NAME = "visioncare_session";

// In-memory fallback stores for development/offline test execution
const memoryUsers = new Map<string, DbUser>();
const memorySessions = new Map<string, DbSession>();

export function resetMemoryAuthStore(): void {
  memoryUsers.clear();
  memorySessions.clear();
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validatePassword(password: string): { isValid: boolean; message?: string } {
  if (!password || password.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters long." };
  }
  if (password.length > 128) {
    return { isValid: false, message: "Password cannot exceed 128 characters." };
  }
  return { isValid: true };
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function toSafeUser(dbUser: DbUser): SafeUser {
  return {
    id: dbUser.id,
    displayName: dbUser.display_name,
    email: dbUser.email,
    createdAt: dbUser.created_at,
  };
}

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const normalized = normalizeEmail(email);

  if (isDatabaseConfigured()) {
    await initAuthSchema();
    const sql = getDb();
    if (sql) {
      const rows = (await sql`
        SELECT id, display_name, email, password_hash, created_at, status
        FROM users
        WHERE LOWER(email) = LOWER(${normalized})
        LIMIT 1
      `) as DbUser[];
      return rows[0] || null;
    }
  }

  // Fallback to in-memory store
  for (const user of memoryUsers.values()) {
    if (user.email.toLowerCase() === normalized) {
      return user;
    }
  }
  return null;
}

export async function findUserById(id: string): Promise<DbUser | null> {
  if (isDatabaseConfigured()) {
    await initAuthSchema();
    const sql = getDb();
    if (sql) {
      const rows = (await sql`
        SELECT id, display_name, email, password_hash, created_at, status
        FROM users
        WHERE id = ${id}
        LIMIT 1
      `) as DbUser[];
      return rows[0] || null;
    }
  }

  return memoryUsers.get(id) || null;
}

export interface RegisterInput {
  displayName: string;
  email: string;
  password: string;
}

export interface AuthResult {
  user: SafeUser;
  sessionToken: string;
  expiresAt: Date;
}

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const displayName = input.displayName.trim();
  if (displayName.length < 2) {
    throw new Error("Display name must be at least 2 characters long.");
  }
  if (displayName.length > 100) {
    throw new Error("Display name cannot exceed 100 characters.");
  }

  const email = normalizeEmail(input.email);
  if (email.length > 255) {
    throw new Error("Email address cannot exceed 255 characters.");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Please provide a valid email address.");
  }

  const passwordCheck = validatePassword(input.password);
  if (!passwordCheck.isValid) {
    throw new Error(passwordCheck.message);
  }

  // Check uniqueness
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error("An account with this email address already exists.");
  }

  const passwordHash = await hashPassword(input.password);
  const userId = `usr_${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  const newUser: DbUser = {
    id: userId,
    display_name: displayName,
    email,
    password_hash: passwordHash,
    created_at: now,
    status: "active",
  };

  if (isDatabaseConfigured()) {
    await initAuthSchema();
    const sql = getDb();
    if (sql) {
      await sql`
        INSERT INTO users (id, display_name, email, password_hash, created_at, status)
        VALUES (${newUser.id}, ${newUser.display_name}, ${newUser.email}, ${newUser.password_hash}, ${newUser.created_at}, ${newUser.status})
      `;
    }
  } else {
    memoryUsers.set(newUser.id, newUser);
  }

  // Create active session
  const session = await createSession(userId);

  return {
    user: toSafeUser(newUser),
    sessionToken: session.token,
    expiresAt: session.expiresAt,
  };
}

export interface LoginInput {
  email: string;
  password: string;
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const email = normalizeEmail(input.email);
  const user = await findUserByEmail(email);

  if (!user) {
    // Constant-time dummy check to prevent timing attack enumeration
    await bcrypt.compare("dummy_password", "$2a$10$e8w.b0Jk7s0qT57R.O1xNu92i.d8yE6U.g02w2G8hZl4xG2V.y8Wy");
    throw new Error("Invalid email or password.");
  }

  if (user.status !== "active") {
    throw new Error("Account is suspended or deactivated.");
  }

  const isValidPassword = await verifyPassword(input.password, user.password_hash);
  if (!isValidPassword) {
    throw new Error("Invalid email or password.");
  }

  const session = await createSession(user.id);

  return {
    user: toSafeUser(user),
    sessionToken: session.token,
    expiresAt: session.expiresAt,
  };
}

export async function createSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = `sess_${crypto.randomBytes(32).toString("hex")}`;
  // 30 days expiration
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const now = new Date().toISOString();

  const newSession: DbSession = {
    id: token,
    user_id: userId,
    created_at: now,
    expires_at: expiresAt.toISOString(),
    revoked_at: null,
  };

  if (isDatabaseConfigured()) {
    await initAuthSchema();
    const sql = getDb();
    if (sql) {
      await sql`
        INSERT INTO sessions (id, user_id, created_at, expires_at, revoked_at)
        VALUES (${newSession.id}, ${newSession.user_id}, ${newSession.created_at}, ${newSession.expires_at}, NULL)
      `;
    }
  } else {
    memorySessions.set(token, newSession);
  }

  return { token, expiresAt };
}

export async function validateSession(token: string): Promise<SafeUser | null> {
  if (!token || !token.startsWith("sess_")) {
    return null;
  }

  if (isDatabaseConfigured()) {
    try {
      await initAuthSchema();
      const sql = getDb();
      if (sql) {
        const rows = (await sql`
          SELECT u.id, u.display_name, u.email, u.password_hash, u.created_at, u.status
          FROM sessions s
          JOIN users u ON s.user_id = u.id
          WHERE s.id = ${token}
            AND s.revoked_at IS NULL
            AND s.expires_at > NOW()
            AND u.status = 'active'
          LIMIT 1
        `) as DbUser[];

        if (rows[0]) {
          return toSafeUser(rows[0]);
        }
        return null;
      }
    } catch (err) {
      console.error("[VisionCare Auth] Session validation error:", err);
      return null;
    }
  }

  // Memory fallback
  const session = memorySessions.get(token);
  if (!session || session.revoked_at) {
    return null;
  }

  const expiresDate = new Date(session.expires_at);
  if (expiresDate <= new Date()) {
    return null;
  }

  const user = memoryUsers.get(session.user_id);
  if (!user || user.status !== "active") {
    return null;
  }

  return toSafeUser(user);
}

export async function revokeSession(token: string): Promise<void> {
  if (!token) return;

  if (isDatabaseConfigured()) {
    await initAuthSchema();
    const sql = getDb();
    if (sql) {
      await sql`
        UPDATE sessions
        SET revoked_at = NOW()
        WHERE id = ${token}
      `;
    }
  }

  const memSession = memorySessions.get(token);
  if (memSession) {
    memSession.revoked_at = new Date().toISOString();
  }
}

export async function updateUserProfile(
  userId: string,
  updates: { displayName: string }
): Promise<SafeUser> {
  const displayName = updates.displayName.trim();
  if (displayName.length < 2) {
    throw new Error("Display name must be at least 2 characters long.");
  }
  if (displayName.length > 100) {
    throw new Error("Display name cannot exceed 100 characters.");
  }

  if (isDatabaseConfigured()) {
    await initAuthSchema();
    const sql = getDb();
    if (sql) {
      const rows = (await sql`
        UPDATE users
        SET display_name = ${displayName}
        WHERE id = ${userId}
        RETURNING id, display_name, email, password_hash, created_at, status
      `) as DbUser[];

      if (!rows[0]) {
        throw new Error("User account not found.");
      }
      return toSafeUser(rows[0]);
    }
  }

  const memUser = memoryUsers.get(userId);
  if (!memUser) {
    throw new Error("User account not found.");
  }

  memUser.display_name = displayName;
  return toSafeUser(memUser);
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  currentSessionToken?: string;
}

export async function changeUserPassword(
  userId: string,
  input: ChangePasswordInput
): Promise<void> {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User account not found.");
  }

  const isCurrentValid = await verifyPassword(input.currentPassword, user.password_hash);
  if (!isCurrentValid) {
    throw new Error("Current password is incorrect.");
  }

  const passwordCheck = validatePassword(input.newPassword);
  if (!passwordCheck.isValid) {
    throw new Error(passwordCheck.message);
  }

  const newHash = await hashPassword(input.newPassword);

  if (isDatabaseConfigured()) {
    await initAuthSchema();
    const sql = getDb();
    if (sql) {
      await sql`
        UPDATE users
        SET password_hash = ${newHash}
        WHERE id = ${userId}
      `;

      // Invalidate other sessions for security if token provided
      if (input.currentSessionToken) {
        await sql`
          UPDATE sessions
          SET revoked_at = NOW()
          WHERE user_id = ${userId} AND id != ${input.currentSessionToken}
        `;
      }
    }
  }

  // Memory fallback
  const memUser = memoryUsers.get(userId);
  if (memUser) {
    memUser.password_hash = newHash;
  }

  if (input.currentSessionToken) {
    for (const [sessId, sess] of memorySessions.entries()) {
      if (sess.user_id === userId && sessId !== input.currentSessionToken) {
        sess.revoked_at = new Date().toISOString();
      }
    }
  }
}
