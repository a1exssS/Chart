import type { TooltipItem } from "chart.js"

export type CustomTooltipData = {
   isVisible: boolean,
   dataPoints: TooltipItem<'line'>[],
   position: {
      chartWidth?: number,
      x: number
   },
   opacity: number,
}
