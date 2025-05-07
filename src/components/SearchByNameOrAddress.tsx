// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import React from "react";
import { useFoodTruck } from "../context/FoodTruckContext";

/** ************************************************************** */
/* SearchByNameOrAddress Component */
export default function SearchByNameOrAddress(): JSX.Element {
  /** ************************************************************** */
  /* Context */
  const { nameOrAddressQuery, setNameOrAddressQuery } = useFoodTruck();

  /** ************************************************************** */
  /* Render */
  return (
    <div className="my-4 min-w-80" data-testid="root">
      <input
        type="text"
        className="p-2 border rounded w-full"
        placeholder="Enter Name or Address"
        value={nameOrAddressQuery}
        onChange={(e) => setNameOrAddressQuery(e.target.value)}
      />
    </div>
  );
}
