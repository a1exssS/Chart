import { Chart as ChartJS } from "chart.js";

export const verticalCrosshairPlugin = {
   id: 'verticalCrosshair',
   afterDatasetsDraw(chart: ChartJS<'line'>) {
      const { ctx, tooltip, chartArea, scales } = chart;

      if (!tooltip || tooltip.opacity === 0 || !tooltip.dataPoints?.length) return;

      const dataIndex = tooltip.dataPoints[0].dataIndex;
      const xPixel = scales.x.getPixelForValue(dataIndex);

      if (xPixel < chartArea.left || xPixel > chartArea.right) return;

      ctx.save();

      ctx.beginPath();
      ctx.moveTo(xPixel, chartArea.top);
      ctx.lineTo(xPixel, chartArea.bottom);
      ctx.strokeStyle = '#64748b';
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.restore();
   }
};