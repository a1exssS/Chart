import React from 'react'
import { Area } from 'recharts'
import type { Props } from 'recharts/types/cartesian/Area';
import type { VariationLabel } from 'shared/types/variations/variations';

const TareaFill = {
   blue: 'var(--blue-shadow)',
   skyblue: 'var(--skyblue-shadow)',
   black: 'var(--black-shadow)',
   orange: 'var(--orange-shadow)',
} as const;

const TareaStroke = {
   blue: 'var(--blue-stroke)',
   skyblue: 'var(--skyblue-stroke)',
   black: 'var(--black-stroke)',
   orange: 'var(--orange-stroke)',
} as const;

export type TareaStroke = typeof TareaStroke[keyof typeof TareaStroke];
export type TareaFill = typeof TareaFill[keyof typeof TareaFill];

interface TareaProps extends Omit<Props, 'dataKey' | 'stroke' | 'fill'> {
   dataKey: VariationLabel;
   stroke: TareaStroke;
   fill: TareaFill;
}

export const Tarea = ({ dataKey, stroke, fill, ...props }: TareaProps) => {
   return (
      <Area dataKey={dataKey} stroke={stroke} fill={fill} {...props} />
   )
}
