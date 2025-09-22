import type { Schema } from "../../amplify/data/resource";

export type TankExtended = Schema['Aquarium']['type']

export type Tank = Omit< TankExtended,'id' | 'createdAt' | 'updatedAt'>

export const TankTypeValues = ['Freshwater', 'Saltwater', 'Tropical', 'Arctic'] as const;
export type TankType = (typeof TankTypeValues)[number];