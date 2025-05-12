import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, type Mock } from "vitest";
import "@testing-library/jest-dom";
import Sidebar from "./Sidebar";
import { FoodTruckContext } from "../context/FoodTruckContext";

const mockContextValue = {
  nameOrAddressQuery: "",
  setNameOrAddressQuery: vi.fn(),
  geolocationQuery: [],
  setGeolocationQuery: vi.fn(),
  allStatus: ["APPROVED", "PENDING", "REJECTED"],
  statusFilter: [],
  setStatusFilter: vi.fn(),
  viewOption: "nameOrAddress",
  setViewOption: vi.fn(),
};

const renderWithContext = (
  ui: React.ReactElement,
  contextValue: typeof mockContextValue = mockContextValue,
) => {
  return render(
    <FoodTruckContext.Provider value={contextValue}>
      {ui}
    </FoodTruckContext.Provider>,
  );
};

vi.mock("./SearchByNameOrAddress", () => ({
  default: () => <div data-testid="search-by-name">Mocked SearchByNameOrAddress</div>,
}));

vi.mock("./SearchByGeolocation", () => ({
  default: () => 
    <div data-testid="search-by-geolocation">
      Search by Latitude and Longitude
    </div>
  }
));
vi.mock("./StatusFilter", () => ({
  default: (props: {
    allStatus: string[];
    statusFilter: string[];
    setStatusFilter: (filter: string[]) => void;
  }) => (
    <div data-testid="status-filter">
      Filter by Status:
      {props.allStatus.map((status: string) => (
        <label key={status}>
          <input
            type="checkbox"
            value={status}
            checked={props.statusFilter.includes(status)}
            onChange={(e) => {
              const newFilter = e.target.checked
                ? [...props.statusFilter, status]
                : props.statusFilter.filter((s) => s !== status);
              props.setStatusFilter(newFilter);
            }}
          />
          {status}
        </label>
      ))}
    </div>
  ),
}));


describe("Sidebar Component", () => {
  let setSidebarVisibleMock: Mock;
  let setViewOptionMock: Mock;
  let setStatusFilterMock: Mock;

  beforeEach(() => {
    setSidebarVisibleMock = vi.fn();
    setViewOptionMock = vi.fn();
    setStatusFilterMock = vi.fn();
    mockContextValue.setViewOption = setViewOptionMock;
    mockContextValue.setStatusFilter = setStatusFilterMock;
  });

  test("renders without crashing", () => {
    renderWithContext(
      <Sidebar isMobile={false} setSidebarVisible={setSidebarVisibleMock} />,
    );
    expect(screen.getByText("Search By:")).toBeInTheDocument();
  });

  test("renders mobile view with close button", () => {
    renderWithContext(
      <Sidebar isMobile={true} setSidebarVisible={setSidebarVisibleMock} />,
    );
    expect(screen.getByText("Options")).toBeInTheDocument();
    const closeButton = screen.getByAltText("Close icon");
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);
    expect(setSidebarVisibleMock).toHaveBeenCalledWith(false);
  });

  test('renders "Name or Address" and "Latitude and Longitude" radio buttons', () => {
    renderWithContext(
      <Sidebar isMobile={false} setSidebarVisible={setSidebarVisibleMock} />,
    );
    const nameOrAddressRadio = screen.getByLabelText("Name or Address");
    const geolocationRadio = screen.getByLabelText("Latitude and Longitude");
    expect(nameOrAddressRadio).toBeInTheDocument();
    expect(geolocationRadio).toBeInTheDocument();
  });

  test('renders SearchByNameOrAddress and StatusFilter when "Name or Address" is selected', () => {
    renderWithContext(
      <Sidebar isMobile={false} setSidebarVisible={setSidebarVisibleMock} />,
      {
        ...mockContextValue,
        viewOption: "nameOrAddress",
      },
    );
    expect(screen.getByTestId("search-by-name")).toBeInTheDocument();
    expect(screen.getByTestId("status-filter")).toBeInTheDocument();
  });

  test('renders SearchByGeolocation and StatusFilter when "Geolocation" is selected', () => {
    renderWithContext(
      <Sidebar isMobile={false} setSidebarVisible={setSidebarVisibleMock} />,
      {
        ...mockContextValue,
        viewOption: "Geolocation",
      },
    );
    expect(screen.getByTestId("search-by-geolocation")).toBeInTheDocument();
    expect(screen.getByTestId("status-filter")).toBeInTheDocument();
  });

  test('updates nameOrAddressFilter and calls setStatusFilter when status filter changes in "nameOrAddress" mode', () => {
    const contextValue = {
      ...mockContextValue,
      viewOption: "nameOrAddress",
      statusFilter: [],
    };
    renderWithContext(
      <Sidebar isMobile={false} setSidebarVisible={setSidebarVisibleMock} />,
      contextValue,
    );
    const approvedCheckbox = screen.getByLabelText("APPROVED");
    fireEvent.click(approvedCheckbox);
    expect(contextValue.setStatusFilter).toHaveBeenCalledWith(["APPROVED"]);
  });

  test('updates geolocationFilter and calls setStatusFilter when status filter changes in "Geolocation" mode', () => {
    const contextValue = {
      ...mockContextValue,
      viewOption: "Geolocation",
      statusFilter: [],
    };
    renderWithContext(
      <Sidebar isMobile={false} setSidebarVisible={setSidebarVisibleMock} />,
      contextValue,
    );
    const approvedCheckbox = screen.getByLabelText("APPROVED");
    fireEvent.click(approvedCheckbox);
    expect(contextValue.setStatusFilter).toHaveBeenCalledWith(["APPROVED"]);
  });
});
