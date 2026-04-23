// 03/04 tutorial
// simplified down to a single tab for applications
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Applications" }} />
    </Tabs>
  );
}
