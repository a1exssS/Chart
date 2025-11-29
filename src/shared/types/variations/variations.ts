export const variationsSchema = {
   "0": 'Original',
   "10001": 'Variation A',
   "10002": 'Variation B',
   "10003": 'Variation C',
} as const;


export type VariationKeys = keyof typeof variationsSchema;
export type VariationLabel = typeof variationsSchema[VariationKeys];