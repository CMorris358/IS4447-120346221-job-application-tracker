// got from part 1 and feb 18 tutorials
// changed studentcard to applicationcard
// lifted count state up from the card to the parent
// added total calculated from the array not stored as state
// added average want level per application using the same reduce pattern
import ApplicationCard from "@/components/ApplicationCard";
import { useState } from "react";
import { Text, View } from "react-native";

type Application = {
  id: number;
  company: string;
  category: string;
  date: string;
  count: number;
};

export default function IndexScreen() {
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

  const updateCount = (id: number, delta: number) => {
    setApplications((prev) =>
      prev.map((application) =>
        application.id === id
          ? { ...application, count: application.count + delta }
          : application,
      ),
    );
  };

  // derived values not stored in state
  const total = applications.reduce((sum, a) => sum + a.count, 0);
  const average = applications.length > 0 ? total / applications.length : 0;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>
        Total Want Levels: {total}
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 10 }}>
        Average Want Level: {average.toFixed(1)}
      </Text>

      {applications.map((application) => (
        <ApplicationCard
          key={application.id}
          {...application}
          onUpdate={updateCount}
        />
      ))}
    </View>
  );
}
