import { useCallback, useMemo, useState } from "react";
import type { chartDataType } from "./chartData";
import type { ChartStyle, SelectedButtons, Variation } from "../types/chart";


export const useChartControls = (baseData: chartDataType) => {
   const [selected, setSelected] = useState<SelectedButtons>({
      dates: 'Days',
      variations: 'All variations selected',
      style: 'area',
   });

   const getProcessedData = useCallback(() => {
      const datasets = filterByVariation(baseData.datasets, selected.variations);

      const dataSource = selected.dates === 'Weeks'
         ? groupByWeeks({ ...baseData, datasets })
         : { ...baseData, datasets };

      return {
         ...dataSource,
         datasets: applyStyle(dataSource.datasets, selected.style),
      };
   }, [baseData, selected]);

   const update = useCallback((updates: Partial<SelectedButtons>) => {
      setSelected(prev => {
         const newState = { ...prev, ...updates };
         return newState;
      });
   }, []);

   const data = useMemo(() => getProcessedData(), [getProcessedData]);

   return { selected, data, update };
};


const applyStyle = (datasets: any[], style: ChartStyle) => {
   const tension = style === 'straight line' ? 0 : 0.4;
   const fill = style === 'area';

   return datasets.map(d => ({ ...d, tension, fill }));
};

const filterByVariation = (datasets: any[], variation: Variation) =>
   variation === 'All variations selected'
      ? datasets
      : datasets.filter(d => d.label === variation);

const groupByWeeks = (source: chartDataType): chartDataType => {
   const weeks: string[] = [];
   const weekData = source.datasets.map(ds => ({ ...ds, data: [] as number[] }));

   for (let i = 0; i < source.labels.length; i += 7) {
      const weekSum = source.datasets.map((ds) => {
         let sum = 0;
         for (let j = i; j < i + 7 && j < source.labels.length; j++) {
            sum += ds.data[j] ?? 0;
         }
         return sum;
      });

      weeks.push(`Week ${(i / 7) + 1}`);
      weekData.forEach((ds, idx) => ds.data.push(weekSum[idx]));
   }

   return { labels: weeks, datasets: weekData };
};
