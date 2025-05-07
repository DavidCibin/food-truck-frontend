import { createContext, useContext } from "react";

export type FoodTruckContextType = {
  nameOrAddressQuery: string;
  setNameOrAddressQuery: (query: string) => void;
  geolocationQuery: number[];
  setGeolocationQuery: (query: number[]) => void;
  allStatus: string[];
  statusFilter: string[];
  setStatusFilter: (filter: string[]) => void;
  viewOption: string;
  setViewOption: (filter: string) => void;
};

export const FoodTruckContext = createContext<FoodTruckContextType | null>(
  null,
);

export const useFoodTruck = () => {
  const context = useContext(FoodTruckContext);
  if (!context) {
    throw new Error("useFoodTruck must be used within a FoodTruckProvider");
  }
  return context;
};
