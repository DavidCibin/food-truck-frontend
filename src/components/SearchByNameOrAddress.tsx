// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import React from "react";
import { useFoodTruck } from "../context/FoodTruckContext";
import { Form } from "react-bootstrap";

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
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Enter Name or Address"
          value={nameOrAddressQuery}
          onChange={(e) => setNameOrAddressQuery(e.target.value)}
          id="applicant-or-adress"
        />
      </Form.Group>
    </div>
  );
}
