// changed studentcard to applicationcard
// state lives in context now so other screens can share it
// this screen handles the list plus derived totals and reset all
// edit and remove moved to the detail screen
// plus one and minus one stay on the card via onupdate
// count updates and reset now write to the db and reload
import ApplicationCard from "@/components/ApplicationCard";
import { db } from "@/db/client";
import { applications as applicationsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Button, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Application, ApplicationContext } from "../_layout";

export default function IndexScreen() {
  const router = useRouter();
  const context = useContext(ApplicationContext);

  // guard in case the context is not ready yet
  if (!context) return null;

  const { applications, setApplications } = context;

  // updates the count for one application in the db then reloads all rows
  const updateCount = async (id: number, delta: number) => {
    const current = applications.find((a) => a.id === id);
    if (!current) return;

    await db
      .update(applicationsTable)
      .set({ count: current.count + delta })
      .where(eq(applicationsTable.id, id));

    const rows = await db.select().from(applicationsTable);
    setApplications(rows);
  };

  // resets every applications count back to zero in the db then reloads
  const resetAll = async () => {
    await db.update(applicationsTable).set({ count: 0 });

    const rows = await db.select().from(applicationsTable);
    setApplications(rows);
  };

  // derived values not stored in state
  const total = applications.reduce((sum, a) => sum + a.count, 0);
  const average = applications.length > 0 ? total / applications.length : 0;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 22, marginBottom: 10 }}>
          Total Want Levels: {total}
        </Text>

        <Text style={{ fontSize: 16, marginBottom: 10 }}>
          Average Want Level: {average.toFixed(1)}
        </Text>

        <Button
          title="Add Application"
          onPress={() => router.push({ pathname: "../add" })}
        />

        <Button title="Reset All" onPress={resetAll} />

        {applications.length === 0 ? (
          <Text style={{ marginTop: 20 }}>No applications yet.</Text>
        ) : (
          applications.map((application: Application) => (
            <ApplicationCard
              key={application.id}
              {...application}
              onUpdate={updateCount}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
