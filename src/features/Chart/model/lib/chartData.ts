import { Data, Variations } from "shared/api/api";

const labels = Data.map(d => {
   const date = new Date(d.date);
   return date.toLocaleDateString('ru-RU', {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric'
   });
})

const variationNames = Array.from(Variations.values());

const getCssVariable = (variableName: string): string => {
   return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
};

const datasets = variationNames.map((variationName, index) => {
   const strokeColor = getCssVariable(`--${index + 1}-stroke`);
   const fillColor = getCssVariable(`--${index + 1}-shadow`);

   return {
      label: variationName,
      data: Data.map(item => item[variationName] as number),
      borderColor: strokeColor || '',
      backgroundColor: fillColor || '',
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 0,
      pointHitRadius: 10,
      pointHoverBorderWidth: 0,
      pointBackgroundColor: 'transparent',
      pointHoverBackgroundColor: 'transparent',
   };
});

export const chartData = {
   labels: labels,
   datasets: datasets,
};

export type chartDataType = typeof chartData