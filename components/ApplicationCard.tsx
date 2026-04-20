// got from part 1 tutorial
// changed studentcard to applicationcard
// name to company, major to category, year to date
// added usestate for count (want level) with +1/-1 buttons
import { useState } from "react";
import { Button, Text, View } from "react-native";

type ApplicationCardProps = {
  company: string;
  category: string;
  date: string;
};

export default function ApplicationCard({
  company,
  category,
  date,
}: ApplicationCardProps) {
  const [count, setCount] = useState(0);

  return (
    <View style={{ marginBottom: 12, padding: 10, borderWidth: 1 }}>
      <Text style={{ fontSize: 18 }}>{company}</Text>
      <Text>Category: {category}</Text>
      <Text>Date: {date}</Text>

      <Text style={{ marginTop: 10 }}>Count: {count}</Text>

      <Button title="+1" onPress={() => setCount(count + 1)} />
      <Button title="-1" onPress={() => setCount(count - 1)} />

      <Text>
        {count > 0 && "Positive"}
        {count < 0 && "Negative"}
        {count === 0 && "Zero"}
      </Text>
    </View>
  );
}
