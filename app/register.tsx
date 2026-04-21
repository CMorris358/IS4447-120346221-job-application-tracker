import { db } from "@/db/client";
import { users } from "@/db/schema";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { ApplicationContext } from "./_layout";

export default function RegisterScreen() {
  const router = useRouter();
  const context = useContext(ApplicationContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!context) return null;
  const { setUser } = context;

  const register = async () => {
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Fill in all fields");
      return;
    }

    try {
      const inserted = await db
        .insert(users)
        .values({ username, password })
        .returning();

      setUser(inserted[0]);
      router.replace("/(tabs)");
    } catch (e) {
      setError("Username already taken");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Register" onPress={register} />
      <View style={styles.spacer} />
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
