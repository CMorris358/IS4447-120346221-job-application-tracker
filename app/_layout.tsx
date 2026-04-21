// global state lives here and is sourced from sqlite via drizzle
// seeds the db on first launch then loads all rows into context
// targets added alongside applications both live in this provider
import { db } from "@/db/client";
import {
  applications as applicationsTable,
  targets as targetsTable,
} from "@/db/schema";
import { seedApplicationsIfEmpty, seedTargetsIfEmpty } from "@/db/seed";
import { Stack } from "expo-router";
import { createContext, useEffect, useState } from "react";

export type Application = {
  id: number;
  company: string;
  category: string;
  date: string;
  count: number;
};

export type Target = {
  id: number;
  name: string;
  period: string;
  targetCount: number;
};

type ApplicationContextType = {
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  targets: Target[];
  setTargets: React.Dispatch<React.SetStateAction<Target[]>>;
};

export const ApplicationContext = createContext<ApplicationContextType | null>(
  null,
);

export default function RootLayout() {
  // empty arrays to start both load from the db below
  const [applications, setApplications] = useState<Application[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);

  // runs once on first mount seeds both tables then loads rows into state
  useEffect(() => {
    const loadAll = async () => {
      await seedApplicationsIfEmpty();
      await seedTargetsIfEmpty();
      const applicationRows = await db.select().from(applicationsTable);
      const targetRows = await db.select().from(targetsTable);
      setApplications(applicationRows);
      setTargets(targetRows);
    };
    loadAll();
  }, []);

  return (
    <ApplicationContext.Provider
      value={{ applications, setApplications, targets, setTargets }}
    >
      <Stack />
    </ApplicationContext.Provider>
  );
}
