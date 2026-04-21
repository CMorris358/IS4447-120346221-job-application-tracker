// edit target screen loads the target by id pre-fills the form
// saves changes or deletes with full db persistence
import FormField from "@/components/ui/form-field";
import PrimaryButton from "@/components/ui/primary-button";
import ScreenHeader from "@/components/ui/screen-header";
import { db } from "@/db/client";
import { targets as targetsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApplicationContext, Target } from "../../_layout";

export default function EditTarget() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(ApplicationContext);

  // find the target we are editing before any hooks below
  const target = context?.targets.find((t: Target) => t.id === Number(id));

  // pre-fill form state with the existing values or empty strings if not found yet
  const [name, setName] = useState(target?.name ?? "");
  const [period, setPeriod] = useState(target?.period ?? "weekly");
  const [targetCount, setTargetCount] = useState(
    target?.targetCount != null ? String(target.targetCount) : "",
  );

  // guards run after hooks so the hook order stays consistent
  if (!context) return null;
  if (!target) return null;

  const { setTargets } = context;

  // updates the target in the db then reloads all rows into context
  const saveChanges = async () => {
    const parsedCount = parseInt(targetCount, 10);
    if (!name.trim() || isNaN(parsedCount) || parsedCount <= 0) return;

    await db
      .update(targetsTable)
      .set({ name, period, targetCount: parsedCount })
      .where(eq(targetsTable.id, Number(id)));

    const rows = await db.select().from(targetsTable);
    setTargets(rows);
    router.back();
  };

  // deletes this target from the db then reloads all rows into context
  const removeTarget = async () => {
    await db.delete(targetsTable).where(eq(targetsTable.id, Number(id)));

    const rows = await db.select().from(targetsTable);
    setTargets(rows);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title={target.name} subtitle="Edit target" />

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
          />
        </View>

        <PrimaryButton label="Save Changes" onPress={saveChanges} />

        <View style={styles.deleteSpacing}>
          <PrimaryButton
            label="Delete"
            variant="secondary"
            onPress={removeTarget}
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
  deleteSpacing: {
    marginTop: 10,
  },
});
