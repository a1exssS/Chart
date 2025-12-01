import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import zoomPlugin from 'chartjs-plugin-zoom';
import annotationPlugin from 'chartjs-plugin-annotation';
import { verticalCrosshairPlugin } from 'shared/lib/crosshairPlugin/crosshairPlugin';
import { chartData } from '../model/lib/chartData';
import { CustomTooltip } from 'shared/ui/CustomTooltip/CustomTooltip';
import type { CustomTooltipData } from 'shared/types/tooltip/tooltip';
import { classNames } from 'shared/lib/classNames/classNames';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ThemeSwitcher } from 'shared/ui/ThemeSwitcher/ThemeSwitcher';
import styles from './Chart.module.scss';
import { Line } from 'react-chartjs-2';
import { useChartControls } from '../model/lib/useChartControls';
import PlusIcon from 'shared/assets/icons/plus.svg'
import MinusIcon from 'shared/assets/icons/minus.svg'
import ResetIcon from 'shared/assets/icons/reset.svg'

ChartJS.register(
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Filler,
   zoomPlugin,
   annotationPlugin,
   verticalCrosshairPlugin
);

const Chart = memo(() => {
   const chartRef = useRef<ChartJS<'line'>>(null);
   const [isShiftPressed, setIsShiftPressed] = useState(false);
   const [tooltipData, setTooltipData] = useState<CustomTooltipData>({
      isVisible: false,
      dataPoints: [],
      position: { x: 0, chartWidth: 0 },
      opacity: 0,
   });

   const { selected, data, update } = useChartControls(chartData);

   // Shift для панорамирования
   useEffect(() => {
      const down = (e: KeyboardEvent) => e.key === 'Shift' && setIsShiftPressed(true);
      const up = (e: KeyboardEvent) => e.key === 'Shift' && setIsShiftPressed(false);
      window.addEventListener('keydown', down);
      window.addEventListener('keyup', up);
      return () => {
         window.removeEventListener('keydown', down);
         window.removeEventListener('keyup', up);
      };
   }, []);

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
         opacity: 1,
         position: {
            x: tooltip.caretX,
            chartWidth: chartRef.current.width,
         },
      });
   }, []);

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
               modifierKey: 'shift' as const,
            },
            zoom: {
               wheel: { enabled: true },
               pinch: { enabled: true },
               mode: 'x',
            },
            limits: { x: { min: 0, max: data.labels.length - 1, minRange: 5 } },
         },
      },
      elements: {
         point: {
            radius: 0,
            hoverRadius: 0,
            hoverBorderWidth: 0,
            hitRadius: 15,
         },
      },
      scales: {
         x: {
            grid: {
               drawTicks: false,
               display: true,
            }
         },
         y: {
            beginAtZero: true,
            ticks: { callback: (value: any) => value + '%' },
            grid: {
               display: false,
               dash: [5, 5],
               dashOffset: 0,
               color: 'rgba(0, 0, 0, 0.2)'

            },
         },
      },
      transitions: {
         zoom: {
            animation: {
               duration: 1000,
               easing: 'easeOutCubic'
            }
         }
      },
   }), [externalTooltipHandler, data.datasets.length]);

   const resetZoom = useCallback(() => chartRef.current?.resetZoom(), []);
   const zoomIn = useCallback(() => chartRef.current?.zoom(1.2), []);
   const zoomOut = useCallback(() => chartRef.current?.zoom(0.8), []);

   const downloadPNGClean = () => {
      if (!chartRef.current) return;
      ChartJS.registry.plugins.unregister(verticalCrosshairPlugin);
      chartRef.current.update('none');
      requestAnimationFrame(() => {

         const url = chartRef.current!.toBase64Image('image/png', 1);

         const a = document.createElement('a');
         a.href = url;
         a.download = `chart-${new Date().toISOString().slice(0, 10)}.png`;
         a.click();

         ChartJS.register(verticalCrosshairPlugin);

         chartRef.current!.update('none');
      });
   };

   return (
      <div className={styles.Chart}>
         <div className={styles.ChartControlPanel}>
            <div className={styles.ChartControlPanelItem}>
               <Menu>
                  <MenuButton className={styles.ChartControlsButton}>
                     {selected.variations}
                  </MenuButton>
                  <MenuItems anchor="bottom" className={styles.VariationsBox}>
                     <MenuItem>
                        <button
                           className={styles.VariationsButton}
                           onClick={() => update({ variations: 'All variations selected' })}
                        >
                           All variations
                        </button>
                     </MenuItem>
                     {chartData.datasets.map(ds => (
                        <MenuItem key={ds.label}>
                           <button
                              className={styles.VariationsButton}
                              onClick={() => update({ variations: ds.label })}
                           >
                              {ds.label}
                           </button>
                        </MenuItem>
                     ))}
                  </MenuItems>
               </Menu>
               <Menu>
                  <MenuButton className={styles.ChartControlsButton}>
                     {selected.dates === 'Days' ? 'Day' : 'Week'}
                  </MenuButton>
                  <MenuItems anchor="bottom" className={styles.VariationsBox}>
                     <MenuItem>
                        <button
                           className={styles.VariationsButton}
                           onClick={() => update({ dates: 'Days' })}
                        >
                           Day

                        </button>
                     </MenuItem>
                     <MenuItem>
                        <button
                           className={styles.VariationsButton}
                           onClick={() => update({ dates: 'Weeks' })}
                        >
                           Week

                        </button>
                     </MenuItem>
                  </MenuItems>
               </Menu>
            </div>

            <div className={styles.ChartControlPanelItem}>
               <Menu>
                  <MenuButton className={styles.ChartControlsButton}>
                     Line style: {selected.style}
                  </MenuButton>
                  <MenuItems anchor="bottom" className={styles.VariationsBox}>
                     {(['curve', 'area', 'straight line'] as const).map(s => (
                        <MenuItem key={s}>
                           <button
                              className={styles.VariationsButton}
                              onClick={() => update({ style: s })}
                           >
                              {s}
                           </button>
                        </MenuItem>
                     ))}
                  </MenuItems>
               </Menu>

               <div className={styles.zoomButtons}>
                  <button onClick={zoomIn}>
                     <PlusIcon />
                  </button>
                  <button onClick={zoomOut}>
                     <MinusIcon />
                  </button>
                  <button onClick={resetZoom}>
                     <ResetIcon />
                  </button>
               </div>

            </div>
         </div>

         <div className={classNames(styles.ChartBox, { [styles.moveCursor]: isShiftPressed })}>
            <Line ref={chartRef} data={data} options={chartOptions} />
            <CustomTooltip {...tooltipData} />
         </div>

         <div className={styles.BottomControls}>
            <button onClick={downloadPNGClean} className={styles.ChartControlsButton}>
               Download PNG
            </button>
            <ThemeSwitcher />
         </div>
      </div>
   );
});

export default Chart;