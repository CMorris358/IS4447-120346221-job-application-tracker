// small pill showing a label and value pair
// used on cards and detail screens to show category date etc
import { StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  value: string;
};

export default function InfoTag({ label, value }: Props) {
  return (
    <View style={styles.tag}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: "#F1F5F9",
    borderRadius: 999,
    flexDirection: "row",
    marginRight: 6,
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  label: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
    marginRight: 4,
  },
  value: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "500",
  },
});
