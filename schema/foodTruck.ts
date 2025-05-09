import { z } from "zod";

export const FoodTruckSchema = z.object({
  objectid: z.number(),
  applicant: z.string(),
  status: z.string(),
  fooditems: z.string().optional(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

export const FoodTruckArraySchema = z.array(FoodTruckSchema);

export type FoodTrucks = z.infer<typeof FoodTruckSchema>;
