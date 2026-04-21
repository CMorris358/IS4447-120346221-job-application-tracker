// got from starter assignment code
// changed tasks to applications and name to company
// readded count as realised could be used for want level
// swapped sample data to job applications with april 2026 dates
// added seed for targets so fresh installs have something to demo
// added seed for categories with colours matching existing application category names
// added seed for users so there is a default account to log in with
import { db } from "./client";
import { applications, categories, targets, users } from "./schema";

export async function seedApplicationsIfEmpty() {
  const existing = await db.select().from(applications);
  if (existing.length > 0) return;

  await db.insert(applications).values([
    { company: "Google", category: "Developer", date: "2026-04-01", count: 8 },
    { company: "Meta", category: "Analyst", date: "2026-04-01", count: 6 },
    {
      company: "Stripe",
      category: "Solutions Engineer",
      date: "2026-04-02",
      count: 9,
    },
  ]);
}

export async function seedTargetsIfEmpty() {
  const existing = await db.select().from(targets);
  if (existing.length > 0) return;

  await db.insert(targets).values([
    { name: "Weekly goal", period: "weekly", targetCount: 5 },
    { name: "Monthly goal", period: "monthly", targetCount: 20 },
  ]);
}

export async function seedCategoriesIfEmpty() {
  const existing = await db.select().from(categories);
  if (existing.length > 0) return;

  await db.insert(categories).values([
    { name: "Developer", colour: "#3B82F6" },
    { name: "Analyst", colour: "#10B981" },
    { name: "Solutions Engineer", colour: "#F59E0B" },
    { name: "Sales", colour: "#EF4444" },
  ]);
}

export async function seedUsersIfEmpty() {
  const existing = await db.select().from(users);
  if (existing.length > 0) return;

  await db.insert(users).values([{ username: "demo", password: "demo" }]);
}
