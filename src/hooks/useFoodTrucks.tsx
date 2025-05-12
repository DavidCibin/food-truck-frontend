import { useState, useEffect } from "react";
import axios from "axios";
import { FoodTrucks, FoodTruckArraySchema } from "../schema/foodTruck";

/** ************************************************************** */
/* Interface */
interface UseFoodTrucksResult {
  foodTrucks: FoodTrucks[];
  allStatus: string[];
  loading: boolean;
}

/** ************************************************************** */
/* FoodTruck Hook */
export default function useFoodTrucks(): UseFoodTrucksResult {
  const [foodTrucks, setFoodTrucks] = useState<FoodTrucks[]>([]);
  const [allStatus, setAllStatus] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  /** ************************************************************** */
  /* Effects */
  useEffect(() => {
    const fetchFoodTrucks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://food-truck-backend-service-560894613073.us-south1.run.app/api/foodtrucks",
        );
        const parsed = FoodTruckArraySchema.safeParse(response.data);
        if (!parsed.success) {
          console.error("Invalid food truck data:", parsed.error);
          return;
        }
        const trucks = parsed.data;
        const statuses = [
          ...new Set(
            trucks.map((truck: FoodTrucks) => truck.status?.toUpperCase()).filter(Boolean),
          ),
        ] as string[];
        setFoodTrucks(trucks);
        setAllStatus(statuses);
      } catch (err) {
        console.error("Error fetching food trucks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodTrucks();
  }, []);

  return { foodTrucks, allStatus, loading };
}
