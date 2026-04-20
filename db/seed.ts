import { db } from "./client";
import { applications } from "./schema";

export async function seedApplicationsIfEmpty() {
  const existing = await db.select().from(applications);
  if (existing.length > 0) return;

  await db.insert(applications).values([
    {
      name: "Google — Software Engineer",
      category: "Full-time",
      date: "2026-04-01",
    },
    {
      name: "Meta — Frontend Intern",
      category: "Internship",
      date: "2026-04-01",
    },
    {
      name: "Stripe — Backend Engineer",
      category: "Full-time",
      date: "2026-04-02",
    },
  ]);
}
