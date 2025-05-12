import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, type Mock } from "vitest";
import "@testing-library/jest-dom";
import SearchByNameOrAddress from "./SearchByNameOrAddress";
import { FoodTruckContext } from "../context/FoodTruckContext";

const mockContextValue = {
  nameOrAddressQuery: "",
  setNameOrAddressQuery: vi.fn(),
  geolocationQuery: [],
  setGeolocationQuery: vi.fn(),
  allStatus: [],
  statusFilter: [],
  setStatusFilter: vi.fn(),
  viewOption: "nameOrAddress",
  setViewOption: vi.fn(),
};

const renderWithContext = (
  ui: React.ReactElement,
  contextValue = mockContextValue,
) => {
  return render(
    <FoodTruckContext.Provider value={contextValue}>
      {ui}
    </FoodTruckContext.Provider>,
  );
};

describe("SearchByNameOrAddress Component", () => {
  let setNameOrAddressQueryMock: Mock;

  beforeEach(() => {
    setNameOrAddressQueryMock = vi.fn();
    mockContextValue.setNameOrAddressQuery = setNameOrAddressQueryMock;
  });

  test("renders without crashing", () => {
    renderWithContext(<SearchByNameOrAddress />);
    expect(
      screen.getByPlaceholderText(/enter name or address/i),
    ).toBeInTheDocument();
  });

  test("renders with the initial value from the context", () => {
    renderWithContext(<SearchByNameOrAddress />, {
      ...mockContextValue,
      nameOrAddressQuery: "Initial Search Value",
    });
    const inputElement = screen.getByPlaceholderText(
      /enter name or address/i,
    ) as HTMLInputElement;
    expect(inputElement.value).toBe("Initial Search Value");
  });

  test("calls setNameOrAddressQuery when the input value changes", () => {
    renderWithContext(<SearchByNameOrAddress />);
    const inputElement = screen.getByPlaceholderText(/enter name or address/i);
    fireEvent.change(inputElement, { target: { value: "New Search Value" } });
    expect(setNameOrAddressQueryMock).toHaveBeenCalledWith("New Search Value");
  });

  test("calls setNameOrAddressQuery on every input change", () => {
    renderWithContext(<SearchByNameOrAddress />);
    const inputElement = screen.getByPlaceholderText(/enter name or address/i);

    fireEvent.change(inputElement, { target: { value: "N" } });
    expect(setNameOrAddressQueryMock).toHaveBeenCalledWith("N");

    fireEvent.change(inputElement, { target: { value: "Ne" } });
    expect(setNameOrAddressQueryMock).toHaveBeenCalledWith("Ne");

    fireEvent.change(inputElement, { target: { value: "New" } });
    expect(setNameOrAddressQueryMock).toHaveBeenCalledWith("New");
  });

  test("renders with the correct data-testid on the root element", () => {
    renderWithContext(<SearchByNameOrAddress />);
    expect(screen.getByTestId("root")).toBeInTheDocument();
  });
});
