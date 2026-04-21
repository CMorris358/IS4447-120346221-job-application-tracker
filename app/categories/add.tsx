// add category screen saves a new category with a colour
// colour is typed in as a hex value for now simple and fast
import FormField from "@/components/ui/form-field";
import PrimaryButton from "@/components/ui/primary-button";
import ScreenHeader from "@/components/ui/screen-header";
import { db } from "@/db/client";
import { categories as categoriesTable } from "@/db/schema";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApplicationContext } from "../_layout";

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
});
