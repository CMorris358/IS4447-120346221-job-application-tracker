// got from starter assignment code
// changed tasks to applications and name to company
// readded count as realised could be used for want level
// swapped sample data to job applications
// added seed for targets so fresh installs have something to demo
import { db } from "./client";
import { applications, targets } from "./schema";

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
