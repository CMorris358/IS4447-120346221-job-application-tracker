// integration test for the list screen
// wraps it in a fake context with one application
// checks the card and add button appear
// updated context to match current app structure

import { render, waitFor } from "@testing-library/react-native";
import React from "react";
import IndexScreen from "../app/(tabs)/index";
import { ApplicationContext } from "../app/_layout";

// fake db so the screen does not try to open sqlite during the test
jest.mock("@/db/client", () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

// fake router so useRouter does not error
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
}));

// fake safe area view
jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return { SafeAreaView: View };
});

// sample application
const mockApplication = {
  id: 1,
  company: "Test Company",
  category: "Developer",
  date: "2026-04-01",
  count: 0,
};

describe("IndexScreen", () => {
  it("renders the application and the add button", async () => {
    const { getByText } = render(
      <ApplicationContext.Provider
        value={{
          applications: [mockApplication],
          setApplications: jest.fn(),
          targets: [],
          setTargets: jest.fn(),
          categories: [],
          setCategories: jest.fn(),
          statusLogs: [],
          setStatusLogs: jest.fn(),
          user: { id: 1, username: "user", password: "1234" }, // needed for login check
          setUser: jest.fn(),
          theme: "light", // needed for theme logic
          setTheme: jest.fn(),
        }}
      >
        <IndexScreen />
      </ApplicationContext.Provider>,
    );
    // Updated to match app as changed wording
    await waitFor(() => {
      expect(getByText("Test Company")).toBeTruthy();
      expect(getByText(/add/i)).toBeTruthy();
    });
  });
});
