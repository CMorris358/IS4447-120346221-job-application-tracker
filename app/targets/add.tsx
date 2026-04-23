// add target screen creates a new target and saves to the db
// period is chosen from two chips instead of a text input
// target count is typed into a form field
// tutorial 18/02 and 11/03
import FormField from "@/components/ui/form-field";
import PrimaryButton from "@/components/ui/primary-button";
import ScreenHeader from "@/components/ui/screen-header";
import { db } from "@/db/client";
import { targets as targetsTable } from "@/db/schema";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApplicationContext } from "../_layout";

export default function AddTarget() {
  const router = useRouter();
  const context = useContext(ApplicationContext);

  // form state for the new target
  const [name, setName] = useState("");
  const [period, setPeriod] = useState("weekly");
  const [targetCount, setTargetCount] = useState("");

  if (!context) return null;

  const { setTargets } = context;

  // inserts the new target into the db then reloads all rows into context
  const saveTarget = async () => {
    const parsedCount = parseInt(targetCount, 10);
    if (!name.trim() || isNaN(parsedCount) || parsedCount <= 0) return;

    await db.insert(targetsTable).values({
      name,
      period,
      targetCount: parsedCount,
    });

    const rows = await db.select().from(targetsTable);
    setTargets(rows);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          title="Add Target"
          subtitle="Set a weekly or monthly goal"
        />

        <View style={styles.form}>
          <FormField label="Name" value={name} onChangeText={setName} />

          <Text style={styles.label}>Period</Text>
          <View style={styles.chipRow}>
            {["weekly", "monthly"].map((option) => {
              const isSelected = period === option;

              return (
                <Pressable
                  key={option}
                  accessibilityLabel={`Set period to ${option}`}
                  accessibilityRole="button"
                  onPress={() => setPeriod(option)}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <FormField
            label="Target count"
            value={targetCount}
            onChangeText={setTargetCount}
            placeholder="How many applications"
          />
        </View>

        <PrimaryButton label="Save Target" onPress={saveTarget} />

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
  label: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    backgroundColor: "#FFFFFF",
    borderColor: "#94A3B8",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipSelected: {
    backgroundColor: "#0F172A",
    borderColor: "#0F172A",
  },
  chipText: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  chipTextSelected: {
    color: "#FFFFFF",
  },
  cancelSpacing: {
    marginTop: 10,
  },
});
