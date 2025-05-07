// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import React, { useEffect, useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useFoodTruck } from "../context/FoodTruckContext";

/** ************************************************************** */
/* SearchByGeolocation Component */
export default function SearchByGeolocation(): JSX.Element {
  /** ************************************************************** */
  /* Context */
  const { geolocationQuery, setGeolocationQuery } = useFoodTruck();

  /** ************************************************************** */
  /* State */
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [warning, setWarning] = useState("");

  /** ************************************************************** */
  /* Functions */
  const isValidCoordinate = (val: string, type: "lat" | "lon") => {
    const num = parseFloat(val);
    if (isNaN(num)) return false;
    if (type === "lat" && (num < -90 || num > 90)) return false;
    if (type === "lon" && (num < -180 || num > 180)) return false;
    return true;
  };

  const hasThreeDecimals = (val: string) => {
    const match = val.match(/\.(\d+)/);
    return match && match[1].length >= 3;
  };

  const handleSearch = () => {
    setWarning("");

    if (!isValidCoordinate(lat, "lat") || !isValidCoordinate(lon, "lon")) {
      setWarning("Please enter valid latitude and longitude values.");
      return;
    }

    if (!hasThreeDecimals(lat) || !hasThreeDecimals(lon)) {
      setWarning(
        "Please enter at least 3 decimal places for more accurate results.",
      );
      return;
    }

    setGeolocationQuery([Number(lat), Number(lon)]);
  };

  const handleClear = () => {
    setLat("");
    setLon("");
    setWarning("");
    setGeolocationQuery([]);
  };

  /** ************************************************************** */
  /* Effects */
  useEffect(() => {
    if (!lat && !lon && geolocationQuery.length === 2) {
      const [latitute, longitude] = geolocationQuery;
      setLat(String(latitute));
      setLon(String(longitude));
    }
  }, [lat, lon, setLat, setLon, geolocationQuery]);

  /** ************************************************************** */
  /* Render */
  return (
    <div className="my-4 min-w-80">
      <Form>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="latitude">Latitude</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Latitude (-90 to 90)"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            id="latitude"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="longitude">Longitude</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Longitude (-180 to 180)"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            id="longitude"
          />
        </Form.Group>

        {warning && (
          <Alert variant="warning" className="py-2">
            {warning}
          </Alert>
        )}

        <div className="flex gap-2 mt-3">
          <Button variant="secondary" onClick={handleClear}>
            Clear
          </Button>
          <Button variant="warning" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </Form>
    </div>
  );
}
