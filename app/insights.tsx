// insights screen
// grouping applications by date and showing count per day
// this is the base logic before adding a chart

import ScreenHeader from "@/components/ui/screen-header";
import { useContext } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApplicationContext } from "./_layout";
//new import for bar chart
import { BarChart } from "react-native-chart-kit";


export default function Insights() {
  const context = useContext(ApplicationContext);

  // just in case context hasnt loaded yet
  if (!context) return null;

  const { applications } = context;

  // grouping apps by date
  // key = date, value = number of apps on that day
  const grouped: Record<string, number> = {};

  applications.forEach((app) => {
    if (grouped[app.date]) {
      grouped[app.date] += 1;
    } else {
      grouped[app.date] = 1;
    }
  });

  // turning object into array so it can be mapped in the UI
  const groupedArray = Object.entries(grouped);

  // turning grouped data into chart format
  const labels: string[] = groupedArray.map(([date]) => date);
  const data: number[] = groupedArray.map(([, count]) => Number(count));

  // getting screen width for chart
  const screenWidth = Dimensions.get("window").width;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Insights" subtitle="Applications per day" />

        {/* total number of applications */}
        <Text style={styles.total}>
          Total Applications: {applications.length}
        </Text>

        {/* simple bar chart */}
        {/* got from youtube video and applied to grouped data */}
        <BarChart
          data={{
            labels: labels,
            datasets: [{ data: data }],
          }}
          width={screenWidth - 36}
          height={220}
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

        {/* showing applications grouped by date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Applications by Date</Text>

          {groupedArray.map(([date, count]) => (
            <Text key={date} style={styles.item}>
              {date}: {count}
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
  total: {
    marginBottom: 12,
    fontSize: 16,
    fontWeight: "600",
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
