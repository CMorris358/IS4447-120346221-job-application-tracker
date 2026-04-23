// detail screen for one application
// tutorial 25/03 and 11/03
// reads the id from the route params then finds that application in context
// edit button navigates to the edit screen remove deletes and goes back
// uses screenheader and infotag for consistency with the list screen
// status history added to track application progress over time
// back button added so user can return to the list
import InfoTag from "@/components/ui/info-tag";
import PrimaryButton from "@/components/ui/primary-button";
import ScreenHeader from "@/components/ui/screen-header";
import { db } from "@/db/client";
import {
  applications as applicationsTable,
  applicationStatusLogs as statusLogsTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Application, ApplicationContext, StatusLog } from "../_layout";

export default function ApplicationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(ApplicationContext);

  // guard in case context is not ready
  if (!context) return null;

  const {
    applications,
    setApplications,
    categories,
    statusLogs,
    setStatusLogs,
  } = context;

  // find the specific application by id
  const application = applications.find(
    (a: Application) => a.id === Number(id),
  );

  // guard in case the application was already removed or id is invalid
  if (!application) return null;

  // match category to get its colour (used for dot)
  const categoryMatch = categories.find((c) => c.name === application.category);

  // filter status logs for this application only
  const applicationStatusLogs = statusLogs.filter(
    (log: StatusLog) => log.applicationId === Number(id),
  );

  // deletes this application from the db then reloads all rows into context
  const removeApplication = async () => {
    await db
      .delete(applicationsTable)
      .where(eq(applicationsTable.id, Number(id)));

    const rows = await db.select().from(applicationsTable);
    setApplications(rows);
    router.back();
  };

  // adds a new status log for today then reloads all logs
  const addStatus = async (status: string) => {
    const today = new Date().toISOString().split("T")[0];
    await db.insert(statusLogsTable).values({
      applicationId: Number(id),
      status,
      date: today,
    });
    const rows = await db.select().from(statusLogsTable);
    setStatusLogs(rows);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          title={application.company}
          subtitle="Application details"
        />

        {/* back button to return to the list screen */}
        <View style={styles.backSpacing}>
          <PrimaryButton
            label="Back"
            variant="secondary"
            onPress={() => router.back()}
          />
        </View>

        <View style={styles.tags}>
          {/* added small colour dot based on category table */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                backgroundColor: categoryMatch?.colour || "#CBD5F5",
                marginRight: 6,
              }}
            />
            <InfoTag label="Category" value={application.category} />
          </View>

          <InfoTag label="Date" value={application.date} />
          <InfoTag label="Count" value={String(application.count)} />
        </View>

        <PrimaryButton
          label="Edit"
          onPress={() =>
            router.push({
              pathname: "/application/[id]/edit",
              params: { id },
            })
          }
        />

        <View style={styles.buttonSpacing}>
          <PrimaryButton
            label="Delete"
            variant="secondary"
            onPress={removeApplication}
          />
        </View>

        {/* status history section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status History</Text>
          {applicationStatusLogs.length === 0 ? (
            <Text style={styles.empty}>No status updates yet.</Text>
          ) : (
            applicationStatusLogs.map((log: StatusLog) => (
              <View key={log.id} style={styles.logRow}>
                <Text style={styles.logStatus}>{log.status}</Text>
                <Text style={styles.logDate}>{log.date}</Text>
              </View>
            ))
          )}

          <Text style={styles.updateLabel}>Update Status:</Text>
          <View style={styles.statusButtons}>
            {["Applied", "Interviewing", "Offer", "Rejected"].map((s) => (
              <View key={s} style={styles.statusButton}>
                <Button title={s} onPress={() => addStatus(s)} />
              </View>
            ))}
          </View>
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
  },
  backSpacing: {
    marginBottom: 12,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  buttonSpacing: {
    marginTop: 10,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  empty: {
    color: "#64748B",
    marginBottom: 10,
  },
  logRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  logStatus: {
    fontSize: 15,
    fontWeight: "600",
  },
  logDate: {
    fontSize: 14,
    color: "#64748B",
  },
  updateLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 8,
    color: "#334155",
  },
  statusButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusButton: {
    marginBottom: 8,
  },
});
