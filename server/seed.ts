import { db } from "./db";
import { companies, users } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    // Check if demo company already exists
    const existingCompany = await db
      .select()
      .from(companies)
      .where(eq(companies.name, "Demo Property Management"));

    if (existingCompany.length > 0) {
      console.log("Demo company already exists, skipping seed");
      return;
    }

    // Create demo company for new users
    // This will be associated with users when they first log in
    const [demoCompany] = await db.insert(companies).values({
      name: "Demo Property Management",
      email: "demo@propertymanager.com",
      phone: "(555) 123-4567",
      address: "123 Main Street, City, State 12345",
      ownerId: "placeholder", // This will be updated when first user logs in
    }).returning();

    console.log("Created demo company:", demoCompany.id);
    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Auto-run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
