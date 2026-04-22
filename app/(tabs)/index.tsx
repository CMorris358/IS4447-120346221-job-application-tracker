// list screen shows the full applications list plus totals and reset
// supports search by company text and filter by category
// header and filter chips use reusable components
// count updates and reset write to the db and reload
// added logout and delete profile for login requirement
// simple theme toggle added using context state
import ApplicationCard from "@/components/ApplicationCard";
import ScreenHeader from "@/components/ui/screen-header";
import { db } from "@/db/client";
import { applications as applicationsTable, users } from "@/db/schema";
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

  if (!context) return null;

  const { applications, setApplications, user, setUser, theme, setTheme } =
    context;

  // toggle between light and dark
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

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

  const logout = () => {
    setUser(null);
    router.replace("../login");
  };

  const deleteProfile = async () => {
    if (!user) return;
    await db.delete(users).where(eq(users.id, user.id));
    setUser(null);
    router.replace("../login");
  };

  const resetAll = async () => {
    await db.update(applicationsTable).set({ count: 0 });
    const rows = await db.select().from(applicationsTable);
    setApplications(rows);
  };

  const total = applications.reduce((sum, a) => sum + a.count, 0);
  const average = applications.length > 0 ? total / applications.length : 0;

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const categoryOptions = [
    "All",
    ...Array.from(new Set(applications.map((a: Application) => a.category))),
  ];

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
    <SafeAreaView
      style={[
        styles.safeArea,
        // change background based on theme
        { backgroundColor: theme === "light" ? "#F8FAFC" : "#0F172A" },
      ]}
    >
      <ScrollView contentContainerStyle={styles.listContent}>
        <ScreenHeader
          title="Applications"
          subtitle={`${applications.length} tracked`}
        />

        <Text style={styles.totalText}>Total Want Levels: {total}</Text>
        <Text style={styles.averageText}>
          Average Want Level: {average.toFixed(1)}
        </Text>

        {/* theme toggle button */}
        <Button title={`Theme: ${theme}`} onPress={toggleTheme} />

        <Button
          title="Add Application"
          onPress={() => router.push({ pathname: "../add" })}
        />

        <Button
          title="Targets"
          onPress={() => router.push({ pathname: "/targets" })}
        />

        <Button
          title="Categories"
          onPress={() => router.push({ pathname: "/categories" })}
        />

        <Button
          title="Insights"
          onPress={() => router.push({ pathname: "/insights" })}
        />

        <Button title="Reset All" onPress={resetAll} />

        <Button title="Logout" onPress={logout} />

        <Button title="Delete Profile" color="red" onPress={deleteProfile} />

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
