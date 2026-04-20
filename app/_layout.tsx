// global state lives here and is now sourced from sqlite via drizzle
// seeds the db on first launch then loads all rows into context
import { db } from "@/db/client";
import { applications as applicationsTable } from "@/db/schema";
import { seedApplicationsIfEmpty } from "@/db/seed";
import { Stack } from "expo-router";
import { createContext, useEffect, useState } from "react";

export type Application = {
  id: number;
  company: string;
  category: string;
  date: string;
  count: number;
};

type ApplicationContextType = {
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
};

export const ApplicationContext = createContext<ApplicationContextType | null>(
  null,
);

export default function RootLayout() {
  // empty array to start applications load from the db below
  const [applications, setApplications] = useState<Application[]>([]);

  // runs once on first mount seeds then loads rows into state
  useEffect(() => {
    const loadApplications = async () => {
      await seedApplicationsIfEmpty();
      const rows = await db.select().from(applicationsTable);
      setApplications(rows);
    };
    loadApplications();
  }, []);

  return (
    <ApplicationContext.Provider value={{ applications, setApplications }}>
      <Stack />
    </ApplicationContext.Provider>
  );
}
