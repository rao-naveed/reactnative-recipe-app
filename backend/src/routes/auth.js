import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import { usersTable } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { ENV } from "../config/env.js";
import { sendVerificationEmail } from "../config/mailer.js";

const router = express.Router();
const JWT_SECRET = ENV.JWT_SECRET || "supersecret";

const createVerificationCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const createToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

// ==========================
// SIGN UP
// ==========================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required." });
    }

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser.length > 0) {
      return res.status(409).json({
        error: "Email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = createVerificationCode();

    // DEVELOPMENT MODE
    // User automatically verified
    const [newUser] = await db
      .insert(usersTable)
      .values({
        name,
        email,
        password: hashedPassword,
        verificationCode: null,
        isVerified: true,
        verifiedAt: new Date(),
      })
      .returning();

    // Try sending email but DON'T fail signup
    try {
      await sendVerificationEmail(newUser.email, verificationCode);
      console.log("Verification email sent.");
    } catch (emailError) {
      console.error("Verification email failed:", emailError);
    }

    return res.status(201).json({
      message: "Account created successfully.",
      token: createToken(newUser),
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isVerified: true,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      error: "Unable to create account.",
    });
  }
});

// ==========================
// SIGN IN
// ==========================
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!user) {
      return res.status(404).json({
        error: "No account found with that email.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid credentials.",
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: true,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);

    return res.status(500).json({
      error: "Unable to sign in.",
    });
  }
});

// ==========================
// VERIFY EMAIL
// (Disabled in development)
// ==========================
router.post("/verify-email", async (req, res) => {
  return res.status(200).json({
    message: "Email verification is disabled in development mode.",
  });
});

export default router;