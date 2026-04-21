// categories list screen shows every category with its colour dot
// tapping add goes to the add screen tapping a category goes to its edit screen
import PrimaryButton from "@/components/ui/primary-button";
import ScreenHeader from "@/components/ui/screen-header";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApplicationContext, Category } from "../_layout";

export default function CategoriesScreen() {
  const router = useRouter();
  const context = useContext(ApplicationContext);

  if (!context) return null;

  const { categories } = context;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          title="Categories"
          subtitle={`${categories.length} defined`}
        />

        <PrimaryButton
          label="Add Category"
          onPress={() => router.push({ pathname: "/categories/add" })}
        />

        <View style={styles.backButton}>
          <PrimaryButton
            label="Back"
            variant="secondary"
            onPress={() => router.back()}
          />
        </View>

        {categories.length === 0 ? (
          <Text style={styles.emptyText}>No categories yet.</Text>
        ) : (
          categories.map((category: Category) => (
            <Pressable
              key={category.id}
              accessibilityLabel={`Edit category ${category.name}`}
              accessibilityRole="button"
              onPress={() =>
                router.push({
                  pathname: "/categories/[id]/edit",
                  params: { id: category.id.toString() },
                })
              }
              style={({ pressed }) => [
                styles.card,
                pressed ? styles.cardPressed : null,
              ]}
            >
              <View
                style={[styles.dot, { backgroundColor: category.colour }]}
              />
              <Text style={styles.name}>{category.name}</Text>
            </Pressable>
          ))
        )}
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
  backButton: {
    marginTop: 10,
    marginBottom: 10,
  },
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 12,
    padding: 14,
  },
  cardPressed: {
    opacity: 0.88,
  },
  dot: {
    borderRadius: 999,
    height: 20,
    marginRight: 12,
    width: 20,
  },
  name: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "700",
  },
  emptyText: {
    color: "#475569",
    fontSize: 16,
    paddingTop: 8,
    textAlign: "center",
  },
});
