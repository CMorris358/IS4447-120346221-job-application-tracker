// got from part 1 and feb 18 tutorials
// changed studentcard to applicationcard
// lifted count state up from the card to the parent
import ApplicationCard from "@/components/ApplicationCard";
import { useState } from "react";
import { Button, ScrollView, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Application = {
  id: number;
  company: string;
  category: string;
  date: string;
  count: number;
};

export default function IndexScreen() {
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      company: "Google",
      category: "Developer",
      date: "2026-04-01",
      count: 0,
    },
    {
      id: 2,
      company: "Meta",
      category: "Analyst",
      date: "2026-04-01",
      count: 0,
    },
    {
      id: 3,
      company: "Stripe",
      category: "Solutions Engineer",
      date: "2026-04-02",
      count: 0,
    },
  ]);

  // form state for adding or editing an application
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  // tracks which application we are editing so the form knows if we are adding or editing
  const [editingId, setEditingId] = useState<number | null>(null);

  // updates one applications count by a delta
  const updateCount = (id: number, delta: number) => {
    setApplications((prev) =>
      prev.map((application) =>
        application.id === id
          ? { ...application, count: application.count + delta }
          : application,
      ),
    );
  };

  // resets every count back to zero
  const resetAll = () => {
    setApplications((prev) =>
      prev.map((application) => ({ ...application, count: 0 })),
    );
  };

  // removes an application by filtering it out of the array
  const removeApplication = (id: number) => {
    setApplications((prev) =>
      prev.filter((application) => application.id !== id),
    );
  };

  // saves the form either as a new application or an edit based on whether editingid is set
  const saveApplication = () => {
    if (!company.trim()) return;

    if (editingId) {
      // edit branch map through and replace the matching application
      setApplications((prev) =>
        prev.map((application) =>
          application.id === editingId
            ? { ...application, company, category, date }
            : application,
        ),
      );
      setEditingId(null);
    } else {
      // add branch build a new object and append to the array
      const newApplication = {
        id: Date.now(),
        company,
        category,
        date,
        count: 0,
      };
      setApplications((prev) => [...prev, newApplication]);
    }

    setCompany("");
    setCategory("");
    setDate("");
  };

  // derived values not stored in state
  const total = applications.reduce((sum, a) => sum + a.count, 0);
  const average = applications.length > 0 ? total / applications.length : 0;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 22, marginBottom: 10 }}>
          Total Want Levels: {total}
        </Text>

        <Text style={{ fontSize: 16, marginBottom: 10 }}>
          Average Want Level: {average.toFixed(1)}
        </Text>

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

        {/* button title flips between save changes and add based on editing mode */}
        <Button
          title={editingId ? "Save Changes" : "Add Application"}
          onPress={saveApplication}
          disabled={!company.trim()}
        />

        <Button title="Reset All" onPress={resetAll} />

        {applications.length === 0 ? (
          <Text style={{ marginTop: 20 }}>No applications yet.</Text>
        ) : (
          applications.map((application) => (
            <ApplicationCard
              key={application.id}
              {...application}
              onUpdate={updateCount}
              onRemove={removeApplication}
              // when edit is pressed prefill the form with this applications values
              onEdit={(id) => {
                const found = applications.find((a) => a.id === id);
                if (!found) return;
                setEditingId(id);
                setCompany(found.company);
                setCategory(found.category);
                setDate(found.date);
              }}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
