import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import connectPg from "connect-pg-simple";
import { sendPasswordResetEmail, sendPasswordChangeConfirmation } from "./emailService";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return { isValid: errors.length === 0, errors };
}

async function hashPassword(password: string) {
  const salt = randomBytes(32).toString("hex"); // Increased salt size
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export async function setupAuth(app: Express) {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'heating-oil-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: sessionTtl,
    },
    name: 'niho_session', // Custom session name for security
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: 'Invalid username or password' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, password, email, fullName, phone, savedQuote } = req.body;

      // Enhanced validation
      if (!username || !password || !email) {
        return res.status(400).json({ 
          message: "Username, password, and email are required",
          field: "missing_required"
        });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          message: "Please enter a valid email address",
          field: "email"
        });
      }

      // Password strength validation
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({ 
          message: "Password does not meet security requirements",
          errors: passwordValidation.errors,
          field: "password"
        });
      }

      // Check for existing user by username or email
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ 
          message: "An account with this username already exists",
          field: "username"
        });
      }

      const existingEmail = await storage.getUserByEmail?.(email);
      if (existingEmail) {
        return res.status(400).json({ 
          message: "An account with this email already exists",
          field: "email"
        });
      }

      // Create user with all provided fields
      const user = await storage.createUser({
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        username,
        email,
        fullName,
        phone,
        password: await hashPassword(password),
      });

      // Save the quote if provided
      if (savedQuote && typeof savedQuote === 'object') {
        try {
          await storage.createSavedQuote({
            userId: user.id,
            supplierName: savedQuote.supplierName || '',
            price: savedQuote.price || '',
            volume: savedQuote.volume || 0,
            location: savedQuote.location || '',
            postcode: savedQuote.postcode || '',
            customerName: savedQuote.customerName || fullName || '',
            customerEmail: savedQuote.customerEmail || email || '',
            customerPhone: savedQuote.customerPhone || phone || '',
          });
        } catch (quoteError) {
          console.error("Error saving quote during registration:", quoteError);
          // Continue with registration even if quote saving fails
        }
      }

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({ 
          id: user.id, 
          username: user.username, 
          email: user.email,
          fullName: user.fullName,
          phone: user.phone
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Import rate limiting
  const rateLimit = await import('./rateLimit.js');
  const { authRateLimit } = rateLimit;

  app.post("/api/login", authRateLimit, passport.authenticate("local"), (req, res) => {
    const user = req.user as SelectUser;
    res.status(200).json({ 
      id: user.id, 
      username: user.username, 
      email: user.email,
      message: 'Login successful'
    });
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = req.user as SelectUser;
    res.json({ id: user.id, username: user.username, email: user.email });
  });

  // Password reset request
  app.post("/api/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists or not for security
        return res.json({ message: "If an account with that email exists, you'll receive a password reset link." });
      }

      // Generate secure reset token
      const resetToken = randomBytes(32).toString("hex");
      const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store reset token in database
      await storage.createPasswordResetToken(user.id, resetToken, resetExpiry);

      // Send reset email
      try {
        await sendPasswordResetEmail(user.email, user.username, resetToken);
        console.log(`Password reset email sent to ${user.email}`);
      } catch (emailError) {
        console.error("Failed to send password reset email:", emailError);
        return res.status(500).json({ message: "Failed to send reset email" });
      }

      res.json({ message: "If an account with that email exists, you'll receive a password reset link." });
    } catch (error) {
      console.error("Password reset request error:", error);
      res.status(500).json({ message: "Failed to process password reset request" });
    }
  });

  // Password reset confirmation
  app.post("/api/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
      }

      // Validate password strength
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        return res.status(400).json({ 
          message: "Password does not meet security requirements",
          errors: passwordValidation.errors 
        });
      }

      // Verify reset token
      const resetRequest = await storage.getPasswordResetToken(token);
      if (!resetRequest || resetRequest.expiresAt < new Date()) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      // Update password
      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUserPassword(resetRequest.userId, hashedPassword);

      // Delete used token
      await storage.deletePasswordResetToken(token);

      // Get user for confirmation email
      const user = await storage.getUser(resetRequest.userId);
      if (user) {
        try {
          await sendPasswordChangeConfirmation(user.email, user.username);
        } catch (emailError) {
          console.error("Failed to send password change confirmation:", emailError);
        }
      }

      res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // Change password (for logged-in users)
  app.post("/api/change-password", isAuthenticated, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = req.user as SelectUser;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }

      // Verify current password
      const storedUser = await storage.getUser(user.id);
      if (!storedUser || !(await comparePasswords(currentPassword, storedUser.password))) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Validate new password strength
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        return res.status(400).json({ 
          message: "New password does not meet security requirements",
          errors: passwordValidation.errors 
        });
      }

      // Update password
      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUserPassword(user.id, hashedPassword);

      // Send confirmation email
      try {
        await sendPasswordChangeConfirmation(user.email, user.username);
      } catch (emailError) {
        console.error("Failed to send password change confirmation:", emailError);
      }

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });
}

export function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}