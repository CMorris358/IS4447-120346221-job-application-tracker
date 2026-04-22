// register screen
// creates a new user in the local db and logs them in straight away
// basic validation for empty fields and duplicate usernames

import { db } from "@/db/client";
import { users } from "@/db/schema";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { ApplicationContext } from "./_layout";

export default function RegisterScreen() {
  const router = useRouter();
  const context = useContext(ApplicationContext);

  // state for form inputs and error message
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // guard if context not ready yet
  if (!context) return null;

  const { setUser } = context;

  // register function inserts new user into db
  const register = async () => {
    setError("");

    // simple check for empty fields
    if (!username.trim() || !password.trim()) {
      setError("Fill in all fields");
      return;
    }

    // tries to insert new user into users table
    try {
      const inserted = await db
        .insert(users)
        .values({ username, password })
        .returning();

      // store new user in global context
      setUser(inserted[0]);

      // navigate into main app after register
      router.replace("/(tabs)");
    } catch (e) {
      // error if username already exists
      setError("Username already taken");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      {/* show error if something goes wrong */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* username input */}
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />

      {/* password input */}
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {/* triggers register function */}
      <Button title="Register" onPress={register} />

      <View style={styles.spacer} />

      {/* go back to login screen */}
      <Button title="Back to Login" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  error: { color: "red", marginBottom: 10, textAlign: "center" },
  spacer: { height: 10 },
});
