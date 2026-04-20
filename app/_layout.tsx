// got from 0304 tutorial step 1
// changed student to application everywhere
// moved the applications state out of indexscreen into global context
// so every screen in the app can read and write the same data
import { Stack } from "expo-router";
import { createContext, useState } from "react";

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
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      company: "Google",
      category: "Developer",
      date: "2026-04-01",
      count: 0,
    },
    {
      id: 2,
      company: "Meta",
      category: "Analyst",
      date: "2026-04-01",
      count: 0,
    },
    {
      id: 3,
      company: "Stripe",
      category: "Solutions Engineer",
      date: "2026-04-02",
      count: 0,
    },
  ]);

  return (
    <ApplicationContext.Provider value={{ applications, setApplications }}>
      <Stack />
    </ApplicationContext.Provider>
  );
}
