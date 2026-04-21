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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!context) return null;

  const { setUser } = context;

  const login = async () => {
    setError("");
    const found = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (found.length === 0 || found[0].password !== password) {
      setError("Invalid username or password");
      return;
    }

    setUser(found[0]);
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Job Tracker</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="username"
      />
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
      <Button title="Login" onPress={login} />
      <View style={styles.spacer} />
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
