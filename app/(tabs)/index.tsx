// got from part 1 tutorial
// changed studentcard to applicationcard
// swapped sample data to job applications
import ApplicationCard from "@/components/ApplicationCard";
import { View } from "react-native";

export default function IndexScreen() {
  return (
    <View style={{ padding: 20 }}>
      <ApplicationCard
        company="Google"
        category="Developer"
        date="2026-04-01"
      />
      <ApplicationCard company="Meta" category="Analyst" date="2026-04-01" />
      <ApplicationCard
        company="Stripe"
        category="Solutions Engineer"
        date="2026-04-02"
      />
    </View>
  );
}
