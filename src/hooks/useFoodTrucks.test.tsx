import { renderHook, waitFor } from "@testing-library/react";
import { vi, type Mock, type Mocked } from "vitest";
import "jest";
import axios from "axios";
import { FoodTruckArraySchema } from "../../src/schema/foodTruck";
import useFoodTrucks from "../../src/hooks/useFoodTrucks";

// Mock the axios module
vi.mock("axios");
const mockedAxios = axios as Mocked<typeof axios>;

// Mock the schema validation
vi.mock("../../src/schema/foodTruck", () => ({
  FoodTruckArraySchema: {
    safeParse: vi.fn(),
  },
}));
const mockedSafeParse = FoodTruckArraySchema.safeParse as Mock;

describe("useFoodTrucks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should fetch food trucks successfully and update state", async () => {
    const mockFoodTrucks = [
      {
        objectid: 1,
        applicant: "Truck 1",
        status: "APPROVED",
        address: "Address 1",
      },
      {
        objectid: 2,
        applicant: "Truck 2",
        status: "PENDING",
        address: "Address 2",
      },
    ];
    const mockResponse = { data: mockFoodTrucks };
    mockedAxios.get.mockResolvedValue(mockResponse);
    mockedSafeParse.mockReturnValue({ success: true, data: mockFoodTrucks });

    const { result } = renderHook(() => useFoodTrucks());

    expect(result.current.loading).toBe(true);
    expect(result.current.foodTrucks).toEqual([]);
    expect(result.current.allStatus).toEqual([]);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.foodTrucks).toEqual(mockFoodTrucks);
    expect(result.current.allStatus).toEqual(["APPROVED", "PENDING"]);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "https://food-truck-backend-service-560894613073.us-south1.run.app/api/foodtrucks",
    );
    expect(mockedSafeParse).toHaveBeenCalledWith(mockFoodTrucks);
  });

  test("should handle API error", async () => {
    const mockError = new Error("Failed to fetch data");
    mockedAxios.get.mockRejectedValue(mockError);

    const { result } = renderHook(() => useFoodTrucks());

    expect(result.current.loading).toBe(true);
    expect(result.current.foodTrucks).toEqual([]);
    expect(result.current.allStatus).toEqual([]);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.foodTrucks).toEqual([]);
    expect(result.current.allStatus).toEqual([]);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "https://food-truck-backend-service-560894613073.us-south1.run.app/api/foodtrucks",
    );
    expect(mockedSafeParse).not.toHaveBeenCalled();
  });

  test("should handle invalid API response data", async () => {
    const mockInvalidData = [{ invalid: "data" }];
    const mockResponse = { data: mockInvalidData };
    mockedAxios.get.mockResolvedValue(mockResponse);
    mockedSafeParse.mockReturnValue({
      success: false,
      error: "Schema validation failed",
    });
    const consoleSpy = vi.spyOn(console, "error");

    const { result } = renderHook(() => useFoodTrucks());

    expect(result.current.loading).toBe(true);
    expect(result.current.foodTrucks).toEqual([]);
    expect(result.current.allStatus).toEqual([]);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.foodTrucks).toEqual([]);
    expect(result.current.allStatus).toEqual([]);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "https://food-truck-backend-service-560894613073.us-south1.run.app/api/foodtrucks",
    );
    expect(mockedSafeParse).toHaveBeenCalledWith(mockInvalidData);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Invalid food truck data:",
      "Schema validation failed",
    );

    consoleSpy.mockRestore();
  });
});
