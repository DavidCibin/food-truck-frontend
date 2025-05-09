import React from "react";
import { FoodTruckContext, FoodTruckContextType } from "./FoodTruckContext";

type ProviderProps = {
  children: React.ReactNode;
  value: FoodTruckContextType;
};

const FoodTruckProvider = ({ children, value }: ProviderProps) => (
  <FoodTruckContext.Provider value={value}>
    {children}
  </FoodTruckContext.Provider>
);

export default FoodTruckProvider;
