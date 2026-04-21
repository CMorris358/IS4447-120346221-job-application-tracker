// global state lives here and is sourced from sqlite via drizzle
// seeds the db on first launch then loads all rows into context
// targets categories and status logs all live in this provider
// login user state added so auth can be checked across the app
import { db } from "@/db/client";
import {
  applications as applicationsTable,
  categories as categoriesTable,
  applicationStatusLogs as statusLogsTable,
  targets as targetsTable,
} from "@/db/schema";
import {
  seedApplicationsIfEmpty,
  seedCategoriesIfEmpty,
  seedStatusLogsIfEmpty,
  seedTargetsIfEmpty,
  seedUsersIfEmpty,
} from "@/db/seed";
import { Stack } from "expo-router";
import { createContext, useEffect, useState } from "react";

// user for log in
export type User = {
  id: number;
  username: string;
  password: string;
};

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

export type Category = {
  id: number;
  name: string;
  colour: string;
};

// status log tracks history of an application over time
export type StatusLog = {
  id: number;
  applicationId: number;
  status: string;
  date: string;
};

type ApplicationContextType = {
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  targets: Target[];
  setTargets: React.Dispatch<React.SetStateAction<Target[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  statusLogs: StatusLog[];
  setStatusLogs: React.Dispatch<React.SetStateAction<StatusLog[]>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const ApplicationContext = createContext<ApplicationContextType | null>(
  null,
);

export default function RootLayout() {
  // empty arrays to start all tables load from the db below
  const [applications, setApplications] = useState<Application[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [statusLogs, setStatusLogs] = useState<StatusLog[]>([]);
  // null means not logged in yet
  const [user, setUser] = useState<User | null>(null);

  // runs once on first mount seeds all tables then loads rows into state
  useEffect(() => {
    const loadAll = async () => {
      await seedApplicationsIfEmpty();
      await seedTargetsIfEmpty();
      await seedCategoriesIfEmpty();
      await seedUsersIfEmpty();
      await seedStatusLogsIfEmpty();
      const applicationRows = await db.select().from(applicationsTable);
      const targetRows = await db.select().from(targetsTable);
      const categoryRows = await db.select().from(categoriesTable);
      const statusLogRows = await db.select().from(statusLogsTable);
      setApplications(applicationRows);
      setTargets(targetRows);
      setCategories(categoryRows);
      setStatusLogs(statusLogRows);
    };
    loadAll();
  }, []);

  // if no user is logged in show the auth stack instead of the main app
  if (!user) {
    return (
      <ApplicationContext.Provider
        value={{
          applications,
          setApplications,
          targets,
          setTargets,
          categories,
          setCategories,
          statusLogs,
          setStatusLogs,
          user,
          setUser,
        }}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" options={{ title: "Login" }} />
          <Stack.Screen name="register" options={{ title: "Register" }} />
        </Stack>
      </ApplicationContext.Provider>
    );
  }

  // logged in users see the full app
  return (
    <ApplicationContext.Provider
      value={{
        applications,
        setApplications,
        targets,
        setTargets,
        categories,
        setCategories,
        statusLogs,
        setStatusLogs,
        user,
        setUser,
      }}
    >
      <Stack />
    </ApplicationContext.Provider>
  );
}
