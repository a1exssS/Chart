import styles from './Tooltip.module.scss'
import { useCallback } from "react";
import Cup from 'shared/assets/icons/Cup.svg'
import Calendar from 'shared/assets/icons/clendar.svg'
import type { CustomTooltipData } from "shared/types/tooltip/tooltip";


const TOOLTIP_WIDTH = 228

export const CustomTooltip = ({ ...data }: CustomTooltipData) => {

   const placePosition = useCallback(() => {
      if (data.position.chartWidth) {
         return `${data.position.chartWidth / 2 < data.position.x ? data.position.x - TOOLTIP_WIDTH : data.position.x}px`
      } else {
         return `${data.position.x}px`
      }
   }, [data.position])

   if (!data.isVisible || data.opacity === 0 || data.dataPoints.length === 0) return null;

   const sortDataPoints = data.dataPoints.sort((a, b) => {
      const numA = Number(a.formattedValue || 0);
      const numB = Number(b.formattedValue || 0);
      return numB - numA;
   });

   const style: React.CSSProperties = {
      left: placePosition(),
      maxWidth: TOOLTIP_WIDTH + 'px'
   };


   return (
      <div style={style} className={styles.Overlay}>
         <span className={styles.Header}>
            <Calendar />{data.dataPoints[0].label}
         </span>
         <hr style={{ margin: '5px 0', borderColor: '#D3D3D3' }} />
         <div className={styles.Box}>
            {sortDataPoints.map((item, index) => (
               <div key={index} className={styles.Item}>
                  <span className={styles.TextLabel}>
                     <span style={{ background: item.dataset.borderColor as string }} />
                     {item.dataset.label}
                     {index === 0 && <Cup />}
                  </span>
                  <span className={styles.TextValue}>
                     {item.formattedValue}%
                  </span>
               </div>
            ))}

         </div>
      </div>
   );
};
