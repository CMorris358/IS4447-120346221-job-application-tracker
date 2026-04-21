// form for adding a new application
// uses reusable formfield and primarybutton components
// inserts into the db then reloads the list into context
import FormField from "@/components/ui/form-field";
import PrimaryButton from "@/components/ui/primary-button";
import ScreenHeader from "@/components/ui/screen-header";
import { db } from "@/db/client";
import { applications as applicationsTable } from "@/db/schema";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          title="Add Application"
          subtitle="Create a new job application"
        />

        <View style={styles.form}>
          <FormField
            label="Company"
            value={company}
            onChangeText={setCompany}
          />
          <FormField
            label="Category"
            value={category}
            onChangeText={setCategory}
          />
          <FormField label="Date" value={date} onChangeText={setDate} />
        </View>

        <PrimaryButton label="Save Application" onPress={saveApplication} />

        <View style={styles.cancelSpacing}>
          <PrimaryButton
            label="Cancel"
            variant="secondary"
            onPress={() => router.back()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#F8FAFC",
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  content: {
    paddingBottom: 24,
    paddingTop: 14,
  },
  form: {
    marginTop: 8,
  },
  cancelSpacing: {
    marginTop: 10,
  },
});
