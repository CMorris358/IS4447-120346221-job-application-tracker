// detail screen for one application
// reads the id from the route params then finds that application in context
// edit button navigates to the edit screen remove deletes and goes back
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { Button, Text, View } from "react-native";
import { Application, ApplicationContext } from "../_layout";

export default function ApplicationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(ApplicationContext);

  // guard in case context is not ready
  if (!context) return null;

  const { applications, setApplications } = context;

  // find the specific application by id
  const application = applications.find(
    (a: Application) => a.id === Number(id),
  );

  // guard in case the application was already removed or id is invalid
  if (!application) return null;

  // removes this application and navigates back to the list
  const removeApplication = () => {
    setApplications(applications.filter((a) => a.id !== Number(id)));
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>{application.company}</Text>
      <Text>Category: {application.category}</Text>
      <Text>Date: {application.date}</Text>
      <Text>Count: {application.count}</Text>

      <Button
        title="Edit"
        onPress={() =>
          router.push({
            pathname: "/application/[id]/edit",
            params: { id },
          })
        }
      />

      <Button title="Remove" onPress={removeApplication} />

      <Button title="Back" onPress={() => router.back()} />
    </View>
  );
}
