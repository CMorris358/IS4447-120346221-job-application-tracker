// login screen
// handles user login by checking username and password against local db
// sets user in global context and routes into app on success
// tutorial 18/02 and 11/03 and 25/03

import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { ApplicationContext } from "./_layout";

export default function LoginScreen() {
  const router = useRouter();
  const context = useContext(ApplicationContext);

  // state for form inputs and error message
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // guard if context not ready yet
  if (!context) return null;

  const { setUser } = context;

  // login function checks db for user and validates password
  const login = async () => {
    setError("");

    // query users table for matching username
    const found = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    // simple password check (no hashing just local validation)
    if (found.length === 0 || found[0].password !== password) {
      setError("Invalid username or password");
      return;
    }

    // store logged in user in global context
    setUser(found[0]);

    // navigate into main app after login
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Job Tracker</Text>

      {/* show error if login fails */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* username input */}
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="username"
      />

      {/* password input */}
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="password"
      />

      {/* triggers login function */}
      <Button title="Login" onPress={login} />

      <View style={styles.spacer} />

      {/* navigate to register screen */}
      <Button title="Register" onPress={() => router.push("/register")} />
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
