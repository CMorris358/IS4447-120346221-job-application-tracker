// integration test for the list screen
// wraps it in a fake context with one application
// and checks the card and add button appear

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

// fake router so useRouter does not error without a navigation context
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

// fake safeareaview because the real one needs a provider wrapper
jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return { SafeAreaView: View };
});

// sample application passed in through fake context
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
        value={{ applications: [mockApplication], setApplications: jest.fn() }}
      >
        <IndexScreen />
      </ApplicationContext.Provider>,
    );

    // waitfor handles any async rendering the screen does on mount
    await waitFor(() => {
      expect(getByText("Test Company")).toBeTruthy();
      expect(getByText("Add Application")).toBeTruthy();
    });
  });
});
