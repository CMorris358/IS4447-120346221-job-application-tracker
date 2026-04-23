// insights screen
// grouping applications by date and showing count per day
// fixed bug where weekly and monthly views did not change
// now weekly shows last 7 days and monthly shows last 30 days from today
// horizontal scroll added so chart scales with number of data points

import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApplicationContext } from "./_layout";

export default function Insights() {
  const context = useContext(ApplicationContext);
  const router = useRouter();

  const [view, setView] = useState<"daily" | "weekly" | "monthly">("daily");

  if (!context) return null;

  const { applications } = context;

  // get unique dates sorted
  const uniqueDates = Array.from(
    new Set(applications.map((a) => a.date)),
  ).sort();

  // build continuous date range for daily view
  const fullDates: string[] = [];

  if (uniqueDates.length > 0) {
    let current = new Date(uniqueDates[0]);
    const end = new Date(uniqueDates[uniqueDates.length - 1]);

    while (current <= end) {
      fullDates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
  }

  // count apps per day
  const counts: Record<string, number> = {};
  applications.forEach((app) => {
    counts[app.date] = (counts[app.date] || 0) + 1;
  });

  let labels: string[] = [];
  let data: number[] = [];

  // daily full range
  if (view === "daily") {
    labels = fullDates.map((d) => d.slice(5));
    data = fullDates.map((date) => counts[date] || 0);
  }

  // weekly last 7 days from today replaced from fulldate slice which only captured application number days
  if (view === "weekly") {
    const today = new Date();
    const last7: string[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      last7.push(d.toISOString().split("T")[0]);
    }

    labels = last7.map((d) => d.slice(5));
    data = last7.map((date) => counts[date] || 0);
  }

  // monthly last 30 days from today from fulldate slice which only captured application number days
  if (view === "monthly") {
    const today = new Date();
    const last30: string[] = [];

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      last30.push(d.toISOString().split("T")[0]);
    }

    labels = last30.map((d) => d.slice(5));
    data = last30.map((date) => counts[date] || 0);
  }

  const screenWidth = Dimensions.get("window").width;

  // streak logic
  const streakDates = [...uniqueDates].sort((a, b) => (a < b ? 1 : -1));

  let streak = 0;

  if (streakDates.length > 0) {
    for (let i = 0; i < streakDates.length - 1; i++) {
      const current = new Date(streakDates[i]);
      const next = new Date(streakDates[i + 1]);

      const diff = (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24);

      if (i === 0) streak = 1;

      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Insights</Text>
          <Text style={styles.back} onPress={() => router.back()}>
            ← Back
          </Text>
        </View>

        {/* stats */}
        <View style={styles.statsRow}>
          <Text style={styles.statText}>Streak: {streak}</Text>
          <Text style={styles.statText}>Total: {applications.length}</Text>
        </View>

        {/* toggle */}
        <View style={styles.toggleRow}>
          {["daily", "weekly", "monthly"].map((v) => (
            <Pressable
              key={v}
              onPress={() => setView(v as any)}
              style={[styles.toggleButton, view === v && styles.toggleSelected]}
            >
              <Text
                style={[
                  styles.toggleText,
                  view === v && styles.toggleTextSelected,
                ]}
              >
                {v}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* chart */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            data={{
              labels,
              datasets: [{ data }],
            }}
            width={Math.max(screenWidth, labels.length * 50)}
            height={220}
            fromZero
            segments={4}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(15, 23, 42, ${opacity})`,
              labelColor: () => "#475569",
            }}
            style={{ marginVertical: 16, borderRadius: 12 }}
          />
        </ScrollView>

        {/* list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>breakdown</Text>

          {labels.map((label, index) => (
            <Text key={label} style={styles.item}>
              {label}: {data[index]}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  content: {
    paddingBottom: 24,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  back: {
    color: "#2563EB",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  statText: {
    fontWeight: "600",
  },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  toggleButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CBD5F5",
  },

  toggleSelected: {
    backgroundColor: "#0F172A",
  },

  toggleText: {
    color: "#0F172A",
  },

  toggleTextSelected: {
    color: "#FFFFFF",
  },

  section: {
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },

  item: {
    fontSize: 14,
    marginBottom: 4,
  },
});
