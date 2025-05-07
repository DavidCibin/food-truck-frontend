// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FoodTruckList from "./FoodTruckList";
import { FoodTrucks } from "../schema/foodTruck";

const mockFoodTrucks: FoodTrucks[] = [
  {
    objectid: 1,
    applicant: "Truck One",
    status: "APPROVED",
    fooditems: "Tacos, Burritos",
    address: "123 Main St",
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    objectid: 2,
    applicant: "Truck Two",
    status: "PENDING",
    fooditems: "Burgers, Fries",
    address: "456 Oak Ave",
    latitude: 37.8044,
    longitude: -122.2711,
  },
  {
    objectid: 3,
    applicant: "Truck Three",
    status: "DENIED",
    fooditems: "Pizza, Pasta",
    address: "789 Pine Ln",
    latitude: 37.6879,
    longitude: -122.4702,
  },
];

describe("FoodTruckList Component", () => {
  test("renders the container with the data-testid and classes", () => {
    render(<FoodTruckList foodTrucks={[]} />);
    const container = screen.getByTestId("food-truck-list");
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("m-8");
    expect(container).toHaveClass("bg-orange-50");
    expect(container).toHaveClass("p-4");
    expect(container).toHaveClass("rounded");
    expect(container).toHaveClass("shadow");
  });

  test('renders "No food trucks found." message when foodTrucks array is empty', () => {
    render(<FoodTruckList foodTrucks={[]} />);
    expect(screen.getByText("No food trucks found.")).toBeInTheDocument();
  });

  test("renders the correct number of food truck cards", () => {
    render(<FoodTruckList foodTrucks={mockFoodTrucks} />);
    const cardElements = screen.getAllByTestId("food-truck-card");
    expect(cardElements).toHaveLength(mockFoodTrucks.length);
  });

  test("renders food truck applicant name", () => {
    render(<FoodTruckList foodTrucks={mockFoodTrucks} />);
    expect(screen.getByText("Truck One")).toBeInTheDocument();
    expect(screen.getByText("Truck Two")).toBeInTheDocument();
    expect(screen.getByText("Truck Three")).toBeInTheDocument();
  });

  test("renders food truck status with correct capitalization", () => {
    render(<FoodTruckList foodTrucks={mockFoodTrucks} />);
    expect(screen.getByText("Status: approved")).toBeInTheDocument();
    expect(screen.getByText("Status: pending")).toBeInTheDocument();
    expect(screen.getByText("Status: denied")).toBeInTheDocument();
  });

  test("renders food truck food items", () => {
    render(<FoodTruckList foodTrucks={mockFoodTrucks} />);
    expect(screen.getByText("Tacos, Burritos")).toBeInTheDocument();
    expect(screen.getByText("Burgers, Fries")).toBeInTheDocument();
    expect(screen.getByText("Pizza, Pasta")).toBeInTheDocument();
  });

  test("renders food truck address", () => {
    render(<FoodTruckList foodTrucks={mockFoodTrucks} />);
    expect(screen.getByText("123 Main St")).toBeInTheDocument();
    expect(screen.getByText("456 Oak Ave")).toBeInTheDocument();
    expect(screen.getByText("789 Pine Ln")).toBeInTheDocument();
  });

  test("renders status color indicator with correct background color", () => {
    render(<FoodTruckList foodTrucks={mockFoodTrucks} />);
    const approvedIndicator =
      screen.getByText("Status: approved").nextElementSibling;
    expect(approvedIndicator).toHaveStyle({ backgroundColor: "green" });

    const pendingIndicator =
      screen.getByText("Status: pending").nextElementSibling;
    expect(pendingIndicator).toHaveStyle({ backgroundColor: "blue" });

    const deniedIndicator =
      screen.getByText("Status: denied").nextElementSibling;
    expect(deniedIndicator).toHaveStyle({ backgroundColor: "red" });
  });
});
