// edit screen for one application
// loads the application by id pre-fills the form and updates on save
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Button, TextInput, View } from "react-native";
import { Application, ApplicationContext } from "../../_layout";

export default function EditApplication() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(ApplicationContext);

  // find the application we are editing before any hooks below
  const application = context?.applications.find(
    (a: Application) => a.id === Number(id),
  );

  // pre-fill form state with the existing values (or empty strings if not found yet)
  const [company, setCompany] = useState(application?.company ?? "");
  const [category, setCategory] = useState(application?.category ?? "");
  const [date, setDate] = useState(application?.date ?? "");

  // guards run after hooks so the hook order stays consistent
  if (!context) return null;
  if (!application) return null;

  const { applications, setApplications } = context;

  // walk through the array and replace the matching application with the new values
  const saveChanges = () => {
    setApplications(
      applications.map((a) =>
        a.id === Number(id) ? { ...a, company, category, date } : a,
      ),
    );
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        value={company}
        onChangeText={setCompany}
        style={{ borderWidth: 1, marginVertical: 5, padding: 5 }}
      />
      <TextInput
        value={category}
        onChangeText={setCategory}
        style={{ borderWidth: 1, marginVertical: 5, padding: 5 }}
      />
      <TextInput
        value={date}
        onChangeText={setDate}
        style={{ borderWidth: 1, marginVertical: 5, padding: 5 }}
      />

      <Button title="Save Changes" onPress={saveChanges} />
    </View>
  );
}
