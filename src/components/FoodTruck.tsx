// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import React, { useState, useEffect } from "react";
import useFoodTrucks from "../hooks/useFoodTrucks";
import FoodTruckList from "../components/FoodTruckList";
import FoodTruckProvider from "../context/FoodTruckProvider";
import Sidebar from "../components/Sidebar";
import Spinner from "react-bootstrap/Spinner";
import { haversine } from "../utils/haversine";
import { FoodTrucks } from "../schema/foodTruck";

/** ************************************************************** */
/* FoodTruck Componet */
export default function FoodTruck(): JSX.Element {
  /** ************************************************************** */
  /* Hook */
  const {
    foodTrucks: fetchedFoodTrucks,
    allStatus: fetchedAllStatus,
    loading,
  } = useFoodTrucks();

  /** ************************************************************** */
  /* State */
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [nameOrAddressQuery, setNameOrAddressQuery] = useState<string>("");
  const [geolocationQuery, setGeolocationQuery] = useState<number[]>([]);
  const [viewOption, setViewOption] = useState<string>("nameOrAddress");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [sidebarVisible, setSidebarVisible] = useState(
    window.innerWidth >= 640,
  );
  const [filteredByNameOrAddress, setFilteredByNameOrAddress] = useState<
    FoodTrucks[]
  >([]);
  const [filteredByGeolocation, setFilteredByGeolocation] = useState<
    FoodTrucks[]
  >([]);

  /** ************************************************************** */
  /* Effects */
  useEffect(() => {
    if (!nameOrAddressQuery && statusFilter.length === 0) {
      setFilteredByNameOrAddress(fetchedFoodTrucks);
      return;
    }

    const result = fetchedFoodTrucks.filter((truck) => {
      const matchesQuery =
        truck.applicant
          ?.toLowerCase()
          .includes(nameOrAddressQuery.toLowerCase()) ||
        truck.address.toLowerCase().includes(nameOrAddressQuery.toLowerCase());

      const matchesStatus =
        statusFilter.length === 0 ||
        statusFilter.includes(truck.status?.toUpperCase() || "");
      return matchesQuery && matchesStatus;
    });

    setFilteredByNameOrAddress(result);
  }, [fetchedFoodTrucks, nameOrAddressQuery, statusFilter]);

  useEffect(() => {
    if (geolocationQuery.length !== 2) {
      setFilteredByGeolocation([]);
      return;
    }

    const [lat, lon] = geolocationQuery;

    const result = fetchedFoodTrucks
      .filter(
        (truck) =>
          truck.latitude !== undefined &&
          truck.longitude !== undefined &&
          (statusFilter.length === 0 ||
            statusFilter.includes(truck.status?.toUpperCase() || "")),
      )
      .map((truck) => ({
        ...truck,
        distance: haversine(
          lat,
          lon,
          Number(truck.latitude),
          Number(truck.longitude),
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);

    setFilteredByGeolocation(result);
  }, [fetchedFoodTrucks, geolocationQuery, statusFilter]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      setSidebarVisible(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /** ************************************************************** */
  /* Render */
  return (
    <FoodTruckProvider
      value={{
        nameOrAddressQuery,
        setNameOrAddressQuery,
        geolocationQuery,
        setGeolocationQuery,
        allStatus: fetchedAllStatus, // Use fetchedAllStatus from the hook
        statusFilter,
        setStatusFilter,
        viewOption,
        setViewOption,
      }}
    >
      <div className="flex flex-col sm:flex-row w-full">
        {sidebarVisible && (
          <Sidebar isMobile={isMobile} setSidebarVisible={setSidebarVisible} />
        )}

        <div
          className="w-full justify-items-center"
          style={{
            paddingLeft:
              (!isMobile && sidebarVisible) || (!isMobile && !sidebarVisible)
                ? "24rem"
                : 0,
          }}
        >
          <div
            className="flex items-center w-full p-3 sticky top-0 z-10 bg-white"
            style={{
              justifyContent: sidebarVisible ? "center" : "space-between",
            }}
          >
            {(!isMobile || !sidebarVisible) && (
              <div className="flex items-baseline gap-2 cursor-pointer">
                <img
                  src="/src/assets/food-icon.svg"
                  alt="Food icon"
                  className="mb-1 sm:w-8 sm:h-8 w-6 h-6"
                />
                <h1
                  className="sm:text-3xl text-xl text-orange-400"
                  style={{
                    fontFamily: "cursive",
                  }}
                >
                  Mobile Food Finder
                </h1>
              </div>
            )}

            {isMobile && !sidebarVisible && (
              <img
                src="/src/assets/burger-menu.svg"
                alt="Menu icon"
                onClick={() => setSidebarVisible(true)}
                className="cursor-pointer mb-2 w-7 h-7"
              />
            )}
          </div>

          <div className="d-flex gap-3 w-fit wrap">
            {loading ? (
              <>
                <Spinner animation="grow" size="sm" variant="primary" />
                <Spinner animation="grow" size="sm" variant="secondary" />
                <Spinner animation="grow" size="sm" variant="success" />
                <Spinner animation="grow" size="sm" variant="danger" />
                <Spinner animation="grow" size="sm" variant="warning" />
                <Spinner animation="grow" size="sm" variant="info" />
              </>
            ) : (
              <FoodTruckList
                foodTrucks={
                  viewOption === "nameOrAddress"
                    ? filteredByNameOrAddress
                    : filteredByGeolocation
                }
              />
            )}
          </div>
        </div>
      </div>
    </FoodTruckProvider>
  );
}
