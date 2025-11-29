interface VisitsData {
   [key: string]: number | undefined;
}

interface ConversionsData {
   [key: string]: number | undefined;
}

export interface OriginalDataItem {
   date: string;
   visits: VisitsData;
   conversions: ConversionsData;
}

export interface TransformedDataItem {
   date: string;
   [variation: string]: string | number;
}

// types.ts
export interface OriginalDataItem {
   date: string;
   visits: { [key: string]: number | undefined };
   conversions: { [key: string]: number | undefined };
}

export interface WeekDataItem {
   week: string;
   [variation: string]: number | string;
}

export type Period = 'day' | 'week';