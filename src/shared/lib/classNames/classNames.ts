type Mods = Record<string, boolean | string | undefined>

export function classNames(cls: string, mod?: Mods, additionals?: (string | undefined)[]): string {

   const mods = mod
      ? Object.entries(mod)
         .filter(([_, value]) => Boolean(value))
         .map(([cls, _]) => cls).join(' ')
      : ''

   const additionalClasses = additionals
      ? additionals.filter((cls) => cls !== null).join(' ')
      : ''

   return [
      cls,
      mods,
      additionalClasses,
   ].filter(Boolean).join(' ')
}