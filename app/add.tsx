// form for adding a new application
// uses reusable formfield and primarybutton components
// inserts into the db then reloads the list into context
// date picker used instead of text input and formatted to YYYY-MM-DD

import FormField from "@/components/ui/form-field";
import PrimaryButton from "@/components/ui/primary-button";
import ScreenHeader from "@/components/ui/screen-header";
import { db } from "@/db/client";
import { applications as applicationsTable } from "@/db/schema";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApplicationContext } from "./_layout";

export default function AddApplication() {
  const router = useRouter();
  const context = useContext(ApplicationContext);

  // form state for the new application
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");

  // date picker state
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  if (!context) return null;

  const { setApplications } = context;

  // formats date to YYYY-MM-DD for database
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  // handles date selection
  const onChangeDate = (_: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  // inserts the new application into the db then reloads all rows into context
  const saveApplication = async () => {
    await db.insert(applicationsTable).values({
      company,
      category,
      date: formatDate(date),
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

          {/* date picker display */}
          <Text style={styles.label}>Date</Text>
          <Pressable
            onPress={() => setShowPicker(true)}
            style={styles.dateInput}
          >
            <Text>{formatDate(date)}</Text>
          </Pressable>

          {/* actual picker */}
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
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

  // label for date field
  label: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 4,
  },

  // styled pressable to match input look
  dateInput: {
    backgroundColor: "#FFFFFF",
    borderColor: "#94A3B8",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
});
