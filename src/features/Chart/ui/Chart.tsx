import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './Chart.module.scss';
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Filler,
   type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';
import { chartData, type chartDataType } from '../model/lib/chartData';
import { CustomTooltip } from 'shared/ui/CustomTooltip/CustomTooltip';
import type { CustomTooltipData } from 'shared/types/tooltip/tooltip';
import { classNames } from 'shared/lib/classNames/classNames';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, zoomPlugin);

interface SelectedButtons {
   dates: 'Days' | 'Weeks';
   variations: string;
}

const Chart = memo(() => {
   const chartRef = useRef<ChartJS<'line'>>(null);
   const [isShiftPressed, setIsShiftPressed] = useState(false);
   const [data, setData] = useState<chartDataType>(chartData);
   const [selectedButtons, setSelectedButtons] = useState<SelectedButtons>({
      dates: 'Days',
      variations: 'All variations selected',
   });

   const [tooltipData, setTooltipData] = useState<CustomTooltipData>({
      isVisible: false,
      dataPoints: [],
      position: { x: 0, chartWidth: 0 },
      opacity: 0,
   });

   // Правильная обработка Shift для зума/пана
   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Shift') setIsShiftPressed(true);
      };
      const handleKeyUp = (e: KeyboardEvent) => {
         if (e.key === 'Shift') setIsShiftPressed(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      return () => {
         window.removeEventListener('keydown', handleKeyDown);
         window.removeEventListener('keyup', handleKeyUp);
      };
   }, []);

   // Кастомный тултип
   const externalTooltipHandler = useCallback((context: any) => {
      const { tooltip } = context;
      if (!chartRef.current) return;

      if (tooltip.opacity === 0) {
         setTooltipData(prev => ({ ...prev, isVisible: false, opacity: 0 }));
         return;
      }

      setTooltipData({
         isVisible: true,
         dataPoints: tooltip.dataPoints,
         opacity: tooltip.opacity,
         position: {
            x: tooltip.caretX,
            chartWidth: chartRef.current.width ?? 0,
         },
      });
   }, []);

   // Правильное группирование по неделям (берём последнее значение каждой недели)
   const groupByWeeks = (source: chartDataType): chartDataType => {
      const weeks: string[] = [];
      const newDatasets = source.datasets.map(ds => ({
         ...ds,
         data: [] as number[],
      }));

      for (let i = 0; i < source.labels.length; i++) {
         const day = parseInt(source.labels[i]);
         if (day % 7 === 1 || i === source.labels.length - 1) { // понедельник или последний день
            weeks.push(source.labels[i]);
            newDatasets.forEach((ds, idx) => ds.data.push(source.datasets[idx].data[i]));
         }
      }

      // Если последний день не понедельник — добавляем его
      if (parseInt(source.labels[source.labels.length - 1]) % 7 !== 1) {
         weeks.push(source.labels[source.labels.length - 1]);
         newDatasets.forEach((ds, idx) => ds.data.push(source.datasets[idx].data[source.labels.length - 1]));
      }

      return { labels: weeks, datasets: newDatasets };
   };

   // Динамические лимиты зума
   const getZoomLimits = () => ({
      x: { min: 0, max: data.labels.length - 1, minRange: 5 },
   });

   const chartOptions = useMemo<ChartOptions<'line'>>(() => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      events: ['mousemove', 'touchmove'],
      plugins: {
         legend: { display: false },
         tooltip: {
            // @ts-ignore
            events: ['mousemove', 'touchmove'],
            enabled: false,
            external: externalTooltipHandler,
         },
         zoom: {
            pan: {
               enabled: true,
               mode: 'x',
               modifierKey: 'shift',
            },
            zoom: {
               wheel: { enabled: true },
               pinch: { enabled: true },
               mode: 'x',
            },
            limits: getZoomLimits(),
         },
      },
      scales: {
         x: { grid: { display: true } },
         y: {
            beginAtZero: true,
            ticks: { callback: (value: any) => value + '%' },
            grid: { display: false },
         },
      },
   }), [externalTooltipHandler]);

   const resetZoom = () => chartRef.current?.resetZoom();
   const zoomIn = () => chartRef.current?.zoom(1.2);
   const zoomOut = () => chartRef.current?.zoom(0.8);

   const showAllVariations = () => {
      setSelectedButtons(prev => ({ ...prev, variations: 'All variations selected' }));
      const newData = selectedButtons.dates === 'Days' ? chartData : groupByWeeks(chartData);
      setData(newData);
   };

   const showSelectedVariation = (variation: string) => {
      setSelectedButtons(prev => ({ ...prev, variations: variation }));
      const filtered = chartData.datasets.filter(d => d.label === variation);
      const source = { ...chartData, datasets: filtered };
      const newData = selectedButtons.dates === 'Days' ? source : groupByWeeks(source);
      setData(newData);
   };

   const switchToDays = () => {
      setSelectedButtons(prev => ({ ...prev, dates: 'Days' }));
      const filtered = selectedButtons.variations === 'All variations selected'
         ? chartData.datasets
         : chartData.datasets.filter(d => d.label === selectedButtons.variations);
      setData({ ...chartData, datasets: filtered });
   };

   const switchToWeeks = () => {
      setSelectedButtons(prev => ({ ...prev, dates: 'Weeks' }));
      const filtered = selectedButtons.variations === 'All variations selected'
         ? chartData.datasets
         : chartData.datasets.filter(d => d.label === selectedButtons.variations);
      setData(groupByWeeks({ ...chartData, datasets: filtered }));
   };

   return (
      <div className={styles.Chart}>
         <div className={styles.ChartControlPanel}>
            <div className={styles.ChartControlsBox}>
               <div className={styles.ChartControlsItem}>
                  <Menu>
                     <MenuButton className={styles.ChartControlsButton}>
                        {selectedButtons.dates === 'Days' ? 'Day' : 'Week'}
                     </MenuButton>
                     <MenuItems anchor="bottom" className={styles.VariationsBox}>
                        <MenuItem>
                           <button onClick={switchToDays} className={styles.VariationsButton}>Day</button>
                        </MenuItem>
                        <MenuItem>
                           <button onClick={switchToWeeks} className={styles.VariationsButton}>Week</button>
                        </MenuItem>
                     </MenuItems>
                  </Menu>

                  <Menu>
                     <MenuButton className={styles.ChartControlsButton}>
                        {selectedButtons.variations}
                     </MenuButton>
                     <MenuItems anchor="bottom" className={styles.VariationsBox}>
                        <MenuItem>
                           <button onClick={showAllVariations} className={styles.VariationsButton}>
                              All variations selected
                           </button>
                        </MenuItem>
                        {chartData.datasets.map(item => (
                           <MenuItem key={item.label}>
                              <button
                                 onClick={() => showSelectedVariation(item.label)}
                                 className={styles.VariationsButton}
                              >
                                 {item.label}
                              </button>
                           </MenuItem>
                        ))}
                     </MenuItems>
                  </Menu>
               </div>

               <div className={styles.ChartControlsItem}>
                  <button onClick={resetZoom} className={styles.ChartControlsButton}>Reset Zoom</button>
                  <button onClick={zoomIn} className={styles.ChartControlsButton}>+</button>
                  <button onClick={zoomOut} className={styles.ChartControlsButton}>-</button>
               </div>
            </div>
         </div>

         <div className={classNames(styles.ChartBox, { [styles.moveCursor]: isShiftPressed })}>
            <Line ref={chartRef} data={data} options={chartOptions} />
            <CustomTooltip {...tooltipData} />
         </div>
      </div>
   );
});

export default Chart;