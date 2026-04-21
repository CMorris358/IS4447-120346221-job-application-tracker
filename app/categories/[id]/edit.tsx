// edit category screen lets user update name and colour or delete it
import FormField from "@/components/ui/form-field";
import PrimaryButton from "@/components/ui/primary-button";
import ScreenHeader from "@/components/ui/screen-header";
import { db } from "@/db/client";
import { categories as categoriesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApplicationContext, Category } from "../../_layout";

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
});
