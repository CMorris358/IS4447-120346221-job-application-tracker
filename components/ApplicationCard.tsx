// got from part 1 and feb 18 tutorials
// changed studentcard to applicationcard
// name to company major to category year to date
// count is no longer local state it comes from parent as a prop
// onupdate callback tells parent when plus one or minus one was pressed
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
  return (
    <View style={{ marginBottom: 12, padding: 10, borderWidth: 1 }}>
      <Text style={{ fontSize: 18 }}>{company}</Text>
      <Text>Category: {category}</Text>
      <Text>Date: {date}</Text>

      <Text style={{ marginTop: 10 }}>Count: {count}</Text>

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
