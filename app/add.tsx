// form for adding a new application
// reads and writes the shared applications list through context
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Button, TextInput, View } from "react-native";
import { ApplicationContext } from "./_layout";

export default function AddApplication() {
  const router = useRouter();
  const context = useContext(ApplicationContext);

  // form state for the new application
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  if (!context) return null;

  const { applications, setApplications } = context;

  // builds a new application from the form and appends it to the array
  const saveApplication = () => {
    const newApplication = {
      id: Date.now(),
      company,
      category,
      date,
      count: 0,
    };

    setApplications([...applications, newApplication]);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Company"
        value={company}
        onChangeText={setCompany}
        style={{ borderWidth: 1, marginVertical: 5, padding: 5 }}
      />

      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={{ borderWidth: 1, marginVertical: 5, padding: 5 }}
      />

      <TextInput
        placeholder="Date"
        value={date}
        onChangeText={setDate}
        style={{ borderWidth: 1, marginVertical: 5, padding: 5 }}
      />

      <Button title="Save" onPress={saveApplication} />
    </View>
  );
}
