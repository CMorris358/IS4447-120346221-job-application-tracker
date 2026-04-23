// card is a preview of one application
// tapping the company name opens the detail screen for more actions
// plus one and minus one stay here because adjusting want level is a quick action
// accessibility labels added to every interactive element
// now uses infotag for category and date
// added category colour by matching application category to categories table
// based on 04/03/2026 tutorial
import InfoTag from "@/components/ui/info-tag";
import { useRouter } from "expo-router";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";

// pulling categories from context so i can match category name to colour
import { ApplicationContext } from "@/app/_layout";
import { useContext } from "react";

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

  // getting categories from global state
  const context = useContext(ApplicationContext);
  if (!context) return null;

  const { categories } = context;

  // finding matching category so i can use its colour
  const categoryMatch = categories.find((c) => c.name === category);

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
        {/* added coloured dot to show category visually */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={[
              styles.dot,
              { backgroundColor: categoryMatch?.colour || "#CBD5F5" },
            ]}
          />
          <InfoTag label="Category" value={category} />
        </View>

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
  // small dot to show category colour
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginRight: 6,
  },
  countText: {
    marginTop: 10,
  },
  status: {
    marginTop: 4,
  },
});
