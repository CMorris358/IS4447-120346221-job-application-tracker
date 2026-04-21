// reusable screen header with a title and optional subtitle
// used at the top of every screen for consistency
import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
};

export default function ScreenHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  title: {
    color: "#0F172A",
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    color: "#475569",
    fontSize: 14,
    marginTop: 4,
  },
});
