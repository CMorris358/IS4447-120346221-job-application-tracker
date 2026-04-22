// edit category screen lets user update name and colour or delete it
// preset colours added so user can select instead of typing hex manually

import FormField from "@/components/ui/form-field";
import PrimaryButton from "@/components/ui/primary-button";
import ScreenHeader from "@/components/ui/screen-header";
import { db } from "@/db/client";
import { categories as categoriesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApplicationContext, Category } from "../../_layout";

// preset colour options user can pick instead of typing hex
const presetColours = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#64748B",
  "#000000",
];

export default function EditCategory() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(ApplicationContext);

  const category = context?.categories.find(
    (c: Category) => c.id === Number(id),
  );

  const [name, setName] = useState(category?.name ?? "");
  const [colour, setColour] = useState(category?.colour ?? "");

  if (!context) return null;
  if (!category) return null;

  const { setCategories } = context;

  const saveChanges = async () => {
    if (!name.trim() || !colour.trim()) return;

    await db
      .update(categoriesTable)
      .set({ name, colour })
      .where(eq(categoriesTable.id, Number(id)));

    const rows = await db.select().from(categoriesTable);
    setCategories(rows);
    router.back();
  };

  const removeCategory = async () => {
    await db.delete(categoriesTable).where(eq(categoriesTable.id, Number(id)));

    const rows = await db.select().from(categoriesTable);
    setCategories(rows);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title={category.name} subtitle="Edit category" />

        <View style={styles.form}>
          <FormField label="Name" value={name} onChangeText={setName} />

          <FormField
            label="Colour (hex)"
            value={colour}
            onChangeText={setColour}
          />

          {/* preset colour picker */}
          <View style={styles.colourRow}>
            {presetColours.map((c) => (
              <Pressable
                key={c}
                onPress={() => setColour(c)}
                style={[
                  styles.colourCircle,
                  { backgroundColor: c },
                  colour === c && styles.selectedColour,
                ]}
              />
            ))}
          </View>
        </View>

        <PrimaryButton label="Save Changes" onPress={saveChanges} />

        <View style={styles.deleteSpacing}>
          <PrimaryButton
            label="Delete"
            variant="secondary"
            onPress={removeCategory}
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
  deleteSpacing: {
    marginTop: 10,
  },

  // row of selectable colours
  colourRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    gap: 10,
  },

  // circular colour option
  colourCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },

  // highlight selected colour
  selectedColour: {
    borderColor: "#0F172A",
    borderWidth: 3,
  },
});
