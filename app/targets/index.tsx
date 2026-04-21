// targets list screen shows every goal plus live progress from applications
// progress is derived from the applications array not stored on the target
// tapping add goes to the add screen tapping a target goes to its edit screen
import PrimaryButton from "@/components/ui/primary-button";
import ScreenHeader from "@/components/ui/screen-header";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Application, ApplicationContext, Target } from "../_layout";

export default function TargetsScreen() {
  const router = useRouter();
  const context = useContext(ApplicationContext);

  if (!context) return null;

  const { applications, targets } = context;

  // counts how many applications fall within the targets period
  // weekly uses the last 7 days monthly uses the current calendar month
  const countForPeriod = (period: string) => {
    const now = new Date();

    return applications.filter((a: Application) => {
      const applicationDate = new Date(a.date);
      if (isNaN(applicationDate.getTime())) return false;

      if (period === "weekly") {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        return applicationDate >= sevenDaysAgo && applicationDate <= now;
      }

      if (period === "monthly") {
        return (
          applicationDate.getFullYear() === now.getFullYear() &&
          applicationDate.getMonth() === now.getMonth()
        );
      }

      return false;
    }).length;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Targets" subtitle={`${targets.length} tracked`} />

        <PrimaryButton
          label="Add Target"
          onPress={() => router.push({ pathname: "/targets/add" })}
        />

        <View style={styles.backButton}>
          <PrimaryButton
            label="Back"
            variant="secondary"
            onPress={() => router.back()}
          />
        </View>

        {targets.length === 0 ? (
          <Text style={styles.emptyText}>No targets yet.</Text>
        ) : (
          targets.map((target: Target) => {
            const progress = countForPeriod(target.period);
            const remaining = target.targetCount - progress;
            const exceeded = progress >= target.targetCount;

            return (
              <Pressable
                key={target.id}
                accessibilityLabel={`${target.name}, ${progress} of ${target.targetCount}`}
                accessibilityRole="button"
                onPress={() =>
                  router.push({
                    pathname: "/targets/[id]/edit",
                    params: { id: target.id.toString() },
                  })
                }
                style={({ pressed }) => [
                  styles.card,
                  pressed ? styles.cardPressed : null,
                ]}
              >
                <Text style={styles.name}>{target.name}</Text>
                <Text style={styles.period}>{target.period}</Text>
                <Text style={styles.progress}>
                  {progress} of {target.targetCount}
                </Text>
                <Text
                  style={[
                    styles.status,
                    exceeded ? styles.statusHit : styles.statusPending,
                  ]}
                >
                  {exceeded
                    ? `Target hit${progress > target.targetCount ? ` exceeded by ${progress - target.targetCount}` : ""}`
                    : `${remaining} to go`}
                </Text>
              </Pressable>
            );
          })
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
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  cardPressed: {
    opacity: 0.88,
  },
  name: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "700",
  },
  period: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 2,
    textTransform: "capitalize",
  },
  progress: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 10,
  },
  status: {
    fontSize: 14,
    marginTop: 4,
  },
  statusHit: {
    color: "#047857",
    fontWeight: "600",
  },
  statusPending: {
    color: "#B45309",
  },
  emptyText: {
    color: "#475569",
    fontSize: 16,
    paddingTop: 8,
    textAlign: "center",
  },
});
