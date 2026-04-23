// edit screen for one application
// loads the application by id pre-fills the form and updates the db on save
// tutorial 18/02/2026 and 11/03
import { db } from "@/db/client";
import { applications as applicationsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Button, TextInput, View } from "react-native";
import { Application, ApplicationContext } from "../../_layout";

export default function EditApplication() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(ApplicationContext);

  // find the application we are editing before any hooks below
  const application = context?.applications.find(
    (a: Application) => a.id === Number(id),
  );

  // pre-fill form state with the existing values (or empty strings if not found yet)
  const [company, setCompany] = useState(application?.company ?? "");
  const [category, setCategory] = useState(application?.category ?? "");
  const [date, setDate] = useState(application?.date ?? "");

  // guards run after hooks so the hook order stays consistent
  if (!context) return null;
  if (!application) return null;

  const { setApplications } = context;

  // updates the application in the db then reloads all rows into context
  const saveChanges = async () => {
    await db
      .update(applicationsTable)
      .set({ company, category, date })
      .where(eq(applicationsTable.id, Number(id)));

    const rows = await db.select().from(applicationsTable);
    setApplications(rows);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        value={company}
        onChangeText={setCompany}
        style={{ borderWidth: 1, marginVertical: 5, padding: 5 }}
      />
      <TextInput
        value={category}
        onChangeText={setCategory}
        style={{ borderWidth: 1, marginVertical: 5, padding: 5 }}
      />
      <TextInput
        value={date}
        onChangeText={setDate}
        style={{ borderWidth: 1, marginVertical: 5, padding: 5 }}
      />

      <Button title="Save Changes" onPress={saveChanges} />
    </View>
  );
}
