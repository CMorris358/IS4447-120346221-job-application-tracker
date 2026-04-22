// list screen shows the full applications list plus totals and reset
// supports search by company text and filter by category
// header and filter chips use reusable components
// count updates and reset write to the db and reload
// added logout and delete profile for login requirement
// simple theme toggle added using context state
// ui updated to separate header stats actions and list

import ApplicationCard from "@/components/ApplicationCard";
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

  // update count in db then reload
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

  // logout user
  const logout = () => {
    setUser(null);
    router.replace("../login");
  };

  // delete user then logout
  const deleteProfile = async () => {
    if (!user) return;
    await db.delete(users).where(eq(users.id, user.id));
    setUser(null);
    router.replace("../login");
  };

  // reset all counts
  const resetAll = async () => {
    await db.update(applicationsTable).set({ count: 0 });
    const rows = await db.select().from(applicationsTable);
    setApplications(rows);
  };

  // calculate average want level
  const total = applications.reduce((sum, a) => sum + a.count, 0);
  const average = applications.length > 0 ? total / applications.length : 0;

  // search query
  const normalizedQuery = searchQuery.trim().toLowerCase();

  // category options
  const categoryOptions = [
    "All",
    ...Array.from(new Set(applications.map((a: Application) => a.category))),
  ];

  // filter applications
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
        { backgroundColor: theme === "light" ? "#F8FAFC" : "#0F172A" },
      ]}
    >
      <ScrollView contentContainerStyle={styles.listContent}>
        {/* header row */}
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.title,
              { color: theme === "light" ? "#0F172A" : "#FFFFFF" },
            ]}
          >
            Job Tracker
          </Text>
          <Button title="Logout" onPress={logout} />
        </View>

        {/* stats row with now added toggle UI */}
        <View style={styles.statsRow}>
          <Text
            style={[
              styles.statText,
              { color: theme === "light" ? "#0F172A" : "#FFFFFF" },
            ]}
          >
            Applied: {applications.length}
          </Text>
          <Text
            style={[
              styles.statText,
              { color: theme === "light" ? "#0F172A" : "#FFFFFF" },
            ]}
          >
            Avg: {average.toFixed(1)}
          </Text>
          <Button title="Theme" onPress={toggleTheme} />
        </View>

        {/* actions row */}
        <View style={styles.actionsRow}>
          <Button
            title="Add"
            onPress={() => router.push({ pathname: "../add" })}
          />
          <Button
            title="Targets"
            onPress={() => router.push({ pathname: "/targets" })}
          />
          <Button
            title="Cats"
            onPress={() => router.push({ pathname: "/categories" })}
          />
          <Button
            title="Stats"
            onPress={() => router.push({ pathname: "/insights" })}
          />
          <Button title="Delete Profile" color="red" onPress={deleteProfile} />
        </View>

        {/* search */}
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by company or category"
          style={styles.searchInput}
        />

        {/* filters */}
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

        {/* list */}
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

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  statText: {
    fontSize: 14,
    fontWeight: "500",
  },

  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 14,
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
