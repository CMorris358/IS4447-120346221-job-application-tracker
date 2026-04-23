// testing tutorial week 12
// component test for formfield
// checks the label shows up and typing fires onchangetext
// got pattern from week 12 tutorial example

import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import FormField from "../components/ui/form-field";

describe("FormField", () => {
  it("renders the label and fires onChangeText", () => {
    // jest.fn creates a spy so we can check it was called later
    const onChangeTextMock = jest.fn();

    // render the component with empty value and our mock callback
    const { getByText, getByLabelText } = render(
      <FormField label="Company" value="" onChangeText={onChangeTextMock} />,
    );

    // label text should be visible on screen
    expect(getByText("Company")).toBeTruthy();

    // textinput should be findable by its accessibility label
    expect(getByLabelText("Company")).toBeTruthy();

    // simulates the user typing Apple into the textinput
    fireEvent.changeText(getByLabelText("Company"), "Apple");

    // this mock should have been called with the typed value
    expect(onChangeTextMock).toHaveBeenCalledWith("Apple");
  });
});
