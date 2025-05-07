import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Form } from "react-bootstrap";
import SearchByNameOrAddress from "./SearchByNameOrAddress";
import StatusFilter from "./StatusFilter";
import { useFoodTruck } from "../context/FoodTruckContext";
import SearchByGeolocation from "./SearchByGeolocation";

/** ************************************************************** */
/* Types */
type SidebarProps = {
  isMobile: boolean;
  setSidebarVisible: Dispatch<SetStateAction<boolean>>;
};

/** ************************************************************** */
/* Sidebar Component */
export default function Sidebar({
  isMobile,
  setSidebarVisible,
}: SidebarProps): JSX.Element {
  /** ************************************************************** */
  /* Context */
  const { allStatus, setStatusFilter, viewOption, setViewOption } =
    useFoodTruck();

  /** ************************************************************** */
  /* Ref */
  const hasVisitedGeolocation = useRef(false);

  /** ************************************************************** */
  /* State */
  const [nameOrAddressFilter, setNameOrAddressFilter] = useState<string[]>([]);
  const [geolocationFilter, setGeolocationFilter] = useState<string[]>([]);

  /** ************************************************************** */
  /* Effects */
  useEffect(() => {
    if (viewOption === "nameOrAddress") {
      setStatusFilter(nameOrAddressFilter);
    } else {
      if (!hasVisitedGeolocation.current) {
        const initial = ["APPROVED"];
        setGeolocationFilter(initial);
        setStatusFilter(initial);
        hasVisitedGeolocation.current = true;
      } else {
        setStatusFilter(geolocationFilter);
      }
    }
  }, [
    viewOption,
    nameOrAddressFilter,
    geolocationFilter,
    setStatusFilter,
    setGeolocationFilter,
  ]);

  /** ************************************************************** */
  /* Functions */
  const handleStatusFilterChange = (newFilter: string[]) => {
    if (viewOption === "nameOrAddress") {
      setNameOrAddressFilter(newFilter);
    } else {
      setGeolocationFilter(newFilter);
    }
    setStatusFilter(newFilter);
  };

  /** ************************************************************** */
  /* Render */
  return (
    <div className="w-full sm:w-96 sm:min-h-full h-auto sm:fixed sticky bg-orange-50 p-4 border-b sm:border-b-0 sm:border-r top-0 z-20">
      {isMobile && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="text-orange-400">Options</h3>
          <img
            src="/src/assets/close-square.svg"
            alt="Close icon"
            onClick={() => setSidebarVisible(false)}
            className="cursor-pointer"
            style={{ width: "2rem", height: "2rem" }}
          />
        </div>
      )}

      <Form>
        <Form.Group className="mb-3">
          <Form.Label className="fw-medium">Search By:</Form.Label>
          <div>
            <Form.Check
              type="radio"
              id="name-address-search"
              name="viewOption"
              label="Name or Address"
              value="nameOrAddress"
              checked={viewOption === "nameOrAddress"}
              onChange={() => setViewOption("nameOrAddress")}
            />
            <Form.Check
              type="radio"
              id="geolocation-search"
              name="viewOption"
              label="Latitude and Longitude"
              value="Geolocation"
              checked={viewOption === "Geolocation"}
              onChange={() => setViewOption("Geolocation")}
            />
          </div>
        </Form.Group>
      </Form>

      {viewOption === "nameOrAddress" ? (
        <>
          <SearchByNameOrAddress />
          <StatusFilter
            allStatus={allStatus}
            statusFilter={nameOrAddressFilter}
            setStatusFilter={handleStatusFilterChange}
          />
        </>
      ) : (
        <>
          <SearchByGeolocation />
          <StatusFilter
            allStatus={allStatus}
            statusFilter={geolocationFilter}
            setStatusFilter={handleStatusFilterChange}
          />
        </>
      )}
    </div>
  );
}
