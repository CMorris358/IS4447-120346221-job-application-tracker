// form for adding a new application
// inserts into the db then reloads the list into context
import { db } from "@/db/client";
import { applications as applicationsTable } from "@/db/schema";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Button, TextInput, View } from "react-native";
import { ApplicationContext } from "./_layout";

export default function AddApplication() {
  const router = useRouter();
  const context = useContext(ApplicationContext);

  // form state for the new application
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  if (!context) return null;

  const { setApplications } = context;

  // inserts the new application into the db then reloads all rows into context
  const saveApplication = async () => {
    await db.insert(applicationsTable).values({
      company,
      category,
      date,
      count: 0,
    });

    const rows = await db.select().from(applicationsTable);
    setApplications(rows);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Company"
        value={company}
        onChangeText={setCompany}
        style={{ borderWidth: 1, marginVertical: 5, padding: 5 }}
      />

      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={{ borderWidth: 1, marginVertical: 5, padding: 5 }}
      />

      <TextInput
        placeholder="Date"
        value={date}
        onChangeText={setDate}
        style={{ borderWidth: 1, marginVertical: 5, padding: 5 }}
      />

      <Button title="Save" onPress={saveApplication} />
    </View>
  );
}
