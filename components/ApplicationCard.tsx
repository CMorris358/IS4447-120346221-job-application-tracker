// got from part 1 and feb 18 tutorials
// changed studentcard to applicationcard
// card is now driven entirely by props from the parent
import { Button, Text, View } from "react-native";

type ApplicationCardProps = {
  id: number;
  company: string;
  category: string;
  date: string;
  count: number;
  onUpdate: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onEdit: (id: number) => void;
};

export default function ApplicationCard({
  id,
  company,
  category,
  date,
  count,
  onUpdate,
  onRemove,
  onEdit,
}: ApplicationCardProps) {
  return (
    <View style={{ marginBottom: 12, padding: 10, borderWidth: 1 }}>
      <Text style={{ fontSize: 18 }}>{company}</Text>
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

      {/* edit button tells the parent to load this application into the form */}
      <View style={{ marginTop: 5 }}>
        <Button title="Edit" onPress={() => onEdit(id)} />
      </View>

      <View style={{ marginTop: 5 }}>
        <Button title="Remove" onPress={() => onRemove(id)} />
      </View>
    </View>
  );
}
