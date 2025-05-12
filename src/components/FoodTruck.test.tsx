import { render, screen } from "@testing-library/react";
import { vi, type Mock } from "vitest";
import FoodTruck from "./FoodTruck";
import useFoodTrucks from "../hooks/useFoodTrucks";
import FoodTruckProvider from "../context/FoodTruckProvider";
import FoodTruckList from "./FoodTruckList.tsx";



// Mock the useFoodTrucks hook
vi.mock("../hooks/useFoodTrucks");
const mockUseFoodTrucks = useFoodTrucks as Mock;

// Mock the FoodTruckList component to avoid rendering its logic
vi.mock("./FoodTruckList.tsx", () => ({
  __esModule: true,
  default: vi.fn(() => (
    <div data-testid="food-truck-list">FoodTruckList</div>
  )),
}));
 
const mockFoodTruckList = FoodTruckList as Mock;

// Mock the Sidebar component to avoid rendering its logic
vi.mock("../components/Sidebar", () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid="sidebar">Sidebar</div>),
}));

// Directly mock the Spinner component
vi.mock("react-bootstrap/Spinner", () => ({
  __esModule: true,
  default: vi.fn(() => (
    <div data-testid="spinner" className="spinner-grow">
      Loading...
    </div>
  )),
}));

describe("FoodTruck Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock implementation before each test
    mockUseFoodTrucks.mockReturnValue({
      foodTrucks: [],
      allStatus: [],
      loading: false, // Default to not loading in beforeEach
    });
  });

  test("renders loading indicators when useFoodTrucks returns loading: true", () => {
    // Arrange: Set the mock useFoodTrucks to return loading: true
    mockUseFoodTrucks.mockReturnValue({
      foodTrucks: [],
      allStatus: [],
      loading: true,
    });

    // Act: Render the FoodTruck component within the FoodTruckProvider
    render(
      <FoodTruckProvider
        value={{
          nameOrAddressQuery: "",
          setNameOrAddressQuery: vi.fn(),
          geolocationQuery: [],
          setGeolocationQuery: vi.fn(),
          allStatus: [],
          statusFilter: [],
          setStatusFilter: vi.fn(),
          viewOption: "nameOrAddress",
          setViewOption: vi.fn(),
        }}
      >
        <FoodTruck />
      </FoodTruckProvider>,
    );

    // Assert: Check if the loading indicators (mocked Spinner) are rendered
    expect(screen.queryByTestId("food-truck-list")).toBeNull();
    expect(screen.getAllByTestId("spinner").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByTestId("sidebar")).toBeInTheDocument(); // Sidebar should still render
  });

  test("renders FoodTruckList with fetched data when not loading", () => {
    // Arrange: Set the mock useFoodTrucks to return some food truck data
    const mockFoodTruckData = [
      {
        objectid: 1,
        applicant: "Test Truck 1",
        status: "APPROVED",
        address: "123 Test St",
      },
      {
        objectid: 2,
        applicant: "Another Truck",
        status: "PENDING",
        address: "456 Other Ave",
      },
    ];
    const mockAllStatusData = ["APPROVED", "PENDING"];
    mockUseFoodTrucks.mockReturnValue({
      foodTrucks: mockFoodTruckData,
      allStatus: mockAllStatusData,
      loading: false,
    });

    // Act: Render the FoodTruck component within the FoodTruckProvider
    render(
      <FoodTruckProvider
        value={{
          nameOrAddressQuery: "",
          setNameOrAddressQuery: vi.fn(),
          geolocationQuery: [],
          setGeolocationQuery: vi.fn(),
          allStatus: mockAllStatusData, // Provide the mockAllStatusData here
          statusFilter: [],
          setStatusFilter: vi.fn(),
          viewOption: "nameOrAddress",
          setViewOption: vi.fn(),
        }}
      >
        <FoodTruck />
      </FoodTruckProvider>,
    );

    // Assert: Check if FoodTruckList is rendered and receives the correct food truck data in one of the calls
    const hasBeenCalledWithCorrectProps = mockFoodTruckList.mock.calls.some(
      (call) =>
        call[0]?.foodTrucks &&
        Array.isArray(call[0].foodTrucks) && // Add a check to ensure it's an array
        call[0].foodTrucks.length === mockFoodTruckData.length &&
        call[0].foodTrucks.every(
          (
            truck: {
              objectid: number;
              applicant: string;
              status: string;
              address: string;
            },
            index: number,
          ) =>
            truck.objectid === mockFoodTruckData[index].objectid &&
            truck.applicant === mockFoodTruckData[index].applicant,
        ),
    );
    expect(hasBeenCalledWithCorrectProps).toBe(true);
  });

  test("renders FoodTruckList with fetched data when not loading", () => {
    // Arrange
    const mockFoodTruckData = [
      {
        objectid: 1,
        applicant: "Test Truck 1",
        status: "APPROVED",
        address: "123 Test St",
      },
      {
        objectid: 2,
        applicant: "Another Truck",
        status: "PENDING",
        address: "456 Other Ave",
      },
    ];
    const mockAllStatusData = ["APPROVED", "PENDING"];
    mockUseFoodTrucks.mockReturnValue({
      foodTrucks: mockFoodTruckData,
      allStatus: mockAllStatusData,
      loading: false,
    });

    // Act
    render(
      <FoodTruckProvider
        value={{
          nameOrAddressQuery: "",
          setNameOrAddressQuery: vi.fn(),
          geolocationQuery: [],
          setGeolocationQuery: vi.fn(),
          allStatus: mockAllStatusData,
          statusFilter: [],
          setStatusFilter: vi.fn(),
          viewOption: "nameOrAddress",
          setViewOption: vi.fn(),
        }}
      >
        <FoodTruck />
      </FoodTruckProvider>,
    );

    // Assert
    expect(screen.getByTestId("food-truck-list")).toBeInTheDocument();
    expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
    expect(screen.queryByTestId("sidebar")).toBeInTheDocument();

    // Also optionally check that FoodTruckList was called with correct props
    expect(mockFoodTruckList).toHaveBeenCalledWith(
      expect.objectContaining({
        foodTrucks: expect.arrayContaining(mockFoodTruckData),
      }),
      expect.anything(), // Context (e.g., key)
    );
  });
});
