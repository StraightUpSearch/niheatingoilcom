/**
 * Script to create an MCP test user for authentication testing
 * Run with: node create-mcp-user.js
 */

import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { db } from "./server/db-local.js";
import { users } from "./shared/schema.js";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(32).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}

async function createMcpUser() {
  try {
    console.log("🔐 Creating MCP test user...");

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.username, "mcp"));

    if (existingUser.length > 0) {
      console.log("✅ MCP user already exists!");
      console.log("   Username: mcp");
      console.log("   Email: mcp@niheatingoil.com");
      console.log("   You can use the existing credentials to log in.");
      return;
    }

    // Create MCP user with secure password
    const mcpPassword = "McpTest123!"; // Strong password that meets validation requirements
    const hashedPassword = await hashPassword(mcpPassword);

    const [newUser] = await db.insert(users).values({
      id: `user_mcp_${Date.now()}`,
      username: "mcp",
      email: "mcp@niheatingoil.com",
      password: hashedPassword,
      fullName: "MCP Test User",
      phone: "0800-MCP-TEST",
      firstName: "MCP",
      lastName: "Tester"
    }).returning();

    console.log("✅ MCP test user created successfully!");
    console.log("\n📋 Login credentials:");
    console.log("   Username: mcp");
    console.log("   Password: McpTest123!");
    console.log("   Email: mcp@niheatingoil.com");
    console.log("\n⚠️  Please keep these credentials secure!");
    console.log("\n🔗 You can now log in at: http://localhost:5000/login");

  } catch (error) {
    console.error("❌ Error creating MCP user:", error);
    throw error;
  }
}

// Run the script
createMcpUser()
  .then(() => {
    console.log("\n✅ Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });
