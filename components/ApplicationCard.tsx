// card is a preview of one application
// tapping the company name opens the detail screen for more actions
// plus one and minus one stay here because adjusting want level is a quick action
// accessibility labels added to every interactive element
// now uses infotag for category and date
import InfoTag from "@/components/ui/info-tag";
import { useRouter } from "expo-router";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";

type ApplicationCardProps = {
  id: number;
  company: string;
  category: string;
  date: string;
  count: number;
  onUpdate: (id: number, delta: number) => void;
};

export default function ApplicationCard({
  id,
  company,
  category,
  date,
  count,
  onUpdate,
}: ApplicationCardProps) {
  const router = useRouter();

  // short summary used as the accessibility label for the company name
  const applicationSummary = `${company}, ${category}, ${date}`;

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityLabel={`${applicationSummary}, view details`}
        accessibilityRole="button"
        onPress={() =>
          router.push({
            pathname: "/application/[id]",
            params: { id: id.toString() },
          })
        }
        style={({ pressed }) => [pressed ? styles.pressed : null]}
      >
        <Text style={styles.company}>{company}</Text>
      </Pressable>

      <View style={styles.tags}>
        <InfoTag label="Category" value={category} />
        <InfoTag label="Date" value={date} />
      </View>

      <Text style={styles.countText}>Count: {count}</Text>

      <Button
        title="+1"
        onPress={() => onUpdate(id, 1)}
        accessibilityLabel={`Increase want level for ${company}`}
      />
      <Button
        title="-1"
        onPress={() => onUpdate(id, -1)}
        accessibilityLabel={`Decrease want level for ${company}`}
      />

      <Text style={styles.status}>
        {count > 0 && "Positive"}
        {count < 0 && "Negative"}
        {count === 0 && "Zero"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  pressed: {
    opacity: 0.88,
  },
  company: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "700",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  countText: {
    marginTop: 10,
  },
  status: {
    marginTop: 4,
  },
});
