// card is a preview of one application
// tapping the company name opens the detail screen for more actions
// plus one and minus one stay here because adjusting want level is a quick action
import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

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

  return (
    <View style={{ marginBottom: 12, padding: 10, borderWidth: 1 }}>
      {/* tapping the company name opens the detail screen */}
      <Text
        style={{ fontSize: 18 }}
        onPress={() =>
          router.push({
            pathname: "/application/[id]",
            params: { id: id.toString() },
          })
        }
      >
        {company}
      </Text>

      <Text>Category: {category}</Text>
      <Text>Date: {date}</Text>

      <Text style={{ marginTop: 10 }}>Count: {count}</Text>

      {/* plus one and minus one call back to the parent with the delta */}
      <Button title="+1" onPress={() => onUpdate(id, 1)} />
      <Button title="-1" onPress={() => onUpdate(id, -1)} />

      <Text>
        {count > 0 && "Positive"}
        {count < 0 && "Negative"}
        {count === 0 && "Zero"}
      </Text>
    </View>
  );
}
