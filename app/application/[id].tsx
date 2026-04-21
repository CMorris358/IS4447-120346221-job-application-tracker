// detail screen for one application
// reads the id from the route params then finds that application in context
// edit button navigates to the edit screen remove deletes and goes back
// uses screenheader and infotag for consistency with the list screen
import InfoTag from "@/components/ui/info-tag";
import PrimaryButton from "@/components/ui/primary-button";
import ScreenHeader from "@/components/ui/screen-header";
import { db } from "@/db/client";
import { applications as applicationsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Application, ApplicationContext } from "../_layout";

export default function ApplicationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(ApplicationContext);

  // guard in case context is not ready
  if (!context) return null;

  const { applications, setApplications } = context;

  // find the specific application by id
  const application = applications.find(
    (a: Application) => a.id === Number(id),
  );

  // guard in case the application was already removed or id is invalid
  if (!application) return null;

  // deletes this application from the db then reloads all rows into context
  const removeApplication = async () => {
    await db
      .delete(applicationsTable)
      .where(eq(applicationsTable.id, Number(id)));

    const rows = await db.select().from(applicationsTable);
    setApplications(rows);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          title={application.company}
          subtitle="Application details"
        />

        <View style={styles.tags}>
          <InfoTag label="Category" value={application.category} />
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
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  buttonSpacing: {
    marginTop: 10,
  },
});
