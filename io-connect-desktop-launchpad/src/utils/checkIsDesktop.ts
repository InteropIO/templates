export const checkIsDesktop = (): boolean =>
  typeof (window as any).glue42gd !== "undefined" ||
  typeof (window as any).glue42alert !== "undefined" ||
  typeof (window as any).glue42dialog !== "undefined" ||
  typeof (window as any).iodesktop !== "undefined";
