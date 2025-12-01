export type Variation = string | 'All variations selected';
export type DateRange = 'Days' | 'Weeks';
export type ChartStyle = 'curve' | 'area' | 'straight line';

export interface SelectedButtons {
   dates: DateRange;
   variations: Variation;
   style: ChartStyle;
}
