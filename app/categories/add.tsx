// add category screen saves a new category with a colour
// preset colours added so user can select instead of typing hex manually
// tutorial 18/02 and 11/03

import FormField from "@/components/ui/form-field";
import PrimaryButton from "@/components/ui/primary-button";
import ScreenHeader from "@/components/ui/screen-header";
import { db } from "@/db/client";
import { categories as categoriesTable } from "@/db/schema";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApplicationContext } from "../_layout";

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

export default function AddCategory() {
  const router = useRouter();
  const context = useContext(ApplicationContext);

  const [name, setName] = useState("");
  const [colour, setColour] = useState("");

  if (!context) return null;

  const { setCategories } = context;

  const saveCategory = async () => {
    if (!name.trim() || !colour.trim()) return;

    await db.insert(categoriesTable).values({
      name,
      colour,
    });

    const rows = await db.select().from(categoriesTable);
    setCategories(rows);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Add Category" subtitle="Create a new category" />

        <View style={styles.form}>
          <FormField label="Name" value={name} onChangeText={setName} />

          <FormField
            label="Colour (hex)"
            value={colour}
            onChangeText={setColour}
            placeholder="#3B82F6"
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

        <PrimaryButton label="Save Category" onPress={saveCategory} />

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
