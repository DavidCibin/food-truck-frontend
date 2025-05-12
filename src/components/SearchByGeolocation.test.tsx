import { render, screen, fireEvent } from "@testing-library/react";
import { vi, type Mock } from "vitest";
import "@testing-library/jest-dom";
import SearchByGeolocation from "./SearchByGeolocation";
import { FoodTruckContext } from "../context/FoodTruckContext";

const mockContextValue = {
  nameOrAddressQuery: "",
  setNameOrAddressQuery: vi.fn(),
  geolocationQuery: [],
  setGeolocationQuery: vi.fn(),
  allStatus: [],
  statusFilter: [],
  setStatusFilter: vi.fn(),
  viewOption: "Geolocation",
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

describe("SearchByGeolocation Component", () => {
  let setGeolocationQueryMock: Mock;

  beforeEach(() => {
    setGeolocationQueryMock = vi.fn();
    mockContextValue.setGeolocationQuery = setGeolocationQueryMock;
  });

  test("renders without crashing", () => {
    renderWithContext(<SearchByGeolocation />);
    expect(screen.getByLabelText(/latitude/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/longitude/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
  });

  test("updates latitude state when latitude input changes", () => {
    renderWithContext(<SearchByGeolocation />);
    const latitudeInput = screen.getByLabelText(/latitude/i);
    fireEvent.change(latitudeInput, { target: { value: "40.712" } });
    expect((latitudeInput as HTMLInputElement).value).toBe("40.712");
  });

  test("updates longitude state when longitude input changes", () => {
    renderWithContext(<SearchByGeolocation />);
    const longitudeInput = screen.getByLabelText(/longitude/i);
    fireEvent.change(longitudeInput, { target: { value: "-74.006" } });
    expect((longitudeInput as HTMLInputElement).value).toBe("-74.006");
  });

  test("displays warning for invalid latitude", () => {
    renderWithContext(<SearchByGeolocation />);
    const latitudeInput = screen.getByLabelText(/latitude/i);
    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.change(latitudeInput, { target: { value: "100" } });
    fireEvent.click(searchButton);
    expect(
      screen.getByText(/please enter valid latitude and longitude values/i),
    ).toBeInTheDocument();
  });

  test("displays warning for invalid longitude", () => {
    renderWithContext(<SearchByGeolocation />);
    const longitudeInput = screen.getByLabelText(/longitude/i);
    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.change(longitudeInput, { target: { value: "-200" } });
    fireEvent.click(searchButton);
    expect(
      screen.getByText(/please enter valid latitude and longitude values/i),
    ).toBeInTheDocument();
  });

  test("displays warning for insufficient decimal places", () => {
    renderWithContext(<SearchByGeolocation />);
    const latitudeInput = screen.getByLabelText(/latitude/i);
    const longitudeInput = screen.getByLabelText(/longitude/i);
    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.change(latitudeInput, { target: { value: "40.71" } });
    fireEvent.change(longitudeInput, { target: { value: "-74.00" } });
    fireEvent.click(searchButton);
    expect(
      screen.getByText(/please enter at least 3 decimal places/i),
    ).toBeInTheDocument();
  });

  test("calls setGeolocationQuery with correct coordinates on valid input and search", () => {
    renderWithContext(<SearchByGeolocation />);
    const latitudeInput = screen.getByLabelText(/latitude/i);
    const longitudeInput = screen.getByLabelText(/longitude/i);
    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.change(latitudeInput, { target: { value: "40.712" } });
    fireEvent.change(longitudeInput, { target: { value: "-74.006" } });
    fireEvent.click(searchButton);
    expect(setGeolocationQueryMock).toHaveBeenCalledWith([40.712, -74.006]);
    expect(
      screen.queryByText(/please enter valid latitude and longitude values/i),
    ).toBeNull();
    expect(
      screen.queryByText(/please enter at least 3 decimal places/i),
    ).toBeNull();
  });
});
