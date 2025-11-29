import ChartData from 'server/data.json';

export const Variations = new Map<number, string>()

ChartData.variations.map((item) => {
   Variations.set(item.id, item.name)
})

interface DataItem {
   date: string;
   visits: Record<string, number | undefined>;
   conversions: Record<string, number | undefined>;
}

export interface DataProps {
   date: string;
   [key: string]: number | string;
}

export const Data = ChartData.data.map((item: DataItem): DataProps => {
   const transformedItem: DataProps = { date: item.date };

   Object.keys(item.visits).forEach((variation) => {
      const visits = item.visits[variation] ?? 0;
      const conversions = item.conversions[variation] ?? 0;
      const variationValue = Variations.get(Number(variation));

      if (variationValue) {
         const conversionRate = visits > 0 ? (conversions / visits) * 100 : 0;
         transformedItem[variationValue] = Number(conversionRate.toFixed(1));
      }
   });

   return transformedItem;
});

