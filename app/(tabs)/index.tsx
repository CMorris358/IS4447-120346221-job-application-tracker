// list screen shows the full applications list plus totals and reset
// now supports search by company text and filter by category
// header and filter chips use reusable components
// count updates and reset write to the db and reload
import ApplicationCard from "@/components/ApplicationCard";
import ScreenHeader from "@/components/ui/screen-header";
import { db } from "@/db/client";
import { applications as applicationsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Application, ApplicationContext } from "../_layout";

export default function IndexScreen() {
  const router = useRouter();
  const context = useContext(ApplicationContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // guard in case the context is not ready yet
  if (!context) return null;

  const { applications, setApplications } = context;

  // updates the count for one application in the db then reloads all rows
  const updateCount = async (id: number, delta: number) => {
    const current = applications.find((a) => a.id === id);
    if (!current) return;

    await db
      .update(applicationsTable)
      .set({ count: current.count + delta })
      .where(eq(applicationsTable.id, id));

    const rows = await db.select().from(applicationsTable);
    setApplications(rows);
  };

  // resets every applications count back to zero in the db then reloads
  const resetAll = async () => {
    await db.update(applicationsTable).set({ count: 0 });
    const rows = await db.select().from(applicationsTable);
    setApplications(rows);
  };

  // derived values not stored in state
  const total = applications.reduce((sum, a) => sum + a.count, 0);
  const average = applications.length > 0 ? total / applications.length : 0;

  // lowercase trimmed query used for case insensitive matching below
  const normalizedQuery = searchQuery.trim().toLowerCase();

  // dynamic list of categories pulled from the current applications
  // all first then each unique category from the data
  const categoryOptions = [
    "All",
    ...Array.from(new Set(applications.map((a: Application) => a.category))),
  ];

  // filter pipeline runs both search and category filter on every render
  const filteredApplications = applications.filter(
    (application: Application) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        application.company.toLowerCase().includes(normalizedQuery) ||
        application.category.toLowerCase().includes(normalizedQuery);

      const matchesCategory =
        selectedCategory === "All" || application.category === selectedCategory;

      return matchesSearch && matchesCategory;
    },
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.listContent}>
        <ScreenHeader
          title="Applications"
          subtitle={`${applications.length} tracked`}
        />

        <Text style={styles.totalText}>Total Want Levels: {total}</Text>
        <Text style={styles.averageText}>
          Average Want Level: {average.toFixed(1)}
        </Text>

        <Button
          title="Add Application"
          onPress={() => router.push({ pathname: "../add" })}
        />

        {/* takes user to the targets screen */}
        <Button
          title="Targets"
          onPress={() => router.push({ pathname: "/targets" })}
        />

        <Button title="Reset All" onPress={resetAll} />

        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by company or category"
          style={styles.searchInput}
        />

        <View style={styles.filterRow}>
          {categoryOptions.map((option) => {
            const isSelected = selectedCategory === option;

            return (
              <Pressable
                key={option}
                accessibilityLabel={`Filter by ${option}`}
                accessibilityRole="button"
                onPress={() => setSelectedCategory(option)}
                style={[
                  styles.filterButton,
                  isSelected && styles.filterButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    isSelected && styles.filterButtonTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {filteredApplications.length === 0 ? (
          <Text style={styles.emptyText}>
            {applications.length === 0
              ? "No applications yet."
              : "No applications match your filters."}
          </Text>
        ) : (
          filteredApplications.map((application: Application) => (
            <ApplicationCard
              key={application.id}
              {...application}
              onUpdate={updateCount}
            />
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
  listContent: {
    paddingBottom: 24,
    paddingTop: 14,
  },
  totalText: {
    fontSize: 22,
    marginBottom: 10,
  },
  averageText: {
    fontSize: 16,
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderColor: "#94A3B8",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  filterButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#94A3B8",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterButtonSelected: {
    backgroundColor: "#0F172A",
    borderColor: "#0F172A",
  },
  filterButtonText: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "500",
  },
  filterButtonTextSelected: {
    color: "#FFFFFF",
  },
  emptyText: {
    color: "#475569",
    fontSize: 16,
    paddingTop: 8,
    textAlign: "center",
  },
});
