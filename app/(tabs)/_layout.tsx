// got from 0304 tutorial step 2
// simplified down to a single tab for applications
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Applications" }} />
    </Tabs>
  );
}
